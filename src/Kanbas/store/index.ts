// src/Kanbas/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "../Courses/Modules/reducer";
import accountReducer from "../Account/reducer";
import assignmentsReducer from "../Courses/Assignment/reducer";

const store = configureStore({
  reducer: {
    modules: modulesReducer,
    account: accountReducer,
    assignments: assignmentsReducer,
  },
});

export default store;
