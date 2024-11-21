import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addAssignment, updateAssignment } from "./reducer";
import { createAssignmentForCourse, updateAssignmentAPI } from "./client";

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
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const isFaculty = currentUser?.role === "FACULTY";

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
    onlineEntryOptions: [],
  });

  const availableEntryOptions = ["Text Entry", "Website URL", "File Upload"];

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

  const toggleEntryOption = (option: string) => {
    setAssignment((prev) => {
      const updatedOptions = prev.onlineEntryOptions.includes(option)
        ? prev.onlineEntryOptions.filter((opt) => opt !== option)
        : [...prev.onlineEntryOptions, option];
      return { ...prev, onlineEntryOptions: updatedOptions };
    });
  };

  const handleSave = async () => {
    if (!isFaculty) {
      alert("Unauthorized to add or edit assignments.");
      return;
    }

    if (!cid) {
      alert("Course ID is required.");
      console.error("Course ID is missing.");
      return;
    }

    try {
      if (aid === "new") {
        // Add a new assignment
        const newAssignment = await createAssignmentForCourse(cid, assignment);
        dispatch(addAssignment(newAssignment));
      } else {
        // Update an existing assignment
        const updatedAssignment = await updateAssignmentAPI(assignment);
        dispatch(updateAssignment(updatedAssignment));
      }
      navigate(`/Kanbas/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Failed to save assignment. Please try again.");
    }
  };

  if (!isFaculty) {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div id="wd-assignments-editor" className="p-4">
      <div className="mb-4">
        <label htmlFor="wd-name" className="form-label mb-1">
          Assignment Name
        </label>
        <input
          id="wd-name"
          name="title"
          value={assignment.title}
          onChange={handleChange}
          className="form-control"
          style={{ width: "100%" }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="wd-description" className="form-label mb-1">
          Description
        </label>
        <textarea
          id="wd-description"
          name="description"
          value={assignment.description}
          onChange={handleChange}
          className="form-control bg-light border rounded"
          style={{ width: "100%" }}
        />
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="wd-points" className="col-sm-3 col-form-label">
          Points
        </label>
        <div className="col-sm-9">
          <input
            id="wd-points"
            type="number"
            name="points"
            value={assignment.points}
            onChange={handleChange}
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
      </div>

      <div className="mb-4 row ms-5">
        <label htmlFor="wd-submission-type" className="col-sm-3 col-form-label">
          Submission Type
        </label>
        <div className="col-sm-9 border p-3 rounded">
          <select
            id="wd-submission-type"
            name="submissionType"
            className="form-select mb-3"
            style={{ width: "100%" }}
            value={assignment.submissionType}
            onChange={handleChange}
          >
            <option value="Online">Online</option>
          </select>

          <div className="form-group">
            <label className="form-label">Online Entry Options</label>
            {availableEntryOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={assignment.onlineEntryOptions.includes(option)}
                  onChange={() => toggleEntryOption(option)}
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
            readOnly
          />

          <label htmlFor="wd-due-date" className="form-label">
            Due
          </label>
          <input
            id="wd-due-date"
            type="date"
            name="dueDate"
            value={assignment.dueDate}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="wd-available-from" className="form-label">
                Available From
              </label>
              <input
                id="wd-available-from"
                type="date"
                name="availableFrom"
                value={assignment.availableFrom}
                onChange={handleChange}
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
                name="availableUntil"
                value={assignment.availableUntil}
                onChange={handleChange}
                className="form-control"
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
        <button onClick={handleSave} className="btn btn-danger">
          Save
        </button>
      </div>
    </div>
  );
}
