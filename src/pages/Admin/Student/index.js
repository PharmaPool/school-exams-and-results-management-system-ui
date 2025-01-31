import React, { useState, useEffect, useContext, useRef } from "react";
import "./adminstudentdashboard.css";
import unn from "../../../data/unn.png";
import Table from "./ocmponents/Table";
import GPtable from "./ocmponents/GPtable";
import { useParams, useNavigate } from "react-router-dom";
import { ValueContext } from "../../../Context";
import generatePDF from "react-to-pdf";

function AdminStudentDashboard() {
  const target = useRef();
  const navigate = useNavigate();
  const { _id } = useParams();
  const { socket } = useContext(ValueContext);
  const [session, setSession] = useState({});
  const [student, setStudent] = useState({});
  const [courses, setCourses] = useState([]);
  const [total_semesters, setTotal_semesters] = useState([]);

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  useEffect(() => {
    socket.emit("student", { _id });
  }, []);

  socket.on("student", (res) => {
    setStudent(res.student);
    setTotal_semesters(res.student.total_semesters);
    setSession(
      res.student.total_semesters[res.student.total_semesters.length - 1]
    );
    setCourses(
      res.student.total_semesters[res.student.total_semesters.length - 1]
        .courses
    );
  });

  return (
    <>
      <div class="student_dashboard" ref={target}>
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
        <div class="student_dashboard_body">
          {/* <div className="student_dashboard_body_title">
          <h2 style={{ textTransform: "uppercase" }}>{student.fullname}</h2>
        </div> */}
          <div class="student_dashboard_body_details">
            <div>
              {" "}
              <p>
                Name: <b>{student.fullname}</b>
              </p>
              <p>
                Reg. No: <b>{student.reg_no}</b>
              </p>
            </div>
            <div>
              <p>
                Session:{" "}
                <b>
                  <select
                    onChange={(e) => {
                      if (total_semesters[e.target.value])
                        setSession(total_semesters[e.target.value]);
                      setCourses(total_semesters[e.target.value].courses);
                    }}
                  >
                    <option>{session.session}</option>
                    {total_semesters.map((semester, i) => (
                      <option value={i}>
                        {semester.session}- {semester.semester}
                      </option>
                    ))}
                  </select>
                </b>
              </p>
              <p>
                Level: <b>{session.level}</b>
              </p>
              <p>
                Semester: <b>{session.semester === 1 ? "First" : "Second"}</b>
              </p>
            </div>
          </div>
          {courses.length > 0 && <Table courses={courses} />}
          {/* <GPtable
          session={session}
          cgpa={student.cgpa}
          id={student._id}
          generatePDF={generatePDF}
          target={target}
        /> */}
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
      <div class="transcript_button">
        <button
          onClick={() =>
            generatePDF(target, {
              filename: `${student.fullname} result statement.pdf`,
            })
          }
        >
          Print statement
        </button>
        <button
          onClick={() =>
            navigate(
              `/admin/student/transcript/${session.session}/${session.level}/${student._id}`
            )
          }
        >
          Generate transcript
        </button>
      </div>
    </>
  );
}

export default AdminStudentDashboard;
