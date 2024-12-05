import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";
import { findQuizzesForCourse } from "./client";
import { setQuizzes } from "./reducer";

interface Answer {
  questionId: string;
  selectedChoice?: number;
  selectedAnswer?: boolean;
  textAnswer?: string;
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const isFaculty = currentUser?.role === "FACULTY";

  console.log("Preview params:", { cid, qid });

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        console.log("Loading quizzes for course:", cid);
        setLoading(true);
        const quizzes = await findQuizzesForCourse(cid!);
        console.log("Loaded quizzes:", quizzes);
        dispatch(setQuizzes(quizzes));
      } catch (error) {
        console.error("Error loading quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [cid, dispatch]);

  const quiz = useSelector((state: any) => {
    const quizzes = state.quizzesReducer.quizzes;
    console.log("Current quizzes in store:", quizzes);
    return quizzes.find((q: any) => q._id === qid && q.course === cid);
  });

  console.log("Selected quiz:", quiz);

  if (loading) {
    return <div className="p-4">Loading quiz preview...</div>;
  }

  if (!quiz) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">
          Quiz not found. Please make sure you have selected a valid quiz.
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (a) => a.questionId === questionId
      );
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          questionId,
          ...value,
        };
        return newAnswers;
      }
      return [...prev, { questionId, ...value }];
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    answers.forEach((answer) => {
      const question = quiz.questions.find(
        (q: any) => q._id === answer.questionId
      );
      if (question) {
        if (
          question.type === "MULTIPLE_CHOICE" &&
          answer.selectedChoice === question.correctChoice
        ) {
          totalScore += question.points;
        } else if (
          question.type === "TRUE_FALSE" &&
          answer.selectedAnswer === question.correctAnswer
        ) {
          totalScore += question.points;
        }
      }
    });
    return totalScore;
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
    setShowSubmitConfirm(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        {isFaculty && (
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit/questions`)
            }
          >
            <BsPencilSquare className="me-2" />
            Edit Quiz
          </button>
        )}
      </div>

      {submitted ? (
        <div className="alert alert-success">
          Your score: {score} out of {quiz.points} points
        </div>
      ) : (
        <>
          <div className="card mb-3">
            <div className="card-header bg-light">
              Question {currentQuestionIndex + 1}
              <span className="float-end">{currentQuestion.points} pts</span>
            </div>
            <div className="card-body">
              <p>{currentQuestion.questionText}</p>

              {currentQuestion.type === "MULTIPLE_CHOICE" && (
                <div className="list-group">
                  {currentQuestion.choices.map(
                    (choice: string, index: number) => (
                      <label key={index} className="list-group-item">
                        <input
                          type="radio"
                          name={`question-${currentQuestion._id}`}
                          className="me-2"
                          checked={
                            answers.find(
                              (a) => a.questionId === currentQuestion._id
                            )?.selectedChoice === index
                          }
                          onChange={() =>
                            handleAnswerChange(currentQuestion._id, {
                              selectedChoice: index,
                            })
                          }
                        />
                        {choice}
                      </label>
                    )
                  )}
                </div>
              )}

              {currentQuestion.type === "TRUE_FALSE" && (
                <div className="list-group">
                  {["True", "False"].map((choice, index) => (
                    <label key={index} className="list-group-item">
                      <input
                        type="radio"
                        name={`question-${currentQuestion._id}`}
                        className="me-2"
                        checked={
                          answers.find(
                            (a) => a.questionId === currentQuestion._id
                          )?.selectedAnswer ===
                          (choice === "True")
                        }
                        onChange={() =>
                          handleAnswerChange(currentQuestion._id, {
                            selectedAnswer: choice === "True",
                          })
                        }
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <div className="d-flex gap-2">
                {quiz.questions.map((_: any, index: number) => (
                  <button
                    key={index}
                    className={`btn ${
                      currentQuestionIndex === index
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-secondary"
                onClick={handleNext}
                disabled={currentQuestionIndex === quiz.questions.length - 1}
              >
                Next
              </button>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-success" onClick={handleSubmitClick}>
                Submit Quiz
              </button>
            </div>
          </div>
        </>
      )}

      {showSubmitConfirm && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Quiz</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSubmitConfirm(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to submit this quiz? You won't be able to
                change your answers after submission.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={confirmSubmit}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
