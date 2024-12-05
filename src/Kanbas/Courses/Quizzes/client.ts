import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

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

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuizAPI = async (quizId: string, quiz: any) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

export const deleteQuizAPI = async (quizId: string) => {
  await axios.delete(`${QUIZZES_API}/${quizId}`);
};

export const addQuestionToQuiz = async (quizId: string, question: any) => {
  const response = await axios.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return response.data;
};

export const updateQuestionInQuiz = async (
  quizId: string,
  questionId: string,
  question: any
) => {
  const response = await axios.put(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`,
    question
  );
  return response.data;
};

export const deleteQuestionFromQuiz = async (
  quizId: string,
  questionId: string
) => {
  await axios.delete(`${QUIZZES_API}/${quizId}/questions/${questionId}`);
};

export const saveQuizAttempt = async (quizId: string, attempt: QuizAttempt) => {
  console.log("Saving attempt:", attempt);
  try {
    const response = await axios.post(
      `${QUIZZES_API}/${quizId}/attempts`,
      attempt
    );
    return response.data;
  } catch (error: any) {
    console.error("Error details:", error.response?.data || error.message);
    throw error;
  }
};

export const getQuizAttempts = async (quizId: string, studentId: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/attempts/${studentId}`
  );
  return response.data;
};
export const getSpecificQuizAttempt = async (
  quizId: string,
  studentId: string,
  attemptNumber: number
) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/attempts/${studentId}/${attemptNumber}`
  );
  return response.data;
};
