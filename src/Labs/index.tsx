import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab3 from "./Lab3";
import Lab2 from "./Lab2";
export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <p>Mangalpady Ankur Baliga</p>
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
      </Routes>
    </div>
  );
}
