import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";

export default function PeopleDetails() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setName(`${user.firstName} ${user.lastName}`);
    setEmail(user.email || "");
    setRole(user.role || "");
  };

  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { ...user, firstName, lastName, email, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    navigate(-1); // Navigate back to PeopleTable
  };

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={() => navigate(-1)}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />

      <div className="text-danger fs-4 wd-name">
        {!editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            onClick={() => saveUser()}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}
        {!editing && (
          <div className="wd-name" onClick={() => setEditing(true)}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {user && editing && (
          <input
            className="form-control w-50 wd-edit-name"
            defaultValue={`${user.firstName} ${user.lastName}`}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>

      <div>
        <b>Email:</b>
        {!editing ? (
          <span className="wd-email"> {user.email || "N/A"} </span>
        ) : (
          <input
            type="email"
            className="form-control w-75"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </div>
      <br />

      <div>
        <b>Role:</b>
        {!editing ? (
          <span className="wd-role"> {user.role || "N/A"} </span>
        ) : (
          <select
            className="form-select w-75"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        )}
      </div>
      <br />

      <div>
        <b>Login ID:</b> <span className="wd-login-id"> {user.loginId} </span>
      </div>
      <br />

      <div>
        <b>Section:</b> <span className="wd-section"> {user.section} </span>
      </div>
      <br />

      <div>
        <b>Total Activity:</b>{" "}
        <span className="wd-total-activity">{user.totalActivity}</span>
      </div>
      <hr />

      <button
        onClick={() => deleteUser(uid!)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary float-start float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}