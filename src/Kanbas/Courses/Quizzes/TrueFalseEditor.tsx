import React from "react";

interface TrueFalseEditorProps {
  question: any;
  onChange: (question: any) => void;
}

export default function TrueFalseEditor({
  question,
  onChange,
}: TrueFalseEditorProps) {
  return (
    <div>
      <div className="d-flex gap-4">
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name={`correct-${question._id}`}
            checked={question.correctAnswer === true}
            onChange={() => onChange({ ...question, correctAnswer: true })}
          />
          <label className="form-check-label">True</label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name={`correct-${question._id}`}
            checked={question.correctAnswer === false}
            onChange={() => onChange({ ...question, correctAnswer: false })}
          />
          <label className="form-check-label">False</label>
        </div>
      </div>
    </div>
  );
}
