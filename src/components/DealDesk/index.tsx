import ProjectInfo from "./ProjectInfo";
import LineChartComponent from "./LineChart";
import MonthlyInvoice from "./MonthlyInvoice";
import RightRoleTable from "./RRRRAnalysis";
import FractionalAllocation from "./FractionalAllocation";
import RoleRedundancy from "./RoleRedundancy";
import Pyramid from "./Pyramid";
import { useDispatch } from "react-redux";
import { setFinalised } from "@/features/summary/summarySlice";

const DealDeskComponent = () => {
  const dispatch = useDispatch();
  dispatch(setFinalised(true));
  return (
    <div className="flex flex-col p-8 space-y-12 overflow-x-clip">
      <div className=" grid grid-cols-2 grid-rows-1 gap-48 pb-10 relative">
        <div className="summary-container">
          <ProjectInfo />
        </div>
        <div>
          <Pyramid />
        </div>
      </div>
      <div>
        <FractionalAllocation />
      </div>
      <div>
        <RoleRedundancy />
      </div>
      <div>
        <RightRoleTable />
      </div>
      <div>
        <LineChartComponent />
      </div>
      <div>
        <MonthlyInvoice />
      </div>
    </div>
  );
};

export default DealDeskComponent;
