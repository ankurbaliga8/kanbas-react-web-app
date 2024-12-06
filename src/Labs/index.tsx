import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab3 from "./Lab3";
import Lab2 from "./Lab2";
import Lab4 from "./Lab4";
import Lab5 from "./Lab5";
import store from "./store";
import { Provider } from "react-redux";
export default function Labs() {
  return (
    <Provider store={store}>
      <div id="wd-labs">
        <h1>Labs</h1>
        <h2>Team Cursors</h2>
        <p>
          <strong>Mangalpady Ankur Baliga (Section 1)</strong>
        </p>
        <p>
          <strong>Sayantan Datta (Section 1)</strong>
        </p>
        <a
          id="wd-github"
          href="https://github.com/ankurbaliga8/kanbas-react-web-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          My GitHub Repository
        </a>

        <TOC />

        <Routes>
          <Route path="/" element={<Navigate to="Lab1" />} />
          <Route path="Lab1" element={<Lab1 />} />
          <Route path="Lab2" element={<Lab2 />} />
          <Route path="Lab3/*" element={<Lab3 />} />
          <Route path="Lab4" element={<Lab4 />} />
          <Route path="Lab5" element={<Lab5 />} />
        </Routes>
      </div>
    </Provider>
  );
}
