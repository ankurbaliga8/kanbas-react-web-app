import React, { useState } from "react";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: "M101",
    name: "React Basics",
    description: "Introduction to React and its core concepts",
    course: "CS5610",
  });

  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <h4>Modifying Assignment Properties</h4>
      <div className="d-flex align-items-center mb-2">
        <input
          className="form-control w-75 me-2"
          id="wd-assignment-title"
          type="text"
          defaultValue={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />
        <a
          id="wd-update-assignment-title"
          className="btn btn-primary"
          href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
        >
          Update Title
        </a>
      </div>
      <hr />

      <div className="d-flex align-items-center mb-2">
        <input
          className="form-control w-75 me-2"
          type="number"
          defaultValue={assignment.score}
          onChange={(e) =>
            setAssignment({ ...assignment, score: parseInt(e.target.value) })
          }
        />
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={assignment.completed}
            onChange={(e) =>
              setAssignment({ ...assignment, completed: e.target.checked })
            }
          />
          <label className="form-check-label ms-2">Completed</label>
        </div>
      </div>
      <a
        id="wd-update-assignment-score-completed"
        className="btn btn-warning mt-2"
        href={`${ASSIGNMENT_API_URL}/update?score=${assignment.score}&completed=${assignment.completed}`}
      >
        Update Score and Completion
      </a>
      <hr />

      <h4>Retrieving Module</h4>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary mb-2"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <hr />
      <a
        id="wd-retrieve-module-name"
        className="btn btn-secondary mb-2"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>
      <hr />

      <h4>Modifying Module Properties</h4>
      <div className="d-flex align-items-center mb-2">
        <input
          className="form-control w-75 me-2"
          id="wd-module-name"
          type="text"
          defaultValue={module.name}
          onChange={(e) => setModule({ ...module, name: e.target.value })}
        />
        <a
          id="wd-update-module-name"
          className="btn btn-primary"
          href={`${MODULE_API_URL}/name/${module.name}`}
        >
          Update Module Name
        </a>
      </div>
      <hr />

      <div className="d-flex align-items-center mb-2">
        <input
          className="form-control w-75 me-2"
          id="wd-module-description"
          type="text"
          defaultValue={module.description}
          onChange={(e) =>
            setModule({ ...module, description: e.target.value })
          }
        />
        <a
          id="wd-update-module-description"
          className="btn btn-success"
          href={`${MODULE_API_URL}/description/${module.description}`}
        >
          Update Module Description
        </a>
      </div>
      <hr />
    </div>
  );
}
