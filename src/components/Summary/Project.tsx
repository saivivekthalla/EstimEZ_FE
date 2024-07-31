import { useSelector } from "react-redux";
import TabContent from "./TabContent";
import { fetchCurrentProject } from "../../features/Info/createInfoSlice";

const ProjectComponent = () => {
  const { projectName } = useSelector(fetchCurrentProject);
  return (
    <div className="m-5 pt-2 pb-4 px-3 bg-purple-100 bg-opacity-40">
      <TabContent name={projectName} type="project" />
    </div>
  );
};

export default ProjectComponent;
