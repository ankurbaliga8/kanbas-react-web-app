import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import {
  BsPencilSquare,
  BsGripVertical,
  BsThreeDotsVertical,
  BsPlus,
} from "react-icons/bs";
import { RxTriangleDown } from "react-icons/rx";
import * as db from "../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments;

  const filteredAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  return (
    <div id="wd-assignments" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white border-end-0">
            <FaMagnifyingGlass className="text-muted" />
          </span>
          <input
            id="wd-search-assignment"
            type="text"
            placeholder="Search for Assignments..."
            className="form-control border-start-0"
          />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-light border">+ Group</button>
          <button className="btn btn-sm btn-danger">+ Assignment</button>
        </div>
      </div>

      <div className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
        <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <RxTriangleDown className="me-2 fs-4" />
            <span>ASSIGNMENTS</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge rounded-pill border border-dark text-muted px-3 py-1">
              40% of Total
            </span>
            <BsPlus className="me-3 fs-4 text-muted" />
            <BsThreeDotsVertical className="text-muted" />
          </div>
        </div>

        <ul id="wd-assignment-list" className="list-group">
          {filteredAssignments.map((assignment: any) => (
            <li
              key={assignment._id}
              className="wd-assignment-list-item list-group-item d-flex justify-content-between align-items-center"
              style={{ borderLeft: "5px solid green", borderRadius: "0" }}
            >
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-3 fs-5 text-muted" />
                <BsPencilSquare className="me-2 fs-5 text-muted" />
                <div>
                  <Link
                    to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                    className="text-dark fw-bold text-decoration-none"
                  >
                    {assignment.title}
                  </Link>
                  <br />
                  <small className="text-muted">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong> May 6 at 12:00am |
                  </small>
                  <br />
                  <small className="text-muted">
                    <strong>Due</strong> May 13 at 11:59pm | 100 pts
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <FaCheckCircle className="text-success me-3" />
                <BsThreeDotsVertical className="text-muted" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}