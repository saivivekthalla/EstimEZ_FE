import { useSelector } from "react-redux";
import { fetchCurrentProject,fetchPractices,fetchVertical } from "../../../features/Info/createInfoSlice";

const ProjectInfo = () => {
  const infoDetails = useSelector(fetchCurrentProject);
  const practiceList = useSelector(fetchPractices);
  const verticals = useSelector(fetchVertical)

  return (
    <div className="project-info">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="col-span-12 sm:col-span-12">
            <p>{infoDetails?.projectName}</p>
            <p>Managing user data efficiently</p>
          </div>
          <div className="col-span-6 sm:col-span-6">
            <p>{infoDetails?.clientName}</p>
            <p>Maximus</p>
          </div>
          <div className="col-span-6 sm:col-span-6">
            <p>Pursuit Lead</p>
            <p>{infoDetails?.pursuitLead}</p>
          </div>
          <div className="col-span-12 sm:col-span-12">
            <p>Vertical</p>
            <p>{verticals.find((item: { id: any; }) => item.id === infoDetails?.verticalId)?.name}</p>
          </div>
          <div className="col-span-12 sm:col-span-12">
            <p>Estimation Owner</p>
            <p>{infoDetails?.estimationOwner}</p>
          </div>
          <div className="col-span-12 sm:col-span-12">
            <p>Practice</p>
            <p>
              {infoDetails?.practiceIds?.map((id: any) => practiceList.find((item: { id: any }) => item.id === id)?.name).filter((name: any) => name) .join(", ")}
            </p>
          </div>
        </div>
    </div>
  );
};
export default ProjectInfo;
