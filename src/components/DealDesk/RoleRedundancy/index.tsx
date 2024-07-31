import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import circleChart from "../../../../public/assets/images/Conference-Foreground-Selected.svg";
import Image from "next/image";
import {
  fetchRoleredundantData,
  getRoleredundant,
} from "@/features/dealDesk/roleredundancySlice";
import { AppDispatch } from "@/features/store";

const RoleRedundancy: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const roleData = useSelector(fetchRoleredundantData);
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: string | null = searchParams.get("projectId");

  useEffect(() => {
    dispatch(getRoleredundant(projectId));
  }, [])

  const occurrencesValues = roleData.map((item: { count: number }) => item.count);
  const maxOccurrences = Math.max(...occurrencesValues);
  const occurrencesPercentages = occurrencesValues.map((value: number) => (value / maxOccurrences) * 100);
  const tableHeaders = ['Roles', 'Phase', 'Region', 'occurrences', 'frequency'];
  const displayNames: Record<string, string> = {
    Roles: 'Roles',
    Phase: 'Phase',
    Region: 'Region',
    occurrences: 'No of Occurrences',
    frequency: 'Role Frequency',
  };
  const generateClassnames = (header: string) => {
    const padding = 'p-4 pl-5 pr-10';
    const shadow = 'shadow-[inset_4px_0px_3px__#46464640]';

    if (header === 'Roles') {
      return `bg-[#4198D6] rounded-tl-full rounded-bl-full text-left p-4 pl-[4.5%] w-[35%]`;
    } else if (header === 'Phase') {
      return `bg-[#6CAFE0] ${shadow} text-left p-4 pl-[3.5%] w-[12.5%]`;
    } else if (header === 'Region') {
      return `bg-[#97C6E9] ${shadow} ${padding} text-left w-[12.5%]`;
    } else if (header === 'occurrences') {
      return `bg-[#B3D6EF] ${shadow} text-left p-4 w-[20%]`;
    } else if (header === 'frequency') {
      return `bg-[#C2DEF2] rounded-tr-full rounded-br-full ${shadow} text-left p-4 pl-5 pr-5 w-[20%]`;
    } else {
      return "";
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-[100%]">
          <div className="text-2xl flex flex-row font-bold justify-between">
            <div>Role Redundancies</div>
            <div>{roleData.length} Records</div>
          </div>
        </div>
        <div className="w-[100%] bg-border-spacing-5 bg-gradient-radial from-[#4198D610] to-[#4198D650] rounded-t-3xl rounded-b-3xl relative h-68">
          <Image src={circleChart} alt="image" height={220} width={220} className="absolute bottom-0"></Image>
          <table className="bg-border-spacing-5 items-center relative table-fixed text-center rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-3xl m-auto w-[100%] absolute">
            <thead className="w-[100%]">
              <tr className="flex text-white drop-shadow-[0_0.5rem_0.2rem_rgba(0,0,0,0.2)]">
                {tableHeaders.map((header, index) => (
                  <th key={index} className={generateClassnames(header)}>
                    {displayNames[header]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-[100%]">
              {roleData.length > 0 ? (
                <div>
                  <div className="overflow-y-auto m-3 h-48">
                    {roleData.map((item: { role: { name: string }, phase: string, region: { code: string }, count: number }, index: number) => (
                      <tr className="flex justify-spacebetween" key={index}>
                        <td className="text-left pl-[3%] pr-5 pt-3 w-[35%] h-[50px] ">{item.role.name}</td>
                        <td className="text-left pl-[3%] pr-5 pt-3 w-[12.5%] h-[50px] capitalize">{item.phase}</td>
                        <td className="pl-5 pr-5 pt-3 w-[12.5%] h-[50px]">{item.region.code}</td>
                        <td className="pl-5 pr-5 pt-3 w-[20%] h-[50px]">{item.count}</td>
                        <td className="pl-5 pr-5 pt-3 w-[20%] h-[50px]">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`bg-gray-900 h-2 rounded-full`} style={{ width: `${occurrencesPercentages[index]}%` }}></div>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </div>
                </div>
              ) : (
                <tr className="flex justify-center items-center h-48">
                  <td className="text-center font-semibold">No Data Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RoleRedundancy;
