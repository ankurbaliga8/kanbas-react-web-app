import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

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
