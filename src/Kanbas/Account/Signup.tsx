import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-4">
      <h1>Signup</h1>
      <div className="mt-4" style={{ maxWidth: "300px" }}>
        <input placeholder="username" className="form-control mb-2" />
        <input
          placeholder="password"
          type="password"
          className="form-control mb-2"
        />

        <Link
          to="/Kanbas/Account/Profile"
          className="btn btn-primary w-100 mb-2"
        >
          Signup
        </Link>
        <Link to="/Kanbas/Account/Signin" className="d-block text-primary">
          Signin
        </Link>
      </div>
    </div>
  );
}
