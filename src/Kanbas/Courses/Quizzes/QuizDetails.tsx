import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const quiz = useSelector((state: any) =>
    state.quizzesReducer.quizzes.find(
      (q: any) => q._id === qid && q.course === cid
    )
  );

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        <div>
          <button className="btn btn-secondary me-2">Preview</button>
          {isFaculty && (
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`)
              }
            >
              <BsPencilSquare className="me-1" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-8">
          <table className="table">
            <tbody>
              <tr>
                <td width="200">
                  <strong>Quiz Type</strong>
                </td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td>
                  <strong>Points</strong>
                </td>
                <td>{quiz.points}</td>
              </tr>
              <tr>
                <td>
                  <strong>Assignment Group</strong>
                </td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td>
                  <strong>Shuffle Answers</strong>
                </td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Time Limit</strong>
                </td>
                <td>{quiz.timeLimit} Minutes</td>
              </tr>
              <tr>
                <td>
                  <strong>Multiple Attempts</strong>
                </td>
                <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Show Correct Answers</strong>
                </td>
                <td>{quiz.showCorrectAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>
                  <strong>One Question at a Time</strong>
                </td>
                <td>{quiz.oneQuestionAtTime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Webcam Required</strong>
                </td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Lock Questions After Answering</strong>
                </td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Due Date</strong>
                </td>
                <td>{quiz.dueDate}</td>
              </tr>
              <tr>
                <td>
                  <strong>Available From</strong>
                </td>
                <td>{quiz.availableFrom}</td>
              </tr>
              <tr>
                <td>
                  <strong>Available Until</strong>
                </td>
                <td>{quiz.availableUntil}</td>
              </tr>
            </tbody>
          </table>
          {!isFaculty && (
            <button className="btn btn-primary">Start Quiz</button>
          )}
        </div>
      </div>
    </div>
  );
}
