import Image from "next/image";
import EscudoDollar from "../../../../public/assets/images/escudo-dollar.png";
import { fetchCurrentProject } from "../../../features/Info/createInfoSlice";
import { useSelector } from "react-redux";
import { getActiveApproachIndex } from "@/features/summary/summarySlice";

const TotalCost = () => {
  const infoDetails = useSelector(fetchCurrentProject);
  const activeApproachId = useSelector(getActiveApproachIndex);
  const approachDetail = infoDetails?.resourcePlanning?.find(
    (item: any) => item.approachId === activeApproachId
  );
  return (
    <div className="flex flex-col h-full gap-2 text-sm">
      <div className="total-cost-container justify-center">
        <div className="my-3 text-white text-center flex flex-col">
          <p className=" text-lg p-4">Total Cost</p>
          <button className="bg-white flex rounded px-3">
            <div className="p-1">
              <Image src={EscudoDollar} width={30} height={30} alt="" />
            </div>
            <div className="text-[#000000] font-bold text-lg px-3 py-2">{(approachDetail?.totalCost || 0).toLocaleString('en-IN')}</div>
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="bg-[#2B205FE5] text-white  basis-[60%] rounded-md flex flex-col">
          <div className="flex justify-evenly w-[90%] mx-auto ">
            <div className="p-2">Total Discount</div>
            <div className="p-2 text-[#FFF96D]">{(infoDetails.totalDiscount || 0)?.toLocaleString('en-IN')}%</div>
          </div>
          <div className="flex flex-col w-[60%] text-center mx-auto p-1 border-t-2 border-[#80819999]">
            <div className="">Total Discount Amount</div>
            <div className="text-[#FFF96D]">$ {(approachDetail?.discountAmount || 0)?.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="bg-[#2B205FE5] text-center basis-[40%] rounded-md">
          <div className="flex flex-col w-[90%] text-white text-center mx-auto p-1 border-t-2 border-[#80819999]">
            <div className="p-2">Total<br/>Other Costs</div>
            <div className="text-[#FFF96D] p-1">$ {(infoDetails.totalOtherCost || 0)?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default TotalCost;
