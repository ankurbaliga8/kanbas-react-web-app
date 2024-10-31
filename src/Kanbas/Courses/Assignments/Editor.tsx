import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addAssignment, updateAssignment } from "./reducer";

interface AssignmentState {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  assignmentGroup: string;
  submissionType: string;
  onlineEntryOptions: string[];
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assignmentToEdit = useSelector((state: any) =>
    state.assignmentsReducer.assignments.find(
      (assignment: any) => assignment._id === aid && assignment.course === cid
    )
  );

  const [assignment, setAssignment] = useState<AssignmentState>({
    _id: aid || "",
    title: "",
    course: cid || "",
    description: "",
    points: 0,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    assignmentGroup: "Assignments",
    submissionType: "Online",
    onlineEntryOptions: [], // Ensure this is typed as string[]
  });

  useEffect(() => {
    if (assignmentToEdit) {
      setAssignment(assignmentToEdit);
    }
  }, [assignmentToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (aid === "new") {
      dispatch(
        addAssignment({ ...assignment, _id: new Date().getTime().toString() })
      );
    } else {
      dispatch(updateAssignment(assignment));
    }
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <div className="mb-4">
        <label htmlFor="title" className="form-label mb-1">
          Assignment Name
        </label>
        <input
          id="title"
          name="title"
          value={assignment.title}
          onChange={handleChange}
          className="form-control"
          style={{ width: "100%" }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={assignment.description}
          onChange={handleChange}
          className="form-control bg-light border rounded"
          style={{ width: "100%" }}
        />
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="points" className="col-sm-3 col-form-label">
          Points
        </label>
        <div className="col-sm-9">
          <input
            id="points"
            type="number"
            name="points"
            value={assignment.points}
            onChange={handleChange}
            className="form-control mb-3"
            style={{ width: "100%" }}
          />
        </div>

        <label htmlFor="assignmentGroup" className="col-sm-3 col-form-label">
          Assignment Group
        </label>
        <div className="col-sm-9">
          <select
            id="assignmentGroup"
            name="assignmentGroup"
            className="form-select mb-3"
            style={{ width: "100%" }}
            value={assignment.assignmentGroup}
            onChange={handleChange}
          >
            <option value="Assignments">Assignments</option>
            <option value="Quizzes">Quizzes</option>
            <option value="Exams">Exams</option>
            <option value="Projects">Projects</option>
          </select>
        </div>

        <label htmlFor="submissionType" className="col-sm-3 col-form-label">
          Submission Type
        </label>
        <div className="col-sm-9 border p-3 rounded">
          <select
            id="submissionType"
            name="submissionType"
            className="form-select mb-3"
            style={{ width: "100%" }}
            value={assignment.submissionType}
            onChange={handleChange}
          >
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="dueDate" className="col-sm-3 col-form-label">
          Due Date
        </label>
        <div className="col-sm-9">
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={assignment.dueDate}
            onChange={handleChange}
            className="form-control mb-3"
            style={{ width: "100%" }}
          />
        </div>

        <label htmlFor="availableFrom" className="col-sm-3 col-form-label">
          Available From
        </label>
        <div className="col-sm-9">
          <input
            id="availableFrom"
            type="date"
            name="availableFrom"
            value={assignment.availableFrom}
            onChange={handleChange}
            className="form-control mb-3"
            style={{ width: "100%" }}
          />
        </div>

        <label htmlFor="availableUntil" className="col-sm-3 col-form-label">
          Available Until
        </label>
        <div className="col-sm-9">
          <input
            id="availableUntil"
            type="date"
            name="availableUntil"
            value={assignment.availableUntil}
            onChange={handleChange}
            className="form-control mb-3"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="mb-4 row ms-5">
        <label className="col-sm-3 col-form-label">Online Entry Options</label>
        <div className="col-sm-9">
          {["Text Entry", "Website URL", "File Upload"].map((option) => (
            <div className="form-check" key={option}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={assignment.onlineEntryOptions.includes(option)}
                onChange={() =>
                  setAssignment((prev) => ({
                    ...prev,
                    onlineEntryOptions: prev.onlineEntryOptions.includes(option)
                      ? prev.onlineEntryOptions.filter((opt) => opt !== option)
                      : [...prev.onlineEntryOptions, option],
                  }))
                }
              />
              <label className="form-check-label">{option}</label>
            </div>
          ))}
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
        <button onClick={handleSave} className="btn btn-danger">
          Save
        </button>
      </div>
    </div>
  );
}
