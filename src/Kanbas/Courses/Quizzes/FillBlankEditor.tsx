import React from "react";
import { BsTrash, BsPlusCircle } from "react-icons/bs";

interface FillBlankEditorProps {
  question: any;
  onChange: (question: any) => void;
}

export default function FillBlankEditor({
  question,
  onChange,
}: FillBlankEditorProps) {
  const addPossibleAnswer = () => {
    onChange({
      ...question,
      possibleAnswers: [...(question.possibleAnswers || []), ""],
    });
  };

  const removePossibleAnswer = (index: number) => {
    const newAnswers = question.possibleAnswers.filter(
      (_: any, i: number) => i !== index
    );
    onChange({
      ...question,
      possibleAnswers: newAnswers,
    });
  };

  const updatePossibleAnswer = (index: number, value: string) => {
    const newAnswers = [...question.possibleAnswers];
    newAnswers[index] = value;
    onChange({
      ...question,
      possibleAnswers: newAnswers,
    });
  };

  return (
    <div>
      <div className="possible-answers-list">
        {(question.possibleAnswers || []).map(
          (answer: string, index: number) => (
            <div key={index} className="d-flex align-items-center mb-2 gap-2">
              <input
                type="text"
                className="form-control"
                value={answer}
                onChange={(e) => updatePossibleAnswer(index, e.target.value)}
                placeholder={`Possible Answer ${index + 1}`}
              />
              <button
                className="btn btn-outline-danger"
                onClick={() => removePossibleAnswer(index)}
              >
                <BsTrash />
              </button>
            </div>
          )
        )}
      </div>
      <button
        className="btn btn-outline-primary mt-2"
        onClick={addPossibleAnswer}
      >
        <BsPlusCircle className="me-2" />
        Add Possible Answer
      </button>
    </div>
  );
}
