import React from "react";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-4">
      <div className="mb-4">
        <label htmlFor="wd-name" className="form-label mb-1">
          Assignment Name
        </label>
        <input
          id="wd-name"
          value="A1"
          className="form-control"
          style={{ width: "100%" }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="wd-description" className="form-label mb-1">
          Description
        </label>
        <div className="p-3 bg-light border rounded" style={{ width: "100%" }}>
          <p>
            The assignment is{" "}
            <span className="text-danger">available online</span>
          </p>
          <p>
            Submit a link to the landing page of your Web application running on{" "}
            <a href="#">Netlify</a>.
          </p>
          <p>The landing page should include the following:</p>
          <ul>
            <li>Your full name and section</li>
            <li>Links to each of the lab assignments</li>
            <li>
              Link to the <a href="#">Kanbas</a> application
            </li>
            <li>Links to all relevant source code repositories</li>
          </ul>
          <p>
            The <a href="#">Kanbas</a> application should include a link to
            navigate back to the landing page.
          </p>
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
            value={100}
            className="form-control mb-3"
            style={{ width: "100%" }}
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
          >
            <option value="Online">Online</option>
          </select>

          <div className="form-group">
            <label className="form-label">Online Entry Options</label>
            <div className="form-check">
              <input
                id="wd-text-entry"
                type="checkbox"
                className="form-check-input"
              />
              <label htmlFor="wd-text-entry" className="form-check-label">
                Text Entry
              </label>
            </div>
            <div className="form-check">
              <input
                id="wd-website-url"
                type="checkbox"
                className="form-check-input"
                checked
              />
              <label htmlFor="wd-website-url" className="form-check-label">
                Website URL
              </label>
            </div>
            <div className="form-check">
              <input
                id="wd-media-recordings"
                type="checkbox"
                className="form-check-input"
              />
              <label htmlFor="wd-media-recordings" className="form-check-label">
                Media Recordings
              </label>
            </div>
            <div className="form-check">
              <input
                id="wd-file-upload"
                type="checkbox"
                className="form-check-input"
              />
              <label htmlFor="wd-file-upload" className="form-check-label">
                File Upload
              </label>
            </div>
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
          />

          <label htmlFor="wd-due-date" className="form-label">
            Due
          </label>
          <input
            id="wd-due-date"
            type="date"
            value="2024-05-13"
            className="form-control mb-2"
            style={{ width: "100%" }}
          />

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="wd-available-from" className="form-label">
                Available From
              </label>
              <input
                id="wd-available-from"
                type="date"
                value="2024-05-06"
                className="form-control"
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
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-danger">Save</button>
      </div>
    </div>
  );
}
