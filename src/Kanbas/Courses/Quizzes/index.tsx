import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {
  BsPencilSquare,
  BsGripVertical,
  BsThreeDotsVertical,
  BsPlus,
} from "react-icons/bs";
import { RxTriangleDown } from "react-icons/rx";
import { findQuizzesForCourse, updateQuizAPI, deleteQuizAPI } from "./client";
import { setQuizzes, updateQuiz, deleteQuiz } from "./reducer";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export default function Quizzes() {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const isFaculty = currentUser?.role === "FACULTY";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const quizzes = await findQuizzesForCourse(cid!);
        console.log("Loaded quizzes:", quizzes);
        dispatch(setQuizzes(quizzes));
      } catch (error) {
        console.error("Error loading quizzes:", error);
      }
    };
    loadQuizzes();
  }, [cid, dispatch]);

  const filteredQuizzes =
    quizzes?.filter((quiz: any) => {
      if (quiz.course !== cid) return false;

      if (isFaculty) return true; // Faculty sees all quizzes

      return quiz.published;
    }) || [];

  const searchedQuizzes = filteredQuizzes.filter((quiz: any) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuiz = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/new/edit/details`);
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

  const handleDeleteClick = (quizId: string) => {
    setShowDeleteConfirm(quizId);
    setSelectedQuizId(null); // Close the dropdown
  };

  const confirmDelete = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      const quizzes = await findQuizzesForCourse(cid!);
      dispatch(setQuizzes(quizzes));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handlePublishToggle = async (quiz: any) => {
    try {
      const updatedQuiz = await updateQuizAPI(quiz._id, {
        ...quiz,
        published: !quiz.published,
      });
      dispatch(updateQuiz(updatedQuiz));
    } catch (error) {
      console.error("Error toggling publish state:", error);
    }
  };

  const handleQuizClick = (quizId: string) => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/view`);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white border-end-0">
            <FaMagnifyingGlass className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search for Quiz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isFaculty && (
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-danger" onClick={handleAddQuiz}>
              <BsPlus className="me-1" /> Quiz
            </button>
            <button className="btn btn-sm btn-light border">
              <BsThreeDotsVertical />
            </button>
          </div>
        )}
      </div>

      <div className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
        <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <RxTriangleDown className="me-2 fs-4" />
            <span>QUIZZES</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge rounded-pill border border-dark text-muted px-3 py-1">
              {filteredQuizzes.length} Total
            </span>
            <BsPlus className="me-3 fs-4 text-muted" />
            <BsThreeDotsVertical className="text-muted" />
          </div>
        </div>

        <ul className="list-group">
          {searchedQuizzes.map((quiz: any) => (
            <li
              key={quiz._id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ borderLeft: "5px solid green", borderRadius: "0" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleQuizClick(quiz._id)}
              >
                {isFaculty && (
                  <>
                    <BsGripVertical className="me-3 fs-5 text-muted" />
                    <BsPencilSquare className="me-2 fs-5 text-muted" />
                  </>
                )}
                <div>
                  <span className="text-dark fw-bold">{quiz.title}</span>
                  <br />
                  <small className="text-muted">
                    <span
                      className={`${
                        getAvailabilityStatus(quiz) === "Available"
                          ? "text-success"
                          : getAvailabilityStatus(quiz) === "Closed"
                          ? "text-danger"
                          : "text-warning"
                      }`}
                    >
                      {getAvailabilityStatus(quiz)}
                    </span>{" "}
                    | <strong>Due</strong> {quiz.dueDate} | {quiz.points} pts |{" "}
                    {quiz.questions?.length || 0} questions
                  </small>
                </div>
              </div>
              {isFaculty && (
                <div className="d-flex align-items-center">
                  {quiz.published ? (
                    <FaCheckCircle className="text-success me-3" />
                  ) : (
                    <MdDoNotDisturbAlt className="text-secondary me-3" />
                  )}
                  <BsThreeDotsVertical
                    className="text-muted cursor-pointer"
                    onClick={() =>
                      setSelectedQuizId(
                        selectedQuizId === quiz._id ? null : quiz._id
                      )
                    }
                  />
                  {selectedQuizId === quiz._id && (
                    <div
                      className="position-absolute bg-white border rounded shadow-sm"
                      style={{
                        top: "100%",
                        right: 0,
                        zIndex: 1000,
                        minWidth: "150px",
                      }}
                    >
                      <button
                        className="btn btn-link text-start w-100 text-decoration-none"
                        onClick={() =>
                          navigate(
                            `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit/details`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-link text-start w-100 text-decoration-none"
                        onClick={() => handleDeleteClick(quiz._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-link text-start w-100 text-decoration-none"
                        onClick={() => handlePublishToggle(quiz)}
                      >
                        {quiz.published ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {searchedQuizzes.length === 0 && (
          <div className="text-muted text-center mt-3">
            {isFaculty
              ? "No quizzes found. Click + Quiz to add a new quiz."
              : "No quizzes found."}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Quiz</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(null)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete this quiz? This action cannot be
                undone.
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
