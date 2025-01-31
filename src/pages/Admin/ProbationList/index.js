import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import "./level.css";
import Table from "./components/Table";
import { ValueContext } from "../../../Context";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";

function ProbationList() {
  const target = useRef();
  const { level, semester, session, _id } = useParams();
  const [students, setStudents] = useState([]);
  const { socket } = useContext(ValueContext);

  useEffect(() => {
    socket.emit("class", { class_id: _id, semester });
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
            {session}: {level} Level probation list
          </h2>
        </div>
        {students.length > 0 && <Table students={students} />}
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

export default ProbationList;
