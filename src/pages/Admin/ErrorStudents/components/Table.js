import React from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";

const sessions = [
  { session: "2023-2024", prev: "2022-2023" },
  { session: "2022-2023", prev: "2021-2022" },
  { session: "2021-2022", prev: "2020-2021" },
  { session: "2020-2021", prev: "2019-2020" },
  { session: "2019-2020", prev: "2018-2019" },
];

function Table({ students }) {
  students.sort(function (a, b) {
    if (a.fullname < b.fullname) {
      return -1;
    }
    if (a.fullname > b.fullname) {
      return 1;
    }
    return 0;
  });
  const { level, semester, session } = useParams();
  const prev_session = sessions.find((sess) => sess.session === session).prev;
  const navigate = useNavigate();
  const current_semester = levels[level][semester];
  const course_codes = Object.keys(current_semester);
  const current_semesters = students
    .map((student) => {
      const courses = student.total_semesters.find(
        (current) =>
          current.session === session && current.semester === Number(semester)
      );

      const current_courses = courses.courses.filter(
        (course) => course.course_code in current_semester
      );

      const externals = courses.courses.filter(
        (course) => !(course.course_code in current_semester)
      );
      const session_gpa = student.session_cgpa.find(
        (sess) => sess.session === session
      );
      const prev_gpa = student.session_cgpa.find(
        (sess) => sess.session === prev_session
      );

      let prev_cgpa, prev_level;
      if (prev_gpa) {
        prev_cgpa = prev_gpa.cgpa;
        prev_level = prev_gpa.level;
      } else prev_cgpa = 0;

      return {
        student: {
          _id: student._id,
          fullname: student.fullname,
          reg_no: student.reg_no,
          level: student.level,
          cgpa: student.cgpa,
        },
        current_courses,
        externals,
        gpa: courses.gpa,
        show: Number(session_gpa.cgpa) < 2.5 && Number(prev_cgpa) < 2.5,
        session_gpa: session_gpa.cgpa,
        prev_gpa: prev_cgpa,
        session_level: session_gpa.level,
        prev_level,
      };
    })
    .filter(({ student, current_courses, externals, gpa, show }) => show);

  console.log(current_semesters);
  const current_externals = current_semesters.filter(
    ({ student, current_courses, externals, gpa, show }) => externals.length > 0
  );

  const externals = students.map((student) => {
    const courses = student.total_semesters.find(
      (current) =>
        current.level === Number(level) && current.semester === Number(semester)
    );
    return courses;
    // const course = courses.find((course) => course.external_course === true);
    // if (course) return student;
  });

  const external = externals.map((semester) => {
    if (semester) {
      return semester.courses.filter((cours) => cours.external === true);
    }
  });

  return (
    <div class="table" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>names</th>
            <th>reg.no</th>
            {/* {course_codes.map((course_code) => (
              <th className="center">{course_code}</th>
            ))} */}
            <th className="center">{prev_session} session/level</th>
            {semester == "1" && (
              <th className="center">{session} session/level</th>
            )}
            {/* {semester == "2" && <th className="center">overall cgpa</th>} */}
            <th className="center">current level</th>
          </tr>
        </thead>
        <tbody>
          {current_semesters.length > 0 &&
            current_semesters.map(
              (
                {
                  student,
                  current_courses,
                  externals,
                  gpa,
                  show,
                  session_gpa,
                  prev_gpa,
                  session_level,
                  prev_level,
                },
                i
              ) =>
                student && (
                  <tr>
                    <td className="center">{i + 1}</td>
                    <td
                      onClick={() => navigate(`/admin/student/${student._id}`)}
                    >
                      {student.fullname}
                    </td>
                    <td
                      onClick={() => navigate(`/admin/student/${student._id}`)}
                    >
                      {student.reg_no}
                    </td>

                    <td
                      className="center"
                      style={{
                        fontWeight: "bold",
                        color:
                          Number(prev_gpa).toFixed(2) < 2.5 ? "red" : "black",
                      }}
                    >
                      <span>{show && Number(prev_gpa).toFixed(2)}</span> {"- "}
                      <span style={{ color: "black" }}>{prev_level}</span>
                    </td>
                    {semester == "1" && (
                      <td
                        className="center"
                        style={{
                          fontWeight: "bold",
                          color:
                            Number(session_gpa).toFixed(2) < 2.5
                              ? "red"
                              : "black",
                        }}
                      >
                        <span>{show && Number(session_gpa).toFixed(2)}</span>{" "}
                        {"- "}
                        <span style={{ color: "black" }}>{session_level}</span>
                      </td>
                    )}
                    <td className="center">{student.level}</td>
                    {/* {semester == "2" && (
                      <td className="center" style={{ fontWeight: "bold" }}>
                        {show && Number(student.cgpa).toFixed(2)}
                      </td>
                    )} */}
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
