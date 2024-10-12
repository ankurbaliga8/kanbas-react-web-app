import { Link, useLocation, useParams } from "react-router-dom";

const links = [
  "Home",
  "Modules",
  "Piazza",
  "Zoom",
  "Assignments",
  "Quizzes",
  "People",
];

export default function CoursesNavigation() {
  const location = useLocation();
  const { cid } = useParams();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link}
          to={`/Kanbas/Courses/${cid}/${link}`}
          id={`wd-course-${link.toLowerCase()}-link`}
          className={`list-group-item ${
            isActive(`/${link}`) ? "active" : "text-danger"
          } border border-0`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
