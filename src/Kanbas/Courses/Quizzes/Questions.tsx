import React, { useState, useEffect } from "react";
import { BsPlusCircle } from "react-icons/bs";
import QuestionEditor from "./QuestionEditor";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { findQuizzesForCourse } from "./client";
import { setQuizzes } from "./reducer";

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

export default function Questions({ quiz, setQuiz }: any) {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const quizzes = await findQuizzesForCourse(cid!);
        dispatch(setQuizzes(quizzes));
      } catch (error) {
        console.error("Error loading quizzes:", error);
      }
    };
    if (!quiz) {
      loadQuizzes();
    }
  }, [cid, dispatch, quiz]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const addNewQuestion = () => {
    const questionNumber = quiz.questions.length + 1;
    const newQuestion: BaseQuestion = {
      _id: Date.now().toString(),
      title: `Question ${questionNumber}`,
      points: 1,
      questionText: "",
      type: "MULTIPLE_CHOICE",
      choices: ["", ""],
      correctChoice: 0,
    };

    setQuiz((prev: any) => ({
      ...prev,
      questions: Array.isArray(prev.questions)
        ? [...prev.questions, newQuestion]
        : [newQuestion],
    }));
    setEditingQuestionId(newQuestion._id);
  };

  const handleSaveQuestion = (updatedQuestion: BaseQuestion) => {
    const currentTotal = calculateTotalPoints();
    const targetTotal = quiz.points || 0;
    const oldQuestionPoints =
      quiz.questions?.find((q: BaseQuestion) => q._id === updatedQuestion._id)
        ?.points || 0;
    const newTotal =
      currentTotal - oldQuestionPoints + Number(updatedQuestion.points);

    if (newTotal > targetTotal) {
      alert(
        `Total points cannot exceed ${targetTotal}. Please adjust the question points.`
      );
      return;
    }

    const questionToSave = {
      ...updatedQuestion,
      points: Number(updatedQuestion.points),
    };

    setQuiz((prev: any) => ({
      ...prev,
      questions: Array.isArray(prev.questions)
        ? prev.questions.map((q: BaseQuestion) =>
            q._id === questionToSave._id ? questionToSave : q
          )
        : [questionToSave],
    }));
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setShowDeleteConfirm(questionId);
  };

  const confirmDelete = (questionId: string) => {
    setQuiz((prev: any) => ({
      ...prev,
      questions: Array.isArray(prev.questions)
        ? prev.questions.filter((q: BaseQuestion) => q._id !== questionId)
        : [],
    }));
    setEditingQuestionId(null);
    setShowDeleteConfirm(null);
  };

  const calculateTotalPoints = () => {
    if (!Array.isArray(quiz.questions)) return 0;
    return quiz.questions.reduce(
      (total: number, q: BaseQuestion) => total + Number(q.points),
      0
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Questions</h3>
        <div>
          <span
            className={`me-3 ${
              calculateTotalPoints() > quiz.points ? "text-danger" : ""
            }`}
          >
            Total Points: {calculateTotalPoints()} / {quiz.points}
          </span>
          <button
            className="btn btn-primary"
            onClick={addNewQuestion}
            disabled={calculateTotalPoints() >= quiz.points}
          >
            <BsPlusCircle className="me-2" />
            New Question
          </button>
        </div>
      </div>

      <div className="questions-list">
        {(Array.isArray(quiz.questions) ? quiz.questions : []).map(
          (question: BaseQuestion, index: number) => (
            <div key={question._id} className="mb-4">
              {editingQuestionId === question._id ? (
                <QuestionEditor
                  question={question}
                  questionIndex={index}
                  onSave={handleSaveQuestion}
                  onCancel={() => setEditingQuestionId(null)}
                  onDelete={() => handleDeleteQuestion(question._id)}
                />
              ) : (
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">Question {index + 1}</h5>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setEditingQuestionId(question._id)}
                      >
                        Edit
                      </button>
                    </div>
                    <p className="mb-2">{question.points} pts</p>
                    <p className="mb-0">{question.questionText}</p>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {(!Array.isArray(quiz.questions) || quiz.questions.length === 0) && (
        <div className="text-center text-muted my-5">
          <p>No questions yet. Click "New Question" to add one.</p>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Question</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(null)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete this question?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => confirmDelete(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
