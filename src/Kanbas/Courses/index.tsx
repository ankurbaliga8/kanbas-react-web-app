import React from "react";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table";
import { FaAlignJustify } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function Courses({ courses }: { courses: any[] }) {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Modules" element={<Modules />} />
            <Route path="/Assignments" element={<Assignments />} />
            <Route
              path="/Assignments/:aid"
              element={
                isFaculty ? (
                  <AssignmentEditor />
                ) : (
                  <div className="p-4">
                    <h2>Access Denied</h2>
                    <p>You are not authorized to view this page.</p>
                  </div>
                )
              }
            />
            <Route path="/People" element={<PeopleTable />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
