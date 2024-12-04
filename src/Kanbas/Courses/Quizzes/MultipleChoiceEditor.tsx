import React from "react";
import { BsTrash, BsPlusCircle } from "react-icons/bs";

interface MultipleChoiceEditorProps {
  question: any;
  onChange: (question: any) => void;
}

export default function MultipleChoiceEditor({
  question,
  onChange,
}: MultipleChoiceEditorProps) {
  const addChoice = () => {
    onChange({
      ...question,
      choices: [...question.choices, ""],
    });
  };

  const removeChoice = (index: number) => {
    const newChoices = question.choices.filter(
      (_: any, i: number) => i !== index
    );
    onChange({
      ...question,
      choices: newChoices,
      correctChoice:
        question.correctChoice >= index
          ? question.correctChoice - 1
          : question.correctChoice,
    });
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...question.choices];
    newChoices[index] = value;
    onChange({
      ...question,
      choices: newChoices,
    });
  };

  return (
    <div>
      <div className="choices-list">
        {question.choices.map((choice: string, index: number) => (
          <div key={index} className="d-flex align-items-center mb-2 gap-2">
            <input
              type="radio"
              name={`correct-${question._id}`}
              checked={question.correctChoice === index}
              onChange={() => onChange({ ...question, correctChoice: index })}
              className="form-check-input mt-0"
            />
            <input
              type="text"
              className="form-control"
              value={choice}
              onChange={(e) => updateChoice(index, e.target.value)}
              placeholder={`Choice ${index + 1}`}
            />
            {question.choices.length > 2 && (
              <button
                className="btn btn-outline-danger"
                onClick={() => removeChoice(index)}
              >
                <BsTrash />
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary mt-2" onClick={addChoice}>
        <BsPlusCircle className="me-2" />
        Add Choice
      </button>
    </div>
  );
}
