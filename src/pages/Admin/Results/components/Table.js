import React from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";

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
      return {
        student: {
          _id: student._id,
          fullname: student.fullname,
          reg_no: student.reg_no,
          cgpa: student.cgpa,
        },
        current_courses,
        externals,
        gpa: courses.gpa,
        show: current_courses.length > externals.length,
        session_gpa: session_gpa && session_gpa.cgpa,
      };
    })
    .filter(({ student, current_courses, externals, gpa, show }) => show);

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
    <div class="tabl" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th style={{ textAlign: "left" }}>names</th>
            <th>reg.no</th>
            {course_codes.map((course_code) => (
              <th className="center">{course_code}</th>
            ))}
            <th className="center">gpa</th>
            {semester == "2" && <th className="center">session cgpa</th>}
            {semester == "2" && <th className="center">overall cgpa</th>}
          </tr>
        </thead>
        <tbody>
          {current_semesters.length > 0 &&
            current_semesters.map(
              (
                { student, current_courses, externals, gpa, show, session_gpa },
                i
              ) =>
                student && (
                  <tr>
                    <td className="center">{i + 1}</td>
                    <td
                      onClick={() => navigate(`/admin/student/${student._id}`)}
                      style={{ textAlign: "left" }}
                    >
                      {student.fullname}
                    </td>
                    <td
                      onClick={() => navigate(`/admin/student/${student._id}`)}
                    >
                      {student.reg_no}
                    </td>
                    {course_codes.map((course_code) => {
                      const course = current_courses.find(
                        (single_course) =>
                          single_course.course_code === course_code
                      );
                      if (course) {
                        return (
                          <td style={{ textAlign: "center" }}>
                            <div style={{ display: "flex" }}>
                              <td style={{ padding: "0rem", width: "50%" }}>
                                {Number(course.total).toFixed(0)}
                              </td>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  padding: "0rem",
                                  width: "50%",
                                }}
                              >
                                {course.grade === 5 && <b>A</b>}
                                {course.grade === 4 && <b>B</b>}
                                {course.grade === 3 && <b>C</b>}
                                {course.grade === 2 && <b>D</b>}
                                {course.grade === 1 && <b>E</b>}
                                {course.grade === 0 && (
                                  <b style={{ color: "red" }}>F</b>
                                )}
                              </td>
                            </div>
                          </td>
                        );
                      } else {
                        return <td className="center"></td>;
                      }
                    })}
                    <td
                      className="center"
                      style={{
                        fontWeight: "bold",
                        color: Number(gpa).toFixed(2) < 2.5 ? "red" : "black",
                      }}
                    >
                      {show && Number(gpa).toFixed(2)}
                    </td>
                    {semester == "2" && (
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
                        {show && Number(session_gpa).toFixed(2)}
                      </td>
                    )}
                    {semester == "2" && (
                      <td className="center" style={{ fontWeight: "bold" }}>
                        {show && Number(student.cgpa).toFixed(2)}
                      </td>
                    )}
                  </tr>
                )
            )}
        </tbody>
      </table>

      {current_externals.length > 0 && (
        <div>
          <h3 className="page_break" style={{ marginLeft: "1rem" }}>
            Other Courses Results
          </h3>
          <table id="myTable">
            <thead>
              <tr>
                <th className="center">s/n</th>
                <th>names</th>
                <th>reg.no</th>
                <th>courses</th>
              </tr>
            </thead>
            <tbody>
              {current_externals.length > 0 &&
                current_externals.map(
                  ({ student, current_courses, externals, gpa, show }, i) => (
                    <tr>
                      <td className="center">{i + 1}</td>
                      <td
                        style={{
                          padding: "0rem 1rem",
                        }}
                      >
                        {student.fullname}
                      </td>
                      <td
                        style={{
                          padding: "0rem 1rem",
                        }}
                      >
                        {student.reg_no}
                      </td>
                      <td
                        style={{
                          padding: "0rem 1rem",
                        }}
                      >
                        {externals.map((course) => (
                          <td
                            style={{
                              padding: "0rem ",
                            }}
                          >
                            <td
                              style={{
                                padding: "0rem ",
                              }}
                            >
                              {course.course_code}
                            </td>
                            <td
                              style={{
                                fontWeight: "bold",
                                padding: "0rem 0.5rem 0rem 1rem",
                              }}
                            >
                              {Number(course.total).toFixed()}
                            </td>
                            <td
                              style={{
                                fontWeight: "bold",
                                padding: "0rem 2rem 0rem 0.5rem",
                              }}
                            >
                              {course.grade === 5 && <b>A</b>}
                              {course.grade === 4 && <b>B</b>}
                              {course.grade === 3 && <b>C</b>}
                              {course.grade === 2 && <b>D</b>}
                              {course.grade === 1 && <b>E</b>}
                              {course.grade === 0 && (
                                <b style={{ color: "red" }}>F</b>
                              )}
                            </td>
                          </td>
                        ))}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Table;
