import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link
        to="/Kanbas/Account/Signin"
        id="wd-account-signin-link"
        className={`list-group-item ${
          isActive("/Signin") ? "active" : "text-danger"
        } border border-0`}
      >
        Signin
      </Link>
      <Link
        to="/Kanbas/Account/Signup"
        id="wd-account-signup-link"
        className={`list-group-item ${
          isActive("/Signup") ? "active" : "text-danger"
        } border border-0`}
      >
        Signup
      </Link>
      <Link
        to="/Kanbas/Account/Profile"
        id="wd-account-profile-link"
        className={`list-group-item ${
          isActive("/Profile") ? "active" : "text-danger"
        } border border-0`}
      >
        Profile
      </Link>
    </div>
  );
}
