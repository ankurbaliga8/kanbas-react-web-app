import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PeopleTable from "../Courses/People/Table";
import * as client from "./client";
import { FaPlus } from "react-icons/fa6";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const { uid } = useParams();
  const [name, setName] = useState("");

  // Fetch all users from the server
  const fetchUsers = async () => {
    try {
      const users = await client.findAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users by name
  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  // Filter users by role
  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  // Create a new user with default values
  const createUser = async () => {
    try {
      const newUser = {
        firstName: "New",
        lastName: `User${users.length + 1}`,
        username: `newuser${Date.now()}`,
        password: "password123",
        email: `email${users.length + 1}@neu.edu`,
        section: "S101",
        role: "STUDENT",
      };
      const user = await client.createUser(newUser); // Create user in the database
      setUsers([...users, user]); // Add the new user to the local state
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, [uid]);

  return (
    <div>
      <h3>Users</h3>

      {/* Input for filtering users by name */}
      <input
        value={name}
        onChange={(e) => filterUsersByName(e.target.value)}
        placeholder="Search People"
        className="form-control float-start w-25 me-2 wd-filter-by-name"
      />

      {/* Dropdown for filtering users by role */}
      <select
        value={role}
        onChange={(e) => filterUsersByRole(e.target.value)}
        className="form-select float-start w-25 wd-select-role"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select>

      {/* Button to add a new user */}
      <button
        onClick={createUser}
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Add People
      </button>

      {/* Table displaying users */}
      <PeopleTable users={users} />
    </div>
  );
}
