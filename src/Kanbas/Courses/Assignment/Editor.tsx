import React from "react";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <h3>
        <label htmlFor="wd-name">Assignment Name</label>
      </h3>
      <input id="wd-name" value="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description" rows={10} cols={44}>
        The assignment is available online Submit a link to the landing page of
        your Web application running on Netlify. The landing page should include
        the following: Your full name and section Links to each of the lab
        assignments Link to the Kanbas application Links to all relevant source
        code repositories The Kanbas application should include a link to
        navigate back to the landing page.
      </textarea>
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" type="number" value={100} />
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
              <option value="Assignments">Assignments</option>
              <option value="Quizzes">Quizzes</option>
              <option value="Exams">Exams</option>
              <option value="Projects">Projects</option>
            </select>
          </td>
        </tr>

        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade-as">
              <option value="Percentage">Percentage</option>
              <option value="Points">Points</option>
            </select>
          </td>
        </tr>

        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type">
              <option value="Online">Online</option>
            </select>
          </td>
        </tr>

        <br />

        <tr>
          <td align="right" valign="top"></td>
          <td>
            <label>Online Entry Options</label>
            <br />
            <label>
              <input id="wd-text-entry" type="checkbox" /> Text Entry
            </label>
            <br />
            <label>
              <input id="wd-website-url" type="checkbox" /> Website URL
            </label>
            <br />
            <label>
              <input id="wd-media-recordings" type="checkbox" /> Media
              Recordings
            </label>
            <br />
            <label>
              <input id="wd-student-annotation" type="checkbox" /> Student
              Annotation
            </label>
            <br />
            <label>
              <input id="wd-file-upload" type="checkbox" /> File Upload
            </label>
          </td>
        </tr>
        <br />

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-limit">Assign</label>
          </td>
          <td align="left" valign="top">
            <label htmlFor="wd-assign-to">Assign To</label>
            <br />
            <input id="wd-assign-to" value="Everyone" />
            <br />
            <br />
            <label htmlFor="wd-due-date">Due</label>
            <br />
            <input id="wd-due-date" type="date" value="2024-05-13" />
            <br />
            <br />
            <tr>
              <td align="left" valign="top">
                <label htmlFor="wd-available-from">Available</label>
                <br />
                <input id="wd-available-from" type="date" value="2024-05-06" />
              </td>
              <td align="left" valign="top">
                <label htmlFor="wd-available-to">Until</label>
                <br />
                <input id="wd-available-to" type="date" value="2024-05-13" />
              </td>
            </tr>
          </td>
        </tr>

        <br />
      </table>
      <hr />
      <table width="100%">
        <tr>
          <td align="right">
            <button>Cancel</button>
            <button>Save</button>
          </td>
        </tr>
      </table>
    </div>
  );
}
