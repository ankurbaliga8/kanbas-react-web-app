import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz, updateQuiz, setQuizzes } from "./reducer";
import {
  createQuizForCourse,
  updateQuizAPI,
  findQuizzesForCourse,
} from "./client";
import Details from "./Details";
import Questions from "./Questions";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

interface QuizState {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtTime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  published: boolean;
  questions: Array<{
    _id: string;
    title: string;
    points: number;
    questionText: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
    choices?: string[];
    correctChoice?: number;
    correctAnswer?: boolean;
    possibleAnswers?: string[];
  }>;
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Load quizzes when component mounts
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

  const quiz = useSelector((state: any) =>
    state.quizzesReducer.quizzes.find(
      (q: any) => q._id === qid && q.course === cid
    )
  );

  const [editedQuiz, setEditedQuiz] = useState<QuizState | null>(null);

  useEffect(() => {
    if (quiz) {
      setEditedQuiz(quiz);
    }
  }, [quiz]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!editedQuiz && qid !== "new") {
    return <div>Quiz not found</div>;
  }

  // Initialize new quiz if needed
  if (qid === "new" && !editedQuiz) {
    const newQuiz: QuizState = {
      _id: "new",
      title: "New Quiz",
      course: cid!,
      description: "",
      points: 100,
      dueDate: "",
      availableFrom: "",
      availableUntil: "",
      quizType: "GRADED_QUIZ",
      assignmentGroup: "Quizzes",
      shuffleAnswers: false,
      timeLimit: 0,
      multipleAttempts: false,
      showCorrectAnswers: true,
      accessCode: "",
      oneQuestionAtTime: false,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      published: false,
      questions: [],
    };
    setEditedQuiz(newQuiz);
  }

  const handleSave = async (andPublish: boolean = false) => {
    if (!editedQuiz) {
      console.error("No quiz to save");
      return;
    }

    try {
      // Create a deep copy to prevent state mutations
      const quizToSave = JSON.parse(
        JSON.stringify({
          ...editedQuiz,
          points: Number(editedQuiz.points),
          timeLimit: Number(editedQuiz.timeLimit),
          published: andPublish,
          questions: editedQuiz.questions.map((q) => ({
            ...q,
            points: Number(q.points),
          })),
        })
      );

      console.log("Before update - Quiz state:", quizToSave);

      let savedQuiz;
      if (qid === "new") {
        savedQuiz = await createQuizForCourse(cid!, quizToSave);
        dispatch(addQuiz(savedQuiz));
      } else {
        savedQuiz = await updateQuizAPI(editedQuiz._id, quizToSave);
        dispatch(updateQuiz(savedQuiz));
      }

      if (andPublish) {
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
      } else {
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${savedQuiz._id}/view`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{qid === "new" ? "New Quiz" : "Edit Quiz"}</h2>
        <div className="d-flex align-items-center">
          {editedQuiz?.published ? (
            <div className="d-flex align-items-center text-success">
              <FaCheckCircle className="me-2" />
              <span>Published</span>
            </div>
          ) : (
            <div className="d-flex align-items-center text-secondary">
              <MdDoNotDisturbAlt className="me-2" />
              <span>Unpublished</span>
            </div>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              location.pathname.includes("/details") ? "active" : ""
            }`}
            onClick={() => {
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit/details`);
            }}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              location.pathname.includes("/questions") ? "active" : ""
            }`}
            onClick={() => {
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit/questions`);
            }}
          >
            Questions
          </button>
        </li>
      </ul>

      {location.pathname.includes("/details") ? (
        <Details quiz={editedQuiz} setQuiz={setEditedQuiz} />
      ) : location.pathname.includes("/questions") ? (
        <Questions quiz={editedQuiz} setQuiz={setEditedQuiz} />
      ) : null}

      <hr />
      <div className="d-flex justify-content-end gap-2">
        <Link
          to={`/Kanbas/Courses/${cid}/Quizzes`}
          className="btn btn-secondary"
        >
          Cancel
        </Link>
        <button onClick={() => handleSave()} className="btn btn-primary">
          Save
        </button>
        <button onClick={() => handleSave(true)} className="btn btn-success">
          Save & Publish
        </button>
      </div>
    </div>
  );
}
