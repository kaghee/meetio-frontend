import { useEffect } from "react";
import Calendar from "./components/calendar/Calendar";
import "./App.scss";

const DUMMY_AUTH_TOKEN = import.meta.env.VITE_DUMMY_AUTH_TOKEN;

const App = () => {
  useEffect(() => {
    if (!DUMMY_AUTH_TOKEN) return;
    if (!localStorage.getItem("authToken")) {
      console.warn("Development mode: Setting dummy authentication token.");
      localStorage.setItem("authToken", DUMMY_AUTH_TOKEN);
    }
  }, []);

  return (
    <>
      <Calendar />
    </>
  );
};

export default App;
