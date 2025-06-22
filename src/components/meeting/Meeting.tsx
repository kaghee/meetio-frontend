import { INTERVAL_MINUTES, START_HOUR } from "../calendar/Calendar";
import { useEffect, useState } from "react";
import type { Employee } from "../../types";
import "./Meeting.scss";

interface MeetingProps {
  data: MeetingData;
}

export interface MeetingResponse {
  date: string;
  appointments: MeetingData[];
}

export interface MeetingData {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  attendees: Partial<Employee>[];
}

const Meeting: React.FC<MeetingProps> = ({ data }) => {
  const [startPos, setStartPos] = useState(0);
  const [endPos, setEndPos] = useState(0);

  useEffect(() => {
    const { gridRowStart, gridRowEnd } = calculateMeetingGridProps(data);

    setStartPos(gridRowStart);
    setEndPos(gridRowEnd);
  }, [data]);

  const calculateMeetingGridProps = (meeting: MeetingData) => {
    const startHour = new Date(meeting.start_time).getHours();
    const startMinute = new Date(meeting.start_time).getMinutes();
    const endHour = new Date(meeting.end_time).getHours();
    const endMinute = new Date(meeting.end_time).getMinutes();

    const totalMinutesFromStart = (startHour - START_HOUR) * 30 + startMinute;
    const gridRowStart =
      Math.floor(totalMinutesFromStart / INTERVAL_MINUTES) + 1;

    const totalMinutesToEnd = (endHour - START_HOUR) * 30 + endMinute;
    const gridRowEnd = Math.ceil(totalMinutesToEnd / INTERVAL_MINUTES) + 1;

    return {
      gridRowStart,
      gridRowEnd,
    };
  };

  return data ? (
    <div
      className="meeting"
      style={{
        gridRowStart: startPos,
        gridRowEnd: endPos,
      }}
    >
      <strong>{data.title}</strong>
      <div>
        {new Date(data.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(data.end_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  ) : null;
};

export default Meeting;
