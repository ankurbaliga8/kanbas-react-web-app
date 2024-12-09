import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import * as userClient from "../Account/client";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
  enrolling,
  setEnrolling,
  updateEnrollment,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [enrollments, setEnrollments] = useState<string[]>([]);

  const memoizedFetchEnrollments = useCallback(async () => {
    try {
      if (currentUser?._id) {
        const enrolledCourses = await userClient.getEnrollments(currentUser._id);
        setEnrollments(enrolledCourses);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }, [currentUser?._id]);

  const fetchEnrollments = memoizedFetchEnrollments;

  useEffect(() => {
    if (currentUser && !isFaculty) {
      fetchEnrollments();
    }
  }, [currentUser, fetchEnrollments, isFaculty]);

  if (!currentUser) {
    return <div>Please log in to view the dashboard</div>;
  }

  if (!Array.isArray(courses)) {
    return <div>Loading courses...</div>;
  }

  const displayedCourses = courses.filter(course => course !== null);

  return (
    <div id="wd-dashboard" className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Dashboard</h1>
        {!isFaculty && (
          <button
            onClick={() => setEnrolling(!enrolling)}
            className="float-end btn btn-primary"
          >
            {enrolling ? "My Courses" : "All Courses"}
          </button>
        )}
      </div>
      <hr />
      {isFaculty && (
        <>
          <h5>
            Manage Course
            <button
              className="btn btn-primary float-end"
              onClick={addNewCourse}
              disabled={!course.name?.trim() || !course.number?.trim()}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              disabled={!course.name?.trim() || !course.number?.trim()}
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            placeholder="Enter course name"
            onChange={(e) =>
              setCourse((prevCourse: typeof course) => ({
                ...prevCourse,
                name: e.target.value,
              }))
            }
          />
          <input
            value={course.number}
            className="form-control mb-2"
            placeholder="Enter course number"
            onChange={(e) =>
              setCourse((prevCourse: typeof course) => ({
                ...prevCourse,
                number: e.target.value,
              }))
            }
          />
          <textarea
            value={course.description}
            className="form-control"
            placeholder="Enter course description"
            onChange={(e) =>
              setCourse((prevCourse: typeof course) => ({
                ...prevCourse,
                description: e.target.value,
              }))
            }
          />
          <hr />
        </>
      )}
      <h2>
        {isFaculty ? "All Courses" : "Published Courses"} ({displayedCourses.length})
      </h2>
      <hr />
      <div className="row row-cols-1 row-cols-md-5 g-4">
        {displayedCourses.map((course) => (
          course && course._id ? (
            <div key={course._id} className="col" style={{ maxWidth: "300px" }}>
              <div className="card rounded-3 overflow-hidden">
                <Link
                  to={`/Kanbas/Courses/${course._id}/Home`}
                  className="text-decoration-none text-dark"
                >
                  <img
                    src={
                      course.image ||
                      process.env.PUBLIC_URL + "/images/reactjs.jpeg"
                    }
                    alt={course.name}
                    width="100%"
                    height={160}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p
                      className="card-text text-truncate"
                      style={{ maxHeight: "80px" }}
                    >
                      {course.description}
                    </p>
                  </div>
                </Link>
                <div className="card-footer">
                  <div className="d-flex flex-wrap gap-2">
                    {(isFaculty || enrollments.includes(course._id)) && (
                      <Link
                        to={`/Kanbas/Courses/${course._id}/Home`}
                        className="btn btn-primary btn-sm"
                      >
                        Go
                      </Link>
                    )}
                    {!isFaculty && enrolling && (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          updateEnrollment(course._id, !course.enrolled);
                        }}
                        className={`btn btn-sm ${
                          course.enrolled ? "btn-danger" : "btn-success"
                        }`}
                      >
                        {course.enrolled ? "Drop" : "Enroll"}
                      </button>
                    )}
                    {isFaculty && (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning btn-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}
