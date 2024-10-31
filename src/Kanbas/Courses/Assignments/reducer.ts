import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import assignmentsData from "../../Database/assignments.json";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  availableFrom: string;
  availableUntil: string;
  dueDate: string;
  points: number;
  description: string;
  submissionType: string;
  assignmentGroup: string;
  onlineEntryOptions?: string[];
}

interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: assignmentsData,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      const newAssignment = {
        ...action.payload,
        _id: action.payload._id || new Date().getTime().toString(),
        onlineEntryOptions: action.payload.onlineEntryOptions || [],
      };
      state.assignments.push(newAssignment);
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment._id !== action.payload
      );
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments = state.assignments.map((assignment) =>
        assignment._id === action.payload._id
          ? { ...assignment, ...action.payload }
          : assignment
      );
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
