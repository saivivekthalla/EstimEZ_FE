import React from "react";
import ProjectInfo from "./ProjectInfo";
import FinalisedApproach from "./FinaliseApproach"
import ConsolitatedCostDetails from "./ConsolitatedCostDetails";
import TotalCost from "./TotalCost";
import ProfitCard from "./ProfitCard";

const SummaryDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-5">
        <ProjectInfo />
      </div>
      <div className="col-span-7">
        <FinalisedApproach />
      </div>
      <div className="col-span-4">
        <TotalCost />
      </div>
      <div className="col-span-4">
        <ProfitCard />
      </div>
      <div className="col-span-4">
        <ConsolitatedCostDetails />
      </div>
    </div>
  );
};
export default SummaryDashboard;