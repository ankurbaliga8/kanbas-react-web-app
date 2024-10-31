import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router";
import React, { useState } from "react";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div className="wd-modules">
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={() => {
            dispatch(addModule({ name: moduleName, course: cid }));
            setModuleName("");
          }}
        />
      )}
      <ul id="wd-modules" className="list-group rounded-0">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <li
              key={module._id}
              className="wd-module list-group-item p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  {!module.editing && module.name}
                  {module.editing && (
                    <input
                      className="form-control d-inline-block flex-grow-1"
                      style={{ minWidth: "300px", maxWidth: "100%" }}
                      onChange={(e) =>
                        dispatch(
                          updateModule({ ...module, name: e.target.value })
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          dispatch(updateModule({ ...module, editing: false }));
                        }
                      }}
                      defaultValue={module.name}
                    />
                  )}
                </div>
                {isFaculty && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={(moduleId) => {
                      dispatch(deleteModule(moduleId));
                    }}
                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                  />
                )}
              </div>
              {module.lessons && (
                <ul className="wd-lessons list-group rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <li
                      key={lesson._id}
                      className="wd-lesson list-group-item p-3 ps-1 d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <BsGripVertical className="me-2 fs-3" />
                        {lesson.name}
                      </div>
                      {isFaculty && <LessonControlButtons />}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
