import React, { useState, useEffect } from "react";
import Levels from "./components/Courses";
import PreviousSession from "./components/PreviousSession";
import "./departments.css";
import Loader from "../../../components/Loader";

function Departments() {
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [session, setSession] = useState("");
  const [current, setCurrent] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:8000/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          if (json.sessions.length < 1) {
            setShow(true);
          }
          setCurrent_session(
            json.sessions.filter((session) => session.current === true)
          );
          setOther_sessions(
            json.sessions.filter((session) => session.current === false)
          );
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div class="header">
        <h2>Faculty courses</h2>
      </div>
      {load && <Loader />}
      <div class="faculty_courses">
        <div class="current_session">
          <p>Current session:</p>
          {current_session.length > 0 && <h2>{current_session[0].session}</h2>}
        </div>
        {current_session.length > 0 && (
          <Levels session={current_session[0].session} />
        )}
        <div className="previous_sessions_container">
          <p>Other sessions:</p>
          {other_sessions.length > 0 && (
            <div class="previous_sessions">
              {other_sessions.map((session) => (
                <PreviousSession session={session.session} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Departments;
