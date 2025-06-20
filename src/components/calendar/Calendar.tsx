import React from "react";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { type MeetingData } from "../meeting/Meeting";
import "./Calendar.scss";

export const START_HOUR = 8;
export const END_HOUR = 20;
export const INTERVAL_MINUTES = 30;

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [meetings, setMeetings] = useState<MeetingData[]>([]);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(dayjs(today));
    const meetingResponse: MeetingData[] = [
      {
        id: 1,
        title: "Meeting 1",
        description: "Lorem ipsum",
        start_time: dayjs(today).hour(10).minute(0).second(0).toDate(),
        end_time: dayjs(today).hour(11).minute(0).second(0).toDate(),
      },
      {
        id: 2,
        title: "Meeting 2",
        description: "Something something",
        start_time: dayjs(today).hour(12).minute(0).second(0).toDate(),
        end_time: dayjs(today).hour(13).minute(30).second(0).toDate(),
      },
      {
        id: 3,
        title: "Meeting 3",
        description: "Yet another one",
        start_time: dayjs(today).hour(16).minute(0).second(0).toDate(),
        end_time: dayjs(today).hour(18).minute(30).second(0).toDate(),
      },
    ];

    setMeetings(meetingResponse);
  }, []);

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
    const gridRowStart = timeToGridRow(meeting.start_time);
    const gridRowEnd = timeToGridRow(meeting.end_time);

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
    return meetings.map((meeting) => {
      const { gridRowStart, gridRowEnd } = calculateMeetingPosition(meeting);

      return (
        <div
          key={meeting.id}
          className="meeting"
          style={{
            gridRowStart: gridRowStart,
            gridRowEnd: gridRowEnd,
          }}
        >
          <strong>{meeting.title}</strong>
          <br />
          {meeting.start_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {meeting.end_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    });
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
          {renderHourLabels()}
          {renderGridLines()}
          {renderMeetingBlocks()}
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
