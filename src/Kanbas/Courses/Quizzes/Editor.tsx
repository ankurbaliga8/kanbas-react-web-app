import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz, updateQuiz } from "./reducer";
import { createQuizForCourse, updateQuizAPI } from "./client";
import Details from "./Details";
import Questions from "./Questions";

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
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details");

  const quizToEdit = useSelector((state: any) =>
    state.quizzesReducer.quizzes.find(
      (quiz: any) => quiz._id === qid && quiz.course === cid
    )
  );

  const [quiz, setQuiz] = useState<QuizState>({
    _id: qid || "",
    title: "",
    course: cid || "",
    description: "",
    points: 0,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    quizType: "GRADED_QUIZ",
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    showCorrectAnswers: true,
    accessCode: "",
    oneQuestionAtTime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    published: false,
  });

  useEffect(() => {
    if (quizToEdit) {
      setQuiz(quizToEdit);
    }
  }, [quizToEdit]);

  const handleSave = async (andPublish: boolean = false) => {
    try {
      console.log("Before update - Quiz state:", quiz);
      console.log("Attempting to publish:", andPublish);

      if (qid === "new") {
        const newQuiz = await createQuizForCourse(cid!, {
          ...quiz,
          published: andPublish,
        });
        console.log("Created new quiz:", newQuiz);
        dispatch(addQuiz(newQuiz));
      } else {
        const updatedQuiz = await updateQuizAPI(quiz._id, {
          ...quiz,
          published: andPublish,
        });
        console.log("Updated existing quiz:", updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));
      }
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2>{qid === "new" ? "New Quiz" : "Edit Quiz"}</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </li>
      </ul>

      {activeTab === "details" ? (
        <Details quiz={quiz} setQuiz={setQuiz} />
      ) : (
        <Questions quiz={quiz} setQuiz={setQuiz} />
      )}

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
