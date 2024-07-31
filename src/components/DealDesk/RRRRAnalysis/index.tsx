import ProgressBar from "./ProgressBar";
import "../../../styles/dealDesk.scss";
import Image from "next/image";
import lineChart from "../../../../public/assets/svg/linechart.svg";
import { fetchRRRRAnalysisData, getRRRRAnalysis } from "@/features/dealDesk/linechartSlice";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/features/store";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const RightRoleTable = () => {

  const dispatch = useDispatch<AppDispatch>();
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: string | null = searchParams.get('projectId');
  const rrrrData = useSelector(fetchRRRRAnalysisData);

  useEffect(() => {
    dispatch(getRRRRAnalysis(projectId));
  }, []);

  const maxCosts = rrrrData.map((item: any) => {
    const maxCost = Math.max(item.standardCost, item.customCost);
    return maxCost;
  });

  const overallMaxCost = Math.max(...maxCosts);

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-[100%]">
          <div className="text-2xl flex flex-row font-bold justify-between">
            <div>RRRR Analysis</div>
            <div>{rrrrData?.length} Records</div>
          </div>
        </div>

        <div className="relative bg-border-spacing-5 rounded-t-3xl rounded-b-3xl 
            bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00cec91a] 
            to-[#00cec940] h-72 w-full">
          <Image
            src={lineChart}
            alt="image"
            height={180}
            width={180}
            className="absolute bottom-0"
          ></Image>
          <table
            className="bg-border-spacing-5 rounded-t-3xl rounded-b-3xl 
             w-full text-sm absolute"
          >
            <thead className="flex w-full">
              <tr className="flex w-full text-white mb-3 drop-shadow-[0_0.5rem_0.2rem_rgba(0,0,0,0.2)]">
                <th className="p-4 drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#028481] relative z-50 rounded-l-full w-[25%]">
                  Roles
                </th>
                <th className="p-4 drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#12A19E] relative z-40 w-[15%]">
                  Phase
                </th>
                <th className="p-4 drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#3CADAA] relative z-30 w-[10%]">
                  Region
                </th>
                <th className="p-4 drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#3cadaad6] relative z-20 w-[10%]">
                  SPR
                </th>
                <th className="p-4 drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#6BC3C2] relative z-10 w-[10%]">
                  Cost/Hr
                </th>
                <th className="p-4 bg-[#76BDBB] rounded-r-full w-[30%] text-xs">
                  <div className="grid grid-cols-2 mb-3">
                    <div className="col-span-1 h-3 w-3 rounded-full bg-black">
                      <div className="ml-4 ">Standard Cost</div>{" "}
                    </div>
                    <div className="col-span-1 h-3 w-3 rounded-full bg-[#00CEC9] border-solid border border-black ">
                      <div className="ml-4 ">Calculated Cost</div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-center flex flex-col items-center justify-between w-full p-3">
              <div className="overflow-y-auto w-full h-48">
                {rrrrData?.length > 0 ? (
                  rrrrData?.map((item: any) => (
                    <tr className="w-fit">
                      <td className="w-[27rem] text-left pl-2">{item.role.name}</td>
                      <td className="w-[11rem] text-left capitalize">{item.phase}</td>
                      <td className="w-[11rem]">{item.region.code}</td>
                      <td className="w-[9rem]">{item.spr}%</td>
                      <td className="w-[9rem]">{item.ratePerHour}</td>
                      <td className="w-[32rem]">
                        <div className="flex justify-center items-center mt-1">
                          <div className="flex flex-col h-9 bg-[#ffffff99] w-3/4 rounded-full pl-2">
                            <div className="mt-1 ml-1">
                              <ProgressBar
                                progress={item.customCost / overallMaxCost * 100}
                                color={"#00CEC9"}
                                amount={item.customCost}
                              ></ProgressBar>
                            </div>
                            <div className="ml-1">
                              <ProgressBar
                                progress={item.standardCost / overallMaxCost * 100}
                                color={"black"}
                                amount={item.standardCost}
                              ></ProgressBar>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-48 flex items-center justify-center">
                    <td className="text-center text-lg font-semibold">
                      No Data Available
                    </td>
                  </tr>
                )}
              </div>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RightRoleTable;
