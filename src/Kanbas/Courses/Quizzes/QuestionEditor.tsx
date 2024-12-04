import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillBlankEditor from "./FillBlankEditor";

interface BaseQuestion {
  _id: string;
  title: string;
  points: number;
  questionText: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  choices?: string[];
  correctChoice?: number;
  correctAnswer?: boolean;
  possibleAnswers?: string[];
}

interface QuestionEditorProps {
  question: BaseQuestion;
  onSave: (question: BaseQuestion) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function QuestionEditor({
  question,
  onSave,
  onCancel,
  onDelete,
}: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] = useState<BaseQuestion>(question);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any;

    if (name === "points") {
      // Handle points specifically
      const parsedValue = parseInt(value);
      newValue =
        value === ""
          ? 0
          : isNaN(parsedValue)
          ? editedQuestion.points
          : parsedValue;
    } else {
      newValue = value;
    }

    setEditedQuestion((prev: BaseQuestion) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-3">
            <select
              className="form-select"
              name="type"
              value={editedQuestion.type}
              onChange={handleChange}
              style={{ width: "200px" }}
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="FILL_BLANK">Fill in the Blank</option>
            </select>
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="number"
                className="form-control"
                name="points"
                value={editedQuestion.points}
                onChange={handleChange}
                min="0"
                step="1"
                onWheel={(e) => e.currentTarget.blur()}
                style={{ width: "100px" }}
              />
              <span className="pt-2">pts</span>
            </div>
          </div>
          <button className="btn btn-danger" onClick={onDelete}>
            <BsTrash />
          </button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Question Title"
            name="title"
            value={editedQuestion.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Question Text"
            name="questionText"
            value={editedQuestion.questionText}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Type-specific editors will be rendered here */}
        {editedQuestion.type === "MULTIPLE_CHOICE" && (
          <MultipleChoiceEditor
            question={editedQuestion}
            onChange={setEditedQuestion}
          />
        )}
        {editedQuestion.type === "TRUE_FALSE" && (
          <TrueFalseEditor
            question={editedQuestion}
            onChange={setEditedQuestion}
          />
        )}
        {editedQuestion.type === "FILL_BLANK" && (
          <FillBlankEditor
            question={editedQuestion}
            onChange={setEditedQuestion}
          />
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(editedQuestion)}
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
}
