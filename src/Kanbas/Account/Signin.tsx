import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as db from "../Database";
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;

    dispatch(setCurrentUser(user));
    navigate("/Kanbas/Dashboard");
  };

  return (
    <div id="wd-signin-screen" className="p-4">
      <h1>Sign in</h1>
      <div className="mt-4" style={{ maxWidth: "300px" }}>
        <input
          id="wd-username"
          placeholder="username"
          className="form-control mb-2"
          value={credentials.username || ""}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          id="wd-password"
          placeholder="password"
          type="password"
          className="form-control mb-3"
          value={credentials.password || ""}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button
          id="wd-signin-btn"
          onClick={signin}
          className="btn btn-primary w-100 mb-2"
        >
          Sign in
        </button>
        <Link
          id="wd-signup-link"
          to="/Kanbas/Account/Signup"
          className="d-block text-primary"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
