import React, { useState } from "react";

export default function BooleanStateVariables() {
  const [done, setDone] = useState(true); // Initialize done as true

  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>{" "}
      {/* Displays "Done" or "Not done" based on state */}
      <label className="form-control">
        <input
          type="checkbox"
          checked={done} // Bind checkbox checked state to done
          onChange={() => setDone(!done)} // Toggle done state on change
        />
        Done
      </label>
      {done && <div className="alert alert-success">Yay! You are done</div>}
      <hr />
    </div>
  );
}
