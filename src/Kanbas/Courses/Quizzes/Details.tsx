import React from "react";

export default function Details({ quiz, setQuiz }: any) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any;

    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (
      type === "number" &&
      (name === "points" || name === "timeLimit")
    ) {
      const parsedValue = parseInt(value);
      newValue =
        value === "" ? 0 : isNaN(parsedValue) ? quiz[name] : parsedValue;
    } else {
      newValue = value;
    }

    setQuiz((prev: any) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div>
      <div className="mb-4">
        <label className="form-label">Quiz Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={quiz.title}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Quiz Description</label>
        <textarea
          name="description"
          className="form-control"
          value={quiz.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Quiz Type</label>
        <select
          name="quizType"
          className="form-select"
          value={quiz.quizType}
          onChange={handleChange}
        >
          <option value="GRADED_QUIZ">Graded Quiz</option>
          <option value="PRACTICE_QUIZ">Practice Quiz</option>
          <option value="GRADED_SURVEY">Graded Survey</option>
          <option value="UNGRADED_SURVEY">Ungraded Survey</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Points</label>
        <input
          type="number"
          name="points"
          className="form-control"
          value={quiz.points}
          onChange={handleChange}
          min="0"
          step="1"
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Assignment Group</label>
        <select
          name="assignmentGroup"
          className="form-select"
          value={quiz.assignmentGroup}
          onChange={handleChange}
        >
          <option value="Quizzes">Quizzes</option>
          <option value="Exams">Exams</option>
          <option value="Assignments">Assignments</option>
          <option value="Projects">Projects</option>
        </select>
      </div>

      <div className="mb-4">
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="shuffleAnswers"
            checked={quiz.shuffleAnswers}
            onChange={handleChange}
          />
          <label className="form-check-label">Shuffle Answers</label>
        </div>

        <div className="mb-2">
          <label className="form-label">Time Limit (Minutes)</label>
          <input
            type="number"
            className="form-control"
            name="timeLimit"
            value={quiz.timeLimit}
            onChange={handleChange}
            min="0"
            step="1"
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="multipleAttempts"
            checked={quiz.multipleAttempts}
            onChange={handleChange}
          />
          <label className="form-check-label">Multiple Attempts</label>
        </div>

        {quiz.multipleAttempts && (
          <div className="mb-2">
            <label className="form-label">Number of Attempts Allowed</label>
            <input
              type="number"
              className="form-control"
              name="maxAttempts"
              value={quiz.maxAttempts || 0}
              onChange={handleChange}
              min="2"
              step="1"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        )}

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="showCorrectAnswers"
            checked={quiz.showCorrectAnswers}
            onChange={handleChange}
          />
          <label className="form-check-label">Show Correct Answers</label>
        </div>

        <div className="mb-2">
          <label className="form-label">Access Code</label>
          <input
            type="text"
            className="form-control"
            name="accessCode"
            value={quiz.accessCode}
            onChange={handleChange}
            placeholder="Leave blank for no access code"
          />
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="oneQuestionAtTime"
            checked={quiz.oneQuestionAtTime}
            onChange={handleChange}
          />
          <label className="form-check-label">One Question at a Time</label>
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="webcamRequired"
            checked={quiz.webcamRequired}
            onChange={handleChange}
          />
          <label className="form-check-label">Webcam Required</label>
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="lockQuestionsAfterAnswering"
            checked={quiz.lockQuestionsAfterAnswering}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Lock Questions After Answering
          </label>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            name="dueDate"
            value={quiz.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="col">
            <label className="form-label">Available From</label>
            <input
              type="date"
              className="form-control"
              name="availableFrom"
              value={quiz.availableFrom}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label className="form-label">Until</label>
            <input
              type="date"
              className="form-control"
              name="availableUntil"
              value={quiz.availableUntil}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
