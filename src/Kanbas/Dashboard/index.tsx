import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../Courses/client";
import * as userClient from "../Account/client";

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const dispatch = useDispatch();

  const memoizedFetchEnrollments = useCallback(async () => {
    try {
      const enrolledCourses = await userClient.getEnrollments(currentUser._id);
      setEnrollments(enrolledCourses);
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

  const toggleEnrollment = async (courseId: string) => {
    try {
      if (enrollments.includes(courseId)) {
        await client.unenrollFromCourse(currentUser._id, courseId);
        const updatedEnrollments = enrollments.filter((id) => id !== courseId);
        setEnrollments(updatedEnrollments);
        // Update currentUser's enrollments in Redux store
        dispatch({
          type: "UPDATE_USER",
          payload: { ...currentUser, enrollments: updatedEnrollments },
        });
      } else {
        await client.enrollInCourse(currentUser._id, courseId);
        const updatedEnrollments = [...enrollments, courseId];
        setEnrollments(updatedEnrollments);
        // Update currentUser's enrollments in Redux store
        dispatch({
          type: "UPDATE_USER",
          payload: { ...currentUser, enrollments: updatedEnrollments },
        });
      }
    } catch (error) {
      console.error("Error toggling enrollment:", error);
    }
  };

  const displayedCourses = isFaculty
    ? courses
    : showAllCourses
    ? courses
    : courses.filter((c) => enrollments.includes(c._id));

  return (
    <div id="wd-dashboard" className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Dashboard</h1>
        {!isFaculty && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses ? "Show My Enrollments" : "Show All Courses"}
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
        {isFaculty ? "All Courses" : "Published Courses"} (
        {displayedCourses.length})
      </h2>
      <hr />
      <div className="row row-cols-1 row-cols-md-5 g-4">
        {displayedCourses.map((course) => (
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
              <div className="card-footer d-flex justify-content-between align-items-center">
                {(isFaculty || enrollments.includes(course._id)) && (
                  <Link
                    to={`/Kanbas/Courses/${course._id}/Home`}
                    className="btn btn-primary"
                    style={{ width: "60px" }}
                  >
                    Go
                  </Link>
                )}
                {!isFaculty && (
                  <button
                    onClick={() => toggleEnrollment(course._id)}
                    className={`btn ${
                      enrollments.includes(course._id)
                        ? "btn-danger"
                        : "btn-success"
                    }`}
                  >
                    {enrollments.includes(course._id) ? "Unenroll" : "Enroll"}
                  </button>
                )}
                {isFaculty && (
                  <div>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="btn btn-danger ms-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setCourse(course)}
                      className="btn btn-warning ms-2"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
