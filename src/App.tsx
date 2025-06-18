import "./App.scss";
import Calendar from "./components/calendar/Calendar";

const App = () => {
  return (
    <>
      <div>Look at me, I'm an app!</div>
      <Calendar title={"Calendar component"}>
        <div className="content">calendar content</div>
      </Calendar>
    </>
  );
};

export default App;
