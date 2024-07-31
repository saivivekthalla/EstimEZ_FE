import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrentProject,
  getProjectById, fetchPractices, fetchProjectType, fetchEngagementType, fetchVertical
} from "../../../features/Info/createInfoSlice";
import { AppDispatch } from "@/features/store";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ProjectInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: any = searchParams.get("projectId");
  const practiceList = useSelector(fetchPractices);
  const projectTypeList = useSelector(fetchProjectType)
  const engagementTypes = useSelector(fetchEngagementType);
  const verticals = useSelector(fetchVertical);


  useEffect(() => {
    dispatch(getProjectById(projectId));
  }, []);
  const infoDetails = useSelector(fetchCurrentProject);
  const infoList = [
    { value: infoDetails?.clientName, name: "Account" },
    { value: infoDetails?.pursuitLead, name: "Pursuit Lead" },
    { value: verticals.find((item: { id: any; }) => item.id === infoDetails?.verticalId)?.name, name: "Vertical" },
    {
      value: infoDetails?.projectTypeIds.map((id: any) => (projectTypeList.find((item: { id: any; }) => item.id === id)?.name || "")).join(", "),
      name: "Pursuit Type",
    },
    { value: infoDetails?.estimationOwner, name: "Estimation Owner" },
    { value: engagementTypes.find((item: { id: any; }) => item.id === infoDetails?.engagementTypeId)?.name, name: "Engagement Type" },
    { value: infoDetails?.opportunityId, name: "Opportunity ID" },
    { value: infoDetails?.opportunityLink, name: "Opportunity Link" },
    {
      value: infoDetails?.practiceIds.map((id: any) => (practiceList.find((item: { id: any; }) => item.id === id)?.name)).join(", "),
      name: "Practices",
    },
  ];
  //should be changed

  const rlApproach = infoDetails?.resourcePlanning?.find(
    (item: any) =>
      item.approachId ===
      infoDetails?.projectFinalizedRecord?.selectedApproach?.approachId
  );

  const wbsApproach = infoDetails?.wbsStrategies?.find(
    (item: any) => item.id === rlApproach?.wbs_strategy_id
  );

  const dealDeskInfoList = [
    {
      value: infoDetails?.projectFinalizedRecord?.selectedApproach?.spr + " %",
      name: "SPR",
    },
    wbsApproach && { value: wbsApproach?.strategyName, name: "WBS Strategy" },
    { value: rlApproach?.approachName, name: "RL Approach" },
    { value: "$ " + infoDetails?.totalOtherCost, name: "Other Costs" },
    { value: infoDetails?.totalDiscount + "%", name: "Discount" },
    {
      value:
        infoDetails?.projectFinalizedRecord?.selectedApproach?.totalDuration +
        " days",
      name: "Total Duration",
    },
    {
      value:
        "$ " + infoDetails?.projectFinalizedRecord?.selectedApproach?.totalCost,
      name: "Total Cost",
    },
  ].filter(Boolean);

  return (
    <div className="project-info">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-12">
          <div className="col-span-12 sm:col-span-12">
            <p className="!text-xl !font-bold">
              {infoDetails?.projectName}
            </p>
            <p className="!text-sm">
              {infoDetails?.description}
            </p>
          </div>
          {infoList.map(({ name, value }) => (
            <div className="col-span-6 sm:col-span-16">
              <p>{name}</p>
              <p className="whitespace-pre-line !break-keep">
                {value}
              </p>
            </div>
          ))}
          {dealDeskInfoList.map(({ name, value }) => (
            <div className="col-span-6 sm:col-span-16">
              <div
                className={`border-l-4 pl-2 ${name === "SPR" ? `border-[#7666d1]` : `border-[#BEEE00]`
                  } border-800`}
              >
                <p>{name}</p>
                <p>{value}</p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};
export default ProjectInfo;
