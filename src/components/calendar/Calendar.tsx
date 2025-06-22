import React from "react";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { type MeetingData } from "../meeting/Meeting";
import DetailPanel from "../detailPanel/DetailPanel";
import { useGetAppointmentsQuery } from "../../services/appointment";
import "./Calendar.scss";
import CreateModal from "../createModal/CreateModal";

export const START_HOUR = 8;
export const END_HOUR = 20;
export const INTERVAL_MINUTES = 30;

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [noAppointmentsFound, setNoAppointmentsFound] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(
    null,
  );
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [detailPanelState, setDetailPanelState] = useState<{
    isOpen: boolean;
    meetingId: number | null;
  }>({ isOpen: false, meetingId: null });

  /* This is not ideal as a new request is sent after the date is set
  in case of no meetings on the current date, but future meetings found.
  The response will be the same as the original request's. */
  const {
    data: appointmentsResponse,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetAppointmentsQuery({
    date: (selectedDate ?? dayjs(new Date())).format("YYYY-MM-DD"),
  });

  useEffect(() => {
    const today = dayjs(new Date());
    setSelectedDate(today);
  }, []);

  /* Displays no meetings found text if no more meetings are found. */
  useEffect(() => {
    if (isError && error) {
      if ("status" in error) {
        if (error.status === 404) {
          setNoAppointmentsFound(true);
          setMeetings([]);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } else {
      setNoAppointmentsFound(false);
    }
  }, [isError, error]);

  /* After appointments are fetched, sets the date (of the next
  appointments) and the appointments array from the response. */
  useEffect(() => {
    if (isLoading || !appointmentsResponse) return;

    setMeetings(appointmentsResponse.appointments);
    setSelectedDate(dayjs(appointmentsResponse.date));
  }, [appointmentsResponse, isLoading]);

  useEffect(() => {
    if (selectedMeetingId) {
      setDetailPanelState({ isOpen: true, meetingId: selectedMeetingId });
    } else {
      setDetailPanelState({ isOpen: false, meetingId: null });
    }
  }, [selectedMeetingId]);

  const closeDetailPanel = () => {
    setSelectedMeetingId(null);
    setDetailPanelState({ isOpen: false, meetingId: null });
  };

  // Sets the date to the previous or the next day
  const changeDate = (direction: number) => {
    if (selectedDate) {
      const newDate = selectedDate.add(direction, "day");
      setSelectedDate(newDate);
    }
  };

  // Converts a Date object into a grid row index
  const timeToGridRow = (time: Date) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const totalMinutes = (hour - START_HOUR) * 60 + minute;

    return Math.floor(totalMinutes / INTERVAL_MINUTES) + 1;
  };

  const calculateMeetingPosition = (meeting: MeetingData) => {
    const gridRowStart = timeToGridRow(new Date(meeting.start_time));
    const gridRowEnd = timeToGridRow(new Date(meeting.end_time));

    return {
      gridRowStart,
      gridRowEnd,
    };
  };

  const renderHourLabels = () => {
    const labels = [];
    const rowsPerHour = 2;

    for (let i = START_HOUR; i <= END_HOUR; i++) {
      // Multiplying by rowsPerHour so that hour labels span over 2 rows
      const startGridRow = (i - START_HOUR) * rowsPerHour + 1;
      labels.push(
        <div
          key={i}
          className="hour-label"
          style={{
            gridRow: `${startGridRow} / span ${rowsPerHour}`,
          }}
        >
          {i}:00
        </div>,
      );
    }
    return labels;
  };

  const renderGridLines = () => {
    const lines = [];
    // Multyplying by 2 as we have 30min rows
    const totalSlots = (END_HOUR - START_HOUR) * 2;
    for (let i = 0; i < totalSlots; i++) {
      lines.push(
        <div
          key={`row-${i}`}
          className="time-slot"
          style={{
            gridRow: i + 1,
            borderBottom: i % 2 === 0 ? "1px solid #ccc" : "1px solid #999",
          }}
        />,
      );
    }
    return lines;
  };

  const renderMeetingBlocks = () => {
    return meetings?.map((meeting: MeetingData) => {
      const { gridRowStart, gridRowEnd } = calculateMeetingPosition(meeting);

      return (
        <div
          key={meeting.id}
          className="meeting"
          onClick={() => setSelectedMeetingId(meeting.id)}
          style={{
            gridRowStart: gridRowStart,
            gridRowEnd: gridRowEnd,
          }}
        >
          <strong>{meeting.title}</strong>
          <br />
          {new Date(meeting.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(meeting.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    });
  };

  const createAppointment = () => {
    setSelectedMeetingId(null);
    setCreateModalOpen(true);
  };

  return (
    <div className="calendar-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="calendar-header">
          <ArrowLeftIcon
            className="pager-arrow"
            onClick={() => changeDate(-1)}
          />
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
          <ArrowRightIcon
            className="pager-arrow"
            onClick={() => changeDate(1)}
          />
        </div>

        <div className="calendar-grid">
          {isLoading && <div className="loading">Loading...</div>}
          {noAppointmentsFound && (
            <div className="error">
              No appointments found for this or any future date.
            </div>
          )}
          {isSuccess && appointmentsResponse && (
            <>
              {renderHourLabels()}
              {renderGridLines()}
              {renderMeetingBlocks()}
            </>
          )}
        </div>
        <Button onClick={() => createAppointment()}>New appointment</Button>
        {selectedMeetingId && (
          <DetailPanel
            isOpen={selectedMeetingId !== null && detailPanelState.isOpen}
            close={() => closeDetailPanel()}
            meeting={meetings.find(
              (meeting) => meeting.id === selectedMeetingId,
            )}
          />
        )}
        {isCreateModalOpen && (
          <CreateModal
            close={() => {
              setCreateModalOpen(false);
            }}
          />
        )}
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
