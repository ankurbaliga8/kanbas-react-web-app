import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (10)</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="React JS" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/1234/Home"
            >
              CS1234 React JS
            </Link>
            <p className="wd-dashboard-course-title">
              Full Stack Software Development
            </p>
            <Link to="/Kanbas/Courses/1234/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Node JS" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/5678/Home"
            >
              CS5678 Node JS
            </Link>
            <p className="wd-dashboard-course-title">
              Backend Development with Node.js
            </p>
            <Link to="/Kanbas/Courses/5678/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Angular" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/3456/Home"
            >
              CS3456 Angular
            </Link>
            <p className="wd-dashboard-course-title">
              Frontend Framework with Angular
            </p>
            <Link to="/Kanbas/Courses/3456/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Python" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/7890/Home"
            >
              CS7890 Python
            </Link>
            <p className="wd-dashboard-course-title">Introduction to Python</p>
            <Link to="/Kanbas/Courses/7890/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Data Science" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/5679/Home"
            >
              CS5679 Data Science
            </Link>
            <p className="wd-dashboard-course-title">
              Data Science and Machine Learning
            </p>
            <Link to="/Kanbas/Courses/5679/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Java" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/6789/Home"
            >
              CS6789 Java
            </Link>
            <p className="wd-dashboard-course-title">
              Object-Oriented Programming with Java
            </p>
            <Link to="/Kanbas/Courses/6789/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="SQL" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/2345/Home"
            >
              CS2345 SQL
            </Link>
            <p className="wd-dashboard-course-title">
              Database Management with SQL
            </p>
            <Link to="/Kanbas/Courses/2345/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Docker" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/9876/Home"
            >
              CS9876 Docker
            </Link>
            <p className="wd-dashboard-course-title">
              Containerization with Docker
            </p>
            <Link to="/Kanbas/Courses/9876/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img src="/images/reactjslogo.jpeg" width={200} alt="Kubernetes" />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/3457/Home"
            >
              CS3457 Kubernetes
            </Link>
            <p className="wd-dashboard-course-title">
              Orchestrating Containers with Kubernetes
            </p>
            <Link to="/Kanbas/Courses/3457/Home">Go</Link>
          </div>
        </div>

        <div className="wd-dashboard-course">
          <img
            src="/images/reactjslogo.jpeg"
            width={200}
            alt="AI & Machine Learning"
          />
          <div>
            <Link
              className="wd-dashboard-course-link"
              to="/Kanbas/Courses/1235/Home"
            >
              CS1235 AI & Machine Learning
            </Link>
            <p className="wd-dashboard-course-title">
              Introduction to AI & Machine Learning
            </p>
            <Link to="/Kanbas/Courses/1235/Home">Go</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
