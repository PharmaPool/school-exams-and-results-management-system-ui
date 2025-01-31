import React, { useState, useRef, useEffect, useContext } from "react";
// import "./transcript.css";
import unn from "../../../data/unn.png";
import Table from "./components/Table";
import { useParams } from "react-router-dom";
import { ValueContext } from "../../../Context";
import professionals from "../../../data/professionals";

import generatePDF from "react-to-pdf";

function AdminTranscript() {
  const target = useRef();
  const { _id, sesion, level } = useParams();
  const { socket } = useContext(ValueContext);
  const [student, setStudent] = useState({});
  const [session_gpa, setSession_gpa] = useState("");
  const [first_semester, setFirst_semester] = useState([]);
  const [second_semester, setSecond_semester] = useState([]);
  const [first_external, setFirst_external] = useState([]);
  const [second_external, setSecond_external] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    socket.emit("transcript", { _id, sesion });
  }, []);

  socket.on("transcript", (res) => {
    setSession_gpa(res.session_gpa);
    setStudent(res.student);
    res.student.total_semesters.find(
      (sem) => sem.session === sesion && sem.semester === 1
    ).courses &&
      setFirst_semester(
        res.student.total_semesters
          .find((sem) => sem.session === sesion && sem.semester === 1)
          .courses.filter((course) => course.course_code in professionals)
      );
    res.student.total_semesters.find(
      (sem) => sem.session === sesion && sem.semester === 2
    ).courses &&
      setSecond_semester(
        res.student.total_semesters
          .find((sem) => sem.session === sesion && sem.semester === 2)
          .courses.filter((course) => course.course_code in professionals)
      );
    res.student.total_semesters
      .find((sem) => sem.session === sesion && sem.semester === 1)
      .courses.filter((course) => !(course.course_code in professionals)) &&
      setFirst_external(
        res.student.total_semesters
          .find((sem) => sem.session === sesion && sem.semester === 1)
          .courses.filter((course) => !(course.course_code in professionals))
      );
    res.student.total_semesters
      .find((sem) => sem.session === sesion && sem.semester === 2)
      .courses.filter((course) => !(course.course_code in professionals)) &&
      setSecond_external(
        res.student.total_semesters
          .find((sem) => sem.session === sesion && sem.semester === 2)
          .courses.filter((course) => !(course.course_code in professionals))
      );

    res.student.total_semesters
      .find((sem) => sem.session === sesion && sem.semester === 2)
      .courses.filter((course) => !(course.course_code in professionals))
      .length > 0 && setShow(true);
  });

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return (
    <>
      <div class="student_db" id="transcript" ref={target}>
        <div className="d_head">
          <div class="student_dashboard_head">
            <div class="passport">
              <div class="passport_img">
                <img src={unn} alt="" />
              </div>
            </div>
            <div class="dashboard_header">
              {/* <div class="student_dashboard_header_img">
            <img src={unn} alt="" />
          </div> */}
              <div class="student_dashboard_head_title">
                <p>Faculty of Pharmaceutical Sciences</p>
                <p>University of Nigeria Nsukka</p>
                <p>PHARM. D PROFESSIONAL EXAMINATION RESULT SHEET</p>
                <i style={{ fontSize: "x-large", fontWeight: "bold" }}>
                  (Faculty Copy)
                </i>
              </div>
            </div>
            <div class="passport">
              <div class="passport_img">
                <img src={student.profile_image} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="student_dashboard_bod">
          <div class="student_dashboard_body_details">
            <div>
              <p>
                Name of Student: <b>{student.fullname}</b>
              </p>
              <p>
                Reg. No: <b>{student.reg_no}</b>
              </p>
            </div>
            <div>
              <p>
                Session: <b>{sesion}</b>
              </p>
              <p>
                Level: <b>{level}</b>
              </p>
            </div>
          </div>

          <Table
            level={level}
            first_semester={first_semester}
            second_semester={second_semester}
            first_external={first_external}
            second_external={second_external}
            show={show}
          />
          {/* <GPtable
            generatePDF={generatePDF}
            target_element={target_element}
            options={options}
          /> */}
        </div>
        <div class="gp_tab">
          <div class="transcript_btn"></div>
        </div>
        <div class="signature">
          <div class="exam_office">
            <p
              style={{
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              chukwuma chinyere p. {formattedToday}
            </p>
            <p style={{ borderTop: "1px dotted black" }}>
              Name and Signature of Examination Officer (with date)
            </p>
          </div>
          <div class="dean">
            <p
              style={{
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              Prof. c. s. Nworu {formattedToday}
            </p>
            <p style={{ borderTop: "1px dotted black" }}>
              Name & Signature of Dean (with date)
            </p>
          </div>
        </div>
        <div className="grade_table">
          <table>
            <thead>
              <tr
                style={{
                  textTransform: "uppercase",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <th colSpan={3}>non-professional courses</th>
                <th colSpan={3}>professional courses</th>
              </tr>
              <tr style={{ textTransform: "capitalize", fontWeight: "550" }}>
                <td>score range</td>
                <td>letter grade</td>
                <td>grade point</td>
                <td>score range</td>
                <td>letter grade</td>
                <td>grade point</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>70-100</td>
                <td>A (Excellent)</td>
                <td>5</td>
                <td>70-100</td>
                <td>A (Excellent)</td>
                <td>5</td>
              </tr>
              <tr>
                <td>60-69</td>
                <td>B (Very Good)</td>
                <td>4</td>
                <td>60-69</td>
                <td>B (Very Good)</td>
                <td>4</td>
              </tr>
              <tr>
                <td>50-59</td>
                <td>c (Good)</td>
                <td>3</td>
                <td>50-59</td>
                <td>c (Good)</td>
                <td>3</td>
              </tr>
              <tr>
                <td>45-49</td>
                <td>D (Fair)</td>
                <td>2</td>
                <td>0-49</td>
                <td>F (Fail)</td>
                <td>0</td>
              </tr>
              <tr>
                <td>40-44</td>
                <td>E (Pass)</td>
                <td>1</td>
                <td colSpan={3}>
                  <b style={{ color: "red" }}>*</b>{" "}
                  {"< 60 F (Fail) for PCT224 and PCT422"}{" "}
                </td>
              </tr>
              <tr>
                <td>0-39</td>
                <td>F (Fail)</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="gp_tab">
        <div class="transcript_btn">
          <button
            onClick={() =>
              generatePDF(target, {
                filename: `${student.fullname} ${sesion} result`,
              })
            }
          >
            Print
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default AdminTranscript;
