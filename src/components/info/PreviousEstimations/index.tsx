import NextIcon from "@/assets/icons/NextIcon";
import {
  fetchCurrentProject,
  fetchPreviousEstimation,
  getPreviousEstimation,
  getProjectById,
} from "@/features/Info/createInfoSlice";
import { AppDispatch } from "@/features/store";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const PreviousEstimations = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const [showTooltip, setShowTooltip] = useState(false);
  const previousEst = useSelector(fetchPreviousEstimation);
  const latestProject = useSelector(fetchCurrentProject);
  const fixeScopeProject = latestProject?.engagementType?.id;

  useEffect(() => {
    dispatch(getPreviousEstimation(1));
  }, []);

  useEffect(() => {
    if (previousEst?.projectId) {
      dispatch(getProjectById(parseInt(previousEst?.projectId)));
    }
  }, [dispatch, previousEst?.projectId]);

  const titles: Array<any> = [
    {
      title: "Project Info",
      link: `/viewInfo?projectId=${previousEst?.projectId}`,
      status: previousEst?.projectInfoStatus,
      disabled: false,
      toolTipContent: ``,
    },
    {
      title: "Effort Estimation",
      link: `wbs?projectId=${previousEst?.projectId}`,
      status: previousEst?.effortEstimationStatus,
      disabled: fixeScopeProject != 2 ? true : false,
      toolTipContent: `Effort Estimation will be enabled for Fixed Scope Projects`,
    },
    {
      title: "Resource Planning",
      link: `resource?projectId=${previousEst?.projectId}`,
      status: previousEst?.resourcePlanningStatus,
      disabled:
        fixeScopeProject == 2
          ? latestProject?.wbsStrategies.length === 0
            ? true
            : false
          : false,
      toolTipContent: `Resource Planning will be enabled once the Effort Estimation is created.`,
    },
  ];

  const [showTooltips, setShowTooltips] = useState(
    Array(titles.length).fill(false)
  );

  const handleTooltipHover = (index: any, hover: any) => {
    setShowTooltips((prevState) => {
      const newState = [...prevState];
      newState[index] = hover;
      return newState;
    });
  };
  return (
    <div className="h-fit w-full mt-2 bg-gradient-to-b from-[#4AB5BC13] to-transparent rounded-2xl p-3 min-w-[500px]">
      <div className="text-[21px] text-[#1B0066] font-[400] pl-1">
        Previous Estimation Status
      </div>
      <div className="text-[12px] text-[#00000063] pl-3">
        Contains the details related to your most recent estimation
      </div>
      <div className="text-[12px] text-[#00000063] pl-3 mt-1">
        And the project shown here is{" "}
        <a href={`/viewInfo?projectId=${previousEst?.projectId}`}>
          <span className="uppercase text-[#2B205F] font-[600]">
            {previousEst?.projectName}
          </span>
        </a>
        , choose{" "}
        <a href={`/viewProjects`} className="uppercase text-[#2B205F] font-[600]">
          view projects
        </a>{" "}
        for complete info
      </div>
      <div className="grid grid-cols-3 gap-8 mx-4 mt-2">
        {titles.map((title, index) => (
          <div
            className="col-span-1"
            data-tooltip-target="tooltip-default"
            onMouseEnter={() => handleTooltipHover(index, true)}
            onMouseLeave={() => handleTooltipHover(index, false)}
          >
            <div className="bg-gradient-to-b from-[#8A79F3] to-[#9AA2EA90] text-[#FFF] uppercase h-[110px] text-center px-8 
                flex justify-center items-center rounded-tl-2xl rounded-tr-2xl">
              <div className="text-[15px]">{title?.title}</div>
            </div>
            <div className="grid grid-cols-12 h-10">
              <div className="col-span-8 border border-[#8A79F3] rounded-bl-2xl flex justify-center items-center bg-white"
              >
                <div className="relative inline-block">
                  <div className="text-xs uppercase text-center p-1">
                    {title?.status}
                  </div>
                  {showTooltips[index] && title?.disabled && (
                    <div
                      id="tooltip-default"
                      role="tooltip"
                      className="absolute z-10 inline-block px-3 py-2 text-sm font-medium top-full
                        text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 tooltip dark:bg-gray-700"
                    >
                      {title?.toolTipContent}
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-4 border border-[#8A79F3] rounded-br-2xl flex justify-center items-center bg-white">
                <a
                  style={{
                    pointerEvents: title?.disabled ? "none" : "auto",
                  }}
                  href={title?.link}
                >
                  <div className="bg-[#400040] p-1 rounded-full">
                    <NextIcon color="white" className="h-5" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default PreviousEstimations;
