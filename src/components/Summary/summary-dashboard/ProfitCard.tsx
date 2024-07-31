import Image from "next/image";
import EscudoDollar from "../../../../public/assets/images/escudo-dollar.png";
import FinancialProfit from "../../../../public/assets/images/financial-profit.png";
import FinancialLoss from "../../../../public/assets/images/decrease.png";
import { fetchCurrentProject } from "@/features/Info/createInfoSlice";
import { useSelector } from "react-redux";
import { getActiveApproachIndex } from "@/features/summary/summarySlice";

const ProfitCard = () => {
  const infoDetails = useSelector(fetchCurrentProject);
  const activeApproachId = useSelector(getActiveApproachIndex);
  const approachDetail = infoDetails?.resourcePlanning?.find(
    (item: any) => item.approachId === activeApproachId
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="total-cost">
          <div className="flex flex-col items-center p-5">
            <p className="mb-1">Proposed Cost</p>
            <div className="price">
              <Image src={EscudoDollar} width={20} height={20} alt="" />
              <p>
                {(approachDetail?.proposedCost || 0)?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
      </div>
        <div className="total-cost">
          <div className="flex flex-col items-center p-5">
            <p className="mb-1">Total CTC Cost</p>
            <div className="price">
              <Image src={EscudoDollar} width={20} height={20} alt="" />
              <p>
                {(approachDetail?.totalCtcCost || 0)?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="profit-margin-container col-span-2 border-2 border-[#8081994D] rounded-md mt-5">
          <div className="m-1 p-3">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="pl-3">
                    {approachDetail?.marginCost < 0 ? (
                      <Image src={FinancialLoss} width={50} height={50} alt=""/>
                    ) : (
                      <Image src={FinancialProfit} width={50} height={50} alt=""/>
                    )}
                  </td>
                  <td className="text-center">
                    <p className="text-[#1B0066] font-medium text-lg">
                      {approachDetail?.marginCost < 0 ? "Loss" : "Profit"}{" "}
                      Margin
                    </p>
                    <p className="text-xs text-gray-600 flex justify-around items-center w-full">
                      <span>
                        {approachDetail?.marginCost < 0 ? "Loss" : "Profit"}{" "}
                        Cost
                      </span>
                      <span>
                        $
                        {Math.abs(
                          approachDetail?.marginCost || 0
                        )?.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </td>
                  <td>
                    <div className="price-percentage">
                      <p>
                        {approachDetail?.marginCost < 0 ? "-" : "+"}
                        {(approachDetail?.marginPercentage || 0).toFixed(2)}%
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};
export default ProfitCard;
