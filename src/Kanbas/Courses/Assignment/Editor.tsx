import React from "react";
import { useParams, Link } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const assignment = db.assignments.find(
    (assignment) => assignment._id === aid
  );

  if (!assignment) {
    return <div>Assignment not found.</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-4">
      <div className="mb-4">
        <label htmlFor="wd-name" className="form-label mb-1">
          Assignment Name
        </label>
        <input
          id="wd-name"
          value={assignment.title}
          className="form-control"
          style={{ width: "100%" }}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label htmlFor="wd-description" className="form-label mb-1">
          Description
        </label>
        <div className="p-3 bg-light border rounded" style={{ width: "100%" }}>
          <p>{assignment.description || "No description available"}</p>
        </div>
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="wd-points" className="col-sm-3 col-form-label">
          Points
        </label>
        <div className="col-sm-9">
          <input
            id="wd-points"
            type="number"
            value={assignment.points || 0}
            className="form-control mb-3"
            style={{ width: "100%" }}
            readOnly
          />
        </div>

        <label htmlFor="wd-group" className="col-sm-3 col-form-label">
          Assignment Group
        </label>
        <div className="col-sm-9">
          <select
            id="wd-group"
            className="form-select mb-3"
            style={{ width: "100%" }}
            value={assignment.assignmentGroup}
            disabled
          >
            <option value="Assignments">Assignments</option>
            <option value="Quizzes">Quizzes</option>
            <option value="Exams">Exams</option>
            <option value="Projects">Projects</option>
          </select>
        </div>

        <label
          htmlFor="wd-display-grade-as"
          className="col-sm-3 col-form-label"
        >
          Display Grade as
        </label>
        <div className="col-sm-9">
          <select
            id="wd-display-grade-as"
            className="form-select mb-3"
            style={{ width: "100%" }}
            value="Points"
            disabled
          >
            <option value="Percentage">Percentage</option>
            <option value="Points">Points</option>
          </select>
        </div>
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="wd-submission-type" className="col-sm-3 col-form-label">
          Submission Type
        </label>
        <div className="col-sm-9 border p-3 rounded">
          <select
            id="wd-submission-type"
            className="form-select mb-3"
            style={{ width: "100%" }}
            value={assignment.submissionType}
            disabled
          >
            <option value="Online">Online</option>
          </select>

          <div className="form-group">
            <label className="form-label">Online Entry Options</label>
            {assignment.onlineEntryOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked
                  disabled
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="wd-assign" className="col-sm-3 col-form-label">
          Assign
        </label>
        <div className="col-sm-9 border p-3 rounded">
          <label htmlFor="wd-assign-to" className="form-label">
            Assign To
          </label>
          <input
            id="wd-assign-to"
            value="Everyone"
            className="form-control mb-2"
            style={{ width: "100%" }}
            readOnly
          />

          <label htmlFor="wd-due-date" className="form-label">
            Due
          </label>
          <input
            id="wd-due-date"
            type="date"
            value={assignment.dueDate}
            className="form-control mb-2"
            style={{ width: "100%" }}
            readOnly
          />

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="wd-available-from" className="form-label">
                Available From
              </label>
              <input
                id="wd-available-from"
                type="date"
                value={assignment.availableFrom}
                className="form-control"
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="wd-available-to" className="form-label">
                Until
              </label>
              <input
                id="wd-available-to"
                type="date"
                value="2024-05-13"
                className="form-control"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-end gap-2">
        <Link
          to={`/Kanbas/Courses/${cid}/Assignments`}
          className="btn btn-secondary"
        >
          Cancel
        </Link>
        <button className="btn btn-danger">Save</button>
      </div>
    </div>
  );
}
