import React from "react";
import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/Kanbas/store";
import Labs from "./Labs";
import Kanbas from "./Kanbas";

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/Kanbas" />} />
          <Route path="/Labs/*" element={<Labs />} />
          <Route path="/Kanbas/*" element={<Kanbas />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
}
