import { FaPlus } from "react-icons/fa";
import { RiProhibitedLine } from "react-icons/ri";
import GreenCheckmark from "./GreenCheckmark";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
}) {
  return (
    <div
      id="wd-modules-controls"
      className="d-flex justify-content-end align-items-center gap-2"
    >
      <button id="wd-collapse-all" className="btn btn-sm btn-secondary">
        Collapse All
      </button>
      <button id="wd-view-progress" className="btn btn-sm btn-secondary">
        View Progress
      </button>
      <div className="dropdown">
        <button
          id="wd-publish-all-btn"
          className="btn btn-sm btn-secondary dropdown-toggle d-flex align-items-center"
          type="button"
          data-bs-toggle="dropdown"
        >
          <GreenCheckmark />
          Publish All
        </button>
        <ul className="dropdown-menu">
          <li>
            <a
              id="wd-publish-all-modules-and-items-btn"
              className="dropdown-item"
              href="#"
            >
              <GreenCheckmark />
              Publish all modules and items
            </a>
          </li>
          <li>
            <a
              id="wd-publish-modules-only-button"
              className="dropdown-item"
              href="#"
            >
              <GreenCheckmark />
              Publish modules only
            </a>
          </li>
          <li>
            <a
              id="wd-unpublish-all-modules-and-items-btn"
              className="dropdown-item"
              href="#"
            >
              <RiProhibitedLine className="text-danger me-2" /> Unpublish all
              modules and items
            </a>
          </li>
          <li>
            <a
              id="wd-unpublish-modules-only-btn"
              className="dropdown-item"
              href="#"
            >
              <RiProhibitedLine className="text-danger me-2" /> Unpublish
              modules only
            </a>
          </li>
        </ul>
      </div>

      <button
        id="wd-add-module-btn"
        className="btn btn-sm btn-danger d-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#wd-add-module-dialog"
      >
        <FaPlus className="me-2" />
        Module
      </button>
      <ModuleEditor
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}
