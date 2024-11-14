import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

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

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      {isFaculty && (
        <>
          <h5>
            Manage Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
              disabled={!course.name?.trim() || !course.number?.trim()}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
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
      <h2 id="wd-dashboard-published">
        {isFaculty ? "All Courses" : "Published Courses"} ({courses.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => (
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
                    <button className="btn btn-primary">Go</button>
                    {isFaculty && (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
