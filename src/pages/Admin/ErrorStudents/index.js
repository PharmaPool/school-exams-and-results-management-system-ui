import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./level.css";
import Table from "./components/Table";
import { ValueContext } from "../../../Context";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";

const sessions = [
  { session: "2023-2024", prev: "2022-2023" },
  { session: "2022-2023", prev: "2021-2022" },
  { session: "2021-2022", prev: "2020-2021" },
  { session: "2020-2021", prev: "2019-2020" },
  { session: "2019-2020", prev: "2018-2019" },
];

function ErrorStudents() {
  const target = useRef();
  const { level, semester, session, _id } = useParams();
  const [students, setStudents] = useState([]);
  const [prev_students, setPrev_students] = useState([]);
  const { socket } = useContext(ValueContext);
  const prev_session = sessions.find((sess) => sess.session === session).prev;

  useEffect(() => {
    socket.emit("class", { class_id: _id, semester });
    fetch(`http://127.0.0.1:8000/api/class/${session}/${prev_session}/${level}`)
      .then((res) => res.json())
      .then((json) => setPrev_students(json.previous_level))
      .catch((error) => console.log(error));
  }, []);

  socket.on("class", (res) => setStudents(res.current_semester));

  return (
    <>
      <Header />
      <div
        class="current_level"
        ref={target}
        id="pageContent"
        style={{ textAlign: "center" }}
      >
        <div class="header">
          <h2>
            {session}: {level} error students list
          </h2>
        </div>
        {students.length > 0 && (
          <Table students={students} prev_students={prev_students} />
        )}
      </div>
      <div class="gp_tab no_print">
        <div class="transcript_btn">
          <button onClick={() => window.print()}>Print</button>
        </div>
        <div>
          <ExportToExcel
            tableId="myTable"
            filename={`${session}: ${level} Level:${" "}
            probation list`}
          />
        </div>
      </div>
    </>
  );
}

export default ErrorStudents;