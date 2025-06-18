import "./Calendar.scss";

interface CalendarProps {
  title: string;
  children: React.ReactNode;
}

const Calendar: React.FC<CalendarProps> = ({ title, children }) => (
  <div className="calendar-container">
    <h2>{title}</h2>
    {children}
  </div>
);

export default Calendar;
