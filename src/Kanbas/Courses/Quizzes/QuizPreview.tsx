import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";
import {
  findQuizzesForCourse,
  saveQuizAttempt,
  getQuizAttempts,
  getSpecificQuizAttempt,
} from "./client";
import { setQuizzes } from "./reducer";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Answer {
  questionId: string;
  selectedChoice?: number;
  selectedAnswer?: boolean;
  textAnswer?: string;
  isCorrect?: boolean;
}

interface QuizAttempt {
  quizId: string;
  attemptNumber: number;
  studentId: string;
  answers: Answer[];
  score: number;
  submittedAt: string;
  isCorrectByQuestion: { [key: string]: boolean };
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
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<number>(0);
  const [viewingResults, setViewingResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [viewingAttemptNumber, setViewingAttemptNumber] = useState<
    number | null
  >(null);
  const location = useLocation();

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const attemptParam = params.get("attempt");

    if (attemptParam) {
      const attemptNumber = parseInt(attemptParam);
      setViewingAttemptNumber(attemptNumber);

      const loadAttempt = async () => {
        try {
          const attempt = await getSpecificQuizAttempt(
            qid!,
            currentUser._id,
            attemptNumber
          );
          if (attempt) {
            setAnswers(attempt.answers);
            setScore(attempt.score);
            setSubmitted(true);
            setViewingResults(true);
            setAttempts((prev) => {
              const exists = prev.some(
                (a) => a.attemptNumber === attempt.attemptNumber
              );
              if (!exists) {
                return [...prev, attempt];
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("Error loading attempt:", error);
        }
      };
      loadAttempt();
    }
  }, [location.search, qid, currentUser._id]);

  const quiz = useSelector((state: any) => {
    const quizzes = state.quizzesReducer.quizzes;
    console.log("Current quizzes in store:", quizzes);
    return quizzes.find((q: any) => q._id === qid && q.course === cid);
  });

  console.log("Selected quiz:", quiz);

  const calculateScore = () => {
    let totalScore = 0;
    quiz.questions.forEach((question: any) => {
      const answer = answers.find((a) => a.questionId === question._id);
      if (!answer) return; // Skip if question not answered

      if (question.type === "FILL_BLANK") {
        const userAnswer = answer.textAnswer?.toLowerCase().trim();
        if (!userAnswer) return;
        const possibleAnswers = question.possibleAnswers || [
          question.correctAnswer,
        ];
        const isCorrect = possibleAnswers.some(
          (possible: string) => possible?.toLowerCase().trim() === userAnswer
        );
        if (isCorrect) {
          totalScore += question.points;
        }
      } else if (question.type === "MULTIPLE_CHOICE") {
        if (answer.selectedChoice === question.correctChoice) {
          totalScore += question.points;
        }
      } else if (question.type === "TRUE_FALSE") {
        if (answer.selectedAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      }
    });
    return totalScore;
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (a) => a.questionId === questionId
      );
      const newAnswer = { questionId, ...value };

      let newAnswers: Answer[];
      if (existingAnswerIndex !== -1) {
        newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = newAnswer;
      } else {
        newAnswers = [...prev, newAnswer];
      }

      if (quiz) {
        const currentScore = calculateScore();
        const currentIsCorrectByQuestion: { [key: string]: boolean } = {};

        quiz.questions.forEach((question: any) => {
          const answer = newAnswers.find(
            (a: Answer) => a.questionId === question._id
          );
          currentIsCorrectByQuestion[question._id] = false;

          if (answer) {
            if (question.type === "FILL_BLANK") {
              const userAnswer = answer.textAnswer?.toLowerCase().trim();
              if (userAnswer) {
                const possibleAnswers = question.possibleAnswers || [
                  question.correctAnswer,
                ];
                currentIsCorrectByQuestion[question._id] = possibleAnswers.some(
                  (possible: string) =>
                    possible?.toLowerCase().trim() === userAnswer
                );
              }
            } else if (question.type === "MULTIPLE_CHOICE") {
              currentIsCorrectByQuestion[question._id] =
                answer.selectedChoice === question.correctChoice;
            } else if (question.type === "TRUE_FALSE") {
              currentIsCorrectByQuestion[question._id] =
                answer.selectedAnswer === question.correctAnswer;
            }
          }
        });
      }

      return newAnswers;
    });
  };

  const handleAutoSubmit = async () => {
    if (!quiz || submitted) return; // Prevent multiple submissions
    await submitQuiz();
  };

  const confirmSubmit = async () => {
    if (!quiz || submitted) return; // Prevent multiple submissions
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    await submitQuiz();
  };

  const submitQuiz = async () => {
    if (submitted) return;

    const finalScore = calculateScore();
    const isCorrectByQuestion: { [key: string]: boolean } = {};

    quiz.questions.forEach((question: any) => {
      const answer = answers.find((a) => a.questionId === question._id);
      isCorrectByQuestion[question._id] = false;

      if (answer) {
        if (question.type === "FILL_BLANK") {
          const userAnswer = answer.textAnswer?.toLowerCase().trim();
          if (userAnswer) {
            const possibleAnswers = question.possibleAnswers || [
              question.correctAnswer,
            ];
            isCorrectByQuestion[question._id] = possibleAnswers.some(
              (possible: string) =>
                possible?.toLowerCase().trim() === userAnswer
            );
          }
        } else if (question.type === "MULTIPLE_CHOICE") {
          isCorrectByQuestion[question._id] =
            answer.selectedChoice === question.correctChoice;
        } else if (question.type === "TRUE_FALSE") {
          isCorrectByQuestion[question._id] =
            answer.selectedAnswer === question.correctAnswer;
        }
      }
    });

    try {
      const currentAttempts = await getQuizAttempts(qid!, currentUser._id);
      const attemptNumber = currentAttempts.length + 1;

      const newAttempt = {
        quizId: qid!,
        attemptNumber,
        studentId: currentUser._id,
        answers: JSON.parse(JSON.stringify(answers)), // Deep copy of answers
        score: finalScore,
        submittedAt: new Date().toISOString(),
        isCorrectByQuestion,
      };

      const savedAttempt = await saveQuizAttempt(qid!, newAttempt);
      setSubmitted(true);
      setAttempts((prev) => [...prev, savedAttempt]);
      setScore(finalScore);
      setViewingResults(true);
      setViewingAttemptNumber(attemptNumber);

      navigate(
        `/Kanbas/Courses/${cid}/Quizzes/${qid}/preview?attempt=${attemptNumber}`
      );
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  };

  useEffect(() => {
    if (quiz?.timeLimit && !submitted && !isFaculty) {
      const timeInSeconds = quiz.timeLimit * 60;
      setTimeRemaining(timeInSeconds);

      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            // Clear any existing intervals to prevent double submission
            if (timerInterval) {
              clearInterval(timerInterval);
            }
            setShowSubmitConfirm(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimerInterval(interval);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [quiz?.timeLimit, submitted, isFaculty]);

  useEffect(() => {
    const loadAttempts = async () => {
      if (!qid || !currentUser?._id) return;
      try {
        const loadedAttempts = await getQuizAttempts(qid, currentUser._id);
        setAttempts(loadedAttempts || []);
      } catch (error) {
        console.error("Error loading attempts:", error);
      }
    };
    loadAttempts();
  }, [qid, currentUser._id]);

  const getHighestScore = (attempts: QuizAttempt[]) => {
    if (!attempts || attempts.length === 0) return 0;
    return Math.max(...attempts.map((attempt) => attempt.score));
  };

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

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
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

  const isViewingPreviousAttempt = viewingAttemptNumber !== null;

  const canAttemptQuiz = () => {
    if (!quiz.multipleAttempts && attempts.length > 0) {
      return false;
    }
    if (quiz.multipleAttempts && quiz.maxAttempts) {
      return attempts.length < quiz.maxAttempts;
    }
    return true;
  };

  return (
    <div className="p-4">
      {!quiz ? (
        <div>Loading...</div>
      ) : (
        <>
          {viewingAttemptNumber && (
            <div className="mb-4">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/view`)
                }
              >
                Back to Quiz Details
              </button>
            </div>
          )}
          {isFaculty && (
            <div className="alert alert-info mb-4">
              <i className="fas fa-info-circle me-2"></i>
              This is a preview of the published version of the quiz. Students
              will not see this message.
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{quiz.title}</h2>
            <div className="d-flex align-items-center gap-3">
              {!isFaculty && attempts.length > 0 && (
                <div className="alert alert-info mb-0 d-flex gap-3">
                  {viewingAttemptNumber && (
                    <div>
                      <strong>Current Score:</strong> {score} / {quiz.points}
                    </div>
                  )}
                  <div>
                    <strong>Highest Score:</strong> {getHighestScore(attempts)}{" "}
                    / {quiz.points}
                  </div>
                </div>
              )}
              {!isFaculty && timeRemaining !== null && !submitted && (
                <div
                  className={`alert ${
                    timeRemaining < 60 ? "alert-danger" : "alert-info"
                  } mb-0`}
                >
                  Time Remaining: {Math.floor(timeRemaining / 60)}:
                  {String(timeRemaining % 60).padStart(2, "0")}
                </div>
              )}
              {isFaculty && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      `/Kanbas/Courses/${cid}/Quizzes/${qid}/edit/questions`
                    )
                  }
                >
                  <BsPencilSquare className="me-2" />
                  Edit Quiz
                </button>
              )}
            </div>
          </div>

          {!submitted && quiz && (
            <div className="quiz-questions mt-4">
              <div className="question-navigation mb-4">
                {quiz.questions.map((_: any, index: number) => (
                  <button
                    key={index}
                    className={`btn ${
                      currentQuestionIndex === index
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } me-2 mb-2`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {quiz.questions[currentQuestionIndex] && (
                <div className="card">
                  <div className="card-header">
                    Question {currentQuestionIndex + 1}
                  </div>
                  <div className="card-body">
                    <p>{quiz.questions[currentQuestionIndex].questionText}</p>

                    {quiz.questions[currentQuestionIndex].type ===
                      "MULTIPLE_CHOICE" && (
                      <div className="choices">
                        {quiz.questions[currentQuestionIndex].choices.map(
                          (choice: string, index: number) => (
                            <div key={index} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name={`question-${quiz.questions[currentQuestionIndex]._id}`}
                                checked={
                                  answers.find(
                                    (a) =>
                                      a.questionId ===
                                      quiz.questions[currentQuestionIndex]._id
                                  )?.selectedChoice === index
                                }
                                onChange={() =>
                                  handleAnswerChange(
                                    quiz.questions[currentQuestionIndex]._id,
                                    { selectedChoice: index }
                                  )
                                }
                              />
                              <label className="form-check-label">
                                {choice}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {quiz.questions[currentQuestionIndex].type ===
                      "TRUE_FALSE" && (
                      <div className="choices">
                        {["True", "False"].map((choice, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              name={`question-${quiz.questions[currentQuestionIndex]._id}`}
                              checked={
                                answers.find(
                                  (a) =>
                                    a.questionId ===
                                    quiz.questions[currentQuestionIndex]._id
                                )?.selectedAnswer ===
                                (choice === "True")
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  quiz.questions[currentQuestionIndex]._id,
                                  { selectedAnswer: choice === "True" }
                                )
                              }
                            />
                            <label className="form-check-label">{choice}</label>
                          </div>
                        ))}
                      </div>
                    )}

                    {quiz.questions[currentQuestionIndex].type ===
                      "FILL_BLANK" && (
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          value={
                            answers.find(
                              (a) =>
                                a.questionId ===
                                quiz.questions[currentQuestionIndex]._id
                            )?.textAnswer || ""
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              quiz.questions[currentQuestionIndex]._id,
                              { textAnswer: e.target.value }
                            )
                          }
                          placeholder="Enter your answer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="navigation-buttons mt-4 d-flex justify-content-between">
                <button
                  className="btn btn-secondary"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setShowSubmitConfirm(true)}
                >
                  Submit Quiz
                </button>
                <button
                  className="btn btn-primary"
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {submitted && viewingAttemptNumber ? (
            <>
              <div className="alert alert-success mb-4">
                <h4>Quiz Results - Attempt {viewingAttemptNumber}</h4>
                <p>
                  Score: {score} out of {quiz.points} points
                </p>
                {quiz.multipleAttempts && (
                  <p>
                    Attempts used: {attempts.length} / {quiz.maxAttempts || "∞"}
                  </p>
                )}
                <p>
                  Submitted:{" "}
                  {new Date(
                    attempts.find(
                      (a) => a.attemptNumber === viewingAttemptNumber
                    )?.submittedAt || ""
                  ).toLocaleString()}
                </p>
              </div>

              {quiz.questions.map((question: any, index: number) => {
                const currentAttempt = attempts.find(
                  (a) => a.attemptNumber === viewingAttemptNumber
                );
                return (
                  <div
                    key={question._id}
                    className={`card mb-3 ${
                      currentAttempt?.isCorrectByQuestion[question._id]
                        ? "border-success"
                        : "border-danger"
                    }`}
                  >
                    <div className="card-header">
                      Question {index + 1}
                      {currentAttempt?.isCorrectByQuestion[question._id] ? (
                        <FaCheckCircle className="text-success ms-2" />
                      ) : (
                        <FaTimesCircle className="text-danger ms-2" />
                      )}
                    </div>
                    <div className="card-body">
                      <p>{question.questionText}</p>
                      {/* Show the user's answer */}
                      <div className="mt-3">
                        <strong>Your Answer:</strong>
                        {/* Multiple Choice Answer */}
                        {currentAttempt?.answers.find(
                          (a) => a.questionId === question._id
                        )?.selectedChoice !== undefined && (
                          <p>
                            {
                              question.choices[
                                currentAttempt.answers.find(
                                  (a) => a.questionId === question._id
                                )?.selectedChoice || 0
                              ]
                            }
                          </p>
                        )}
                        {/* True/False Answer */}
                        {currentAttempt?.answers.find(
                          (a) => a.questionId === question._id
                        )?.selectedAnswer !== undefined && (
                          <p>
                            {currentAttempt.answers.find(
                              (a) => a.questionId === question._id
                            )?.selectedAnswer
                              ? "True"
                              : "False"}
                          </p>
                        )}
                        {/* Fill in the Blank Answer */}
                        {currentAttempt?.answers.find(
                          (a) => a.questionId === question._id
                        )?.textAnswer && (
                          <p>
                            {
                              currentAttempt.answers.find(
                                (a) => a.questionId === question._id
                              )?.textAnswer
                            }
                          </p>
                        )}
                      </div>
                      {/* Show correct answer only if allowed */}
                      {quiz.showCorrectAnswers && (
                        <div className="mt-2 text-success">
                          <strong>Correct Answer:</strong>
                          {question.type === "MULTIPLE_CHOICE" && (
                            <p>{question.choices[question.correctChoice]}</p>
                          )}
                          {question.type === "FILL_BLANK" && (
                            <p>{question.correctAnswer}</p>
                          )}
                          {question.type === "TRUE_FALSE" && (
                            <p>{question.correctAnswer ? "True" : "False"}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}

          {showSubmitConfirm && (
            <div className="modal show d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Submit Quiz</h5>
                    {timeRemaining !== 0 && (
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowSubmitConfirm(false)}
                      ></button>
                    )}
                  </div>
                  <div className="modal-body">
                    {timeRemaining === 0 ? (
                      <p>Time's up! Please submit your quiz now.</p>
                    ) : (
                      <p>
                        Are you sure you want to submit this quiz? You won't be
                        able to change your answers after submission.
                      </p>
                    )}
                  </div>
                  <div className="modal-footer">
                    {timeRemaining !== 0 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowSubmitConfirm(false)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        submitQuiz();
                        setShowSubmitConfirm(false);
                      }}
                    >
                      Submit Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
