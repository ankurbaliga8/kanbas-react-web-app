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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-secondary me-2">Preview</button>
        {isFaculty && (
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit/details`)
            }
          >
            <BsPencilSquare className="me-2" />
            Edit
          </button>
        )}
      </div>

      <h2 className="mb-3">{quiz.title}</h2>
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
                <td>{quiz?.points || 0} pts</td>
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
                <td>{quiz?.multipleAttempts ? "Yes" : "No"}</td>
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

          {!isFaculty && (
            <button className="btn btn-primary mt-3">Start Quiz</button>
          )}
        </div>
      </div>
    </div>
  );
}
