import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <h2 id="wd-dashboard-published">Published Courses (8)</h2>
      <hr />

      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/1234/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS1234 React JS
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Full Stack Software Development
                  </p>
                  <p className="text-muted">Fall 2024 - Section 001</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/5678/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS5678 Node JS
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Backend Development with Node.js
                  </p>
                  <p className="text-muted">Fall 2024 - Section 002</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/3456/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS3456 Angular
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Frontend Framework with Angular
                  </p>
                  <p className="text-muted">Fall 2024 - Section 003</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/7890/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS7890 Python
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Introduction to Python
                  </p>
                  <p className="text-muted">Fall 2024 - Section 004</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/5679/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS5679 Data Science
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Data Science and Machine Learning
                  </p>
                  <p className="text-muted">Fall 2024 - Section 005</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/6789/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS6789 Java
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Object-Oriented Programming with Java
                  </p>
                  <p className="text-muted">Fall 2024 - Section 006</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/9876/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS9876 Docker
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Containerization with Docker
                  </p>
                  <p className="text-muted">Fall 2024 - Section 007</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>

          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                className="wd-dashboard-course-link text-decoration-none text-dark"
                to="/Kanbas/Courses/2345/Home"
              >
                <img
                  src="/images/reactjslogo.jpeg"
                  width="100%"
                  height={160}
                  alt="Course Image"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    CS2345 SQL
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Database Management with SQL
                  </p>
                  <p className="text-muted">Fall 2024 - Section 008</p>
                  <button className="btn btn-primary">Go</button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
