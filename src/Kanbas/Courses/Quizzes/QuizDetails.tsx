import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { findQuizzesForCourse, getQuizAttempts } from "./client";
import { setQuizzes } from "./reducer";
import QuizPreview from "./QuizPreview";

interface Answer {
  questionId: string;
  selectedChoice?: number;
  selectedAnswer?: boolean;
  textAnswer?: string;
  isCorrect?: boolean;
}

interface QuizAttempt {
  attemptNumber: number;
  studentId: string;
  answers: Answer[];
  score: number;
  submittedAt: string;
  isCorrectByQuestion: { [key: string]: boolean };
}

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const quizzes = await findQuizzesForCourse(cid!);
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
    const loadAttempts = async () => {
      try {
        if (!qid || !currentUser?._id) return;
        const loadedAttempts = await getQuizAttempts(qid, currentUser._id);
        // Sort attempts by attempt number in descending order
        setAttempts(
          loadedAttempts.sort(
            (a: QuizAttempt, b: QuizAttempt) =>
              b.attemptNumber - a.attemptNumber
          )
        );
      } catch (error) {
        console.error("Error loading attempts:", error);
        setAttempts([]);
      }
    };
    loadAttempts();
  }, [qid, currentUser._id]);

  const quiz = useSelector((state: any) =>
    state.quizzesReducer.quizzes.find(
      (q: any) => q._id === qid && q.course === cid
    )
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getAvailabilityStatus = (quiz: any) => {
    const now = new Date();
    const availableFrom = new Date(quiz.availableFrom);
    const availableUntil = new Date(quiz.availableUntil);

    if (now > availableUntil) {
      return "Closed";
    } else if (now >= availableFrom && now <= availableUntil) {
      return "Available";
    } else {
      return `Not available until ${new Date(
        quiz.availableFrom
      ).toLocaleDateString()}`;
    }
  };

  const getHighestScore = (attempts: QuizAttempt[]) => {
    if (!attempts || attempts.length === 0) return 0;
    return Math.max(...attempts.map((attempt) => attempt.score));
  };

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>{quiz.title}</h2>
          {!isFaculty && attempts.length > 0 && (
            <div className="text-success">
              <h4>
                Score: {getHighestScore(attempts)} / {quiz.points}
              </h4>
            </div>
          )}
        </div>
        <div>
          {isFaculty ? (
            <>
              <button
                className="btn btn-secondary me-2"
                onClick={() =>
                  navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`)
                }
              >
                Preview
              </button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit/details`)
                }
              >
                <BsPencilSquare className="me-2" />
                Edit
              </button>
            </>
          ) : (
            <div>
              {!canAttemptQuiz() && (
                <div className="alert alert-warning mb-2">
                  {quiz.multipleAttempts
                    ? `Maximum attempts (${quiz.maxAttempts}) reached`
                    : "You have already attempted this quiz"}
                </div>
              )}
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`)
                }
                disabled={
                  !quiz.published ||
                  getAvailabilityStatus(quiz) !== "Available" ||
                  !canAttemptQuiz()
                }
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {!quiz.published && !isFaculty && (
        <div className="alert alert-warning">
          This quiz is not yet available.
        </div>
      )}

      {getAvailabilityStatus(quiz) !== "Available" && !isFaculty && (
        <div className="alert alert-info">{getAvailabilityStatus(quiz)}</div>
      )}

      <hr className="mb-4" />

      <div className="row justify-content-center">
        <div className="col-8">
          <table className="table">
            <tbody>
              <tr>
                <td width="250" className="text-end pe-4">
                  <strong>Quiz Type</strong>
                </td>
                <td>
                  {quiz?.quizType
                    ? quiz.quizType.replace(/_/g, " ")
                    : "Not set"}
                </td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Points</strong>
                </td>
                <td>
                  {typeof quiz?.points === "number" ? quiz.points : 0} pts
                </td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Assignment Group</strong>
                </td>
                <td>{quiz?.assignmentGroup || "Not set"}</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Shuffle Answers</strong>
                </td>
                <td>{quiz?.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Time Limit</strong>
                </td>
                <td>{quiz?.timeLimit || 0} Minutes</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Multiple Attempts</strong>
                </td>
                <td>
                  {quiz?.multipleAttempts
                    ? `Yes (${quiz.maxAttempts} attempts allowed)`
                    : "No"}
                </td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Show Correct Answers</strong>
                </td>
                <td>{quiz?.showCorrectAnswers ? "Immediately" : "Never"}</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Access Code</strong>
                </td>
                <td>{quiz?.accessCode || "None"}</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>One Question at a Time</strong>
                </td>
                <td>{quiz?.oneQuestionAtTime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Webcam Required</strong>
                </td>
                <td>{quiz?.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end pe-4">
                  <strong>Lock Questions After Answering</strong>
                </td>
                <td>{quiz?.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>

          <hr className="my-4" />

          <table className="table">
            <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available from</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(quiz?.dueDate)}</td>
                <td>Everyone</td>
                <td>{formatDate(quiz?.availableFrom)}</td>
                <td>{formatDate(quiz?.availableUntil)}</td>
              </tr>
            </tbody>
          </table>

          {!isFaculty && attempts.length > 0 && (
            <div className="mt-4">
              <h3>Your Attempts</h3>
              <div className="list-group">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.attemptNumber}
                    className="list-group-item list-group-item-action"
                    onClick={() =>
                      navigate(
                        `/Kanbas/Courses/${cid}/Quizzes/${qid}/preview?attempt=${attempt.attemptNumber}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Attempt {attempt.attemptNumber}</h5>
                      <span className="badge bg-primary">
                        Score: {attempt.score} / {quiz.points}
                      </span>
                    </div>
                    <p className="mb-1">
                      Submitted:{" "}
                      {new Date(attempt.submittedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
