import { useEffect, useState } from "react";
import PhaseComponent from "./Phase";
import ProjectComponent from "./Project";
import SummaryDashboard from "./summary-dashboard";
import Image from "next/image";
import InfoTooltip from "../../../public/assets/images/info-tooltip.png";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { fetchRegions, fetchRoles } from "@/features/resource/resourcePlanningSlice";

const SummaryComponent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isPhase, setIsPhase] = useState("Phase");

  useEffect(() => {
    dispatch(fetchRoles())
    dispatch(fetchRegions())
  }, [])

  const onChangeHandler = (value: string) => {
    setIsPhase(value);
  };

  return (
    <div className="summary-container">
      <div className="mb-2 mt-3">
        <SummaryDashboard />
      </div>
      <div className="flex justify-center summary-btn-group relative">
        <div className="flex gap-3 bg-[#d2e6f9] shadow-lg p-[5px]  rounded-xl">
          <button className={`flex-grow  p-2 bg-transparent text-black text-sm capitalize focus:outline-none 
            ${isPhase === "Phase" && "!bg-[#01105f] p-3 px-4 text-sm rounded-xl text-white"}`}
            onClick={() => onChangeHandler("Phase")}>
            Phase
          </button>
          <button className={`flex-grow  p-2 bg-transparent text-black text-sm capitalize focus:outline-none 
            ${isPhase === "Project" &&  "!bg-[#01105f] p-3 px-4 text-sm rounded-xl text-white"}`}
            onClick={() => onChangeHandler("Project")}>
            Project
          </button>
        </div>

        <div className="info-tooltip">
            <div className="group">
              <Image src={InfoTooltip} width={20} alt="" height={20} />
              <div className="opacity-0 bg-gray-500 bg-opacity-65 text-xs text-white rounded-md py-2 px-4 absolute z-10 transform -translate-x-1/2 group-hover:opacity-100 group-hover:translate-y-2">
                Enable the toggle to view the data based on phase split-up or for complete project
              </div>
            </div>
        </div>
      </div>
      {isPhase === "Phase" ? <PhaseComponent /> : <ProjectComponent />}
    </div>
  );
};

export default SummaryComponent;
