import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Text,
} from "recharts";
import { useSelector } from "react-redux";
import { getActiveApproachIndex } from "../../features/summary/summarySlice";
import { fetchCurrentProject } from "../../features/Info/createInfoSlice";
import { calulateTotalDurationBasedOnDurationType } from "../../helper/utility/common";
import {
  weekDifference,
  calculateMonthDifference,
} from "../../helper/utility/dateFunctions";
import Image from "next/image";
import { MonthOrWeek } from "@/helper/enums/statusEnums";
import moneyBag from "../../../public/assets/card-icon/money-bag.png";
import PlanningImg from "../../../public/assets/card-icon/planning.png";
import MeetingImg from "../../../public/assets/card-icon/meeting.png";
import NextImg from "../../../public/assets/images/next 2.png";
import InfoTooltip from "../../../public/assets/images/info-tooltip.png";
import { getAllRegions, getAllRoles } from "@/features/resource/resourcePlanningSlice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: any;
  cy: any;
  midAngle: any;
  innerRadius: any;
  outerRadius: any;
  percent: any;
  index: any;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      fontSize={8}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Text
        x={cx}
        y={cy}
        dy={10}
        textAnchor="middle"
        fill={fill}
        fontSize={8}
        width={80}
      >
        {`Total Cost \n \n vs \n \n Resource`}
      </Text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const getPhaseWiseTotalHours = (timeRanges: any, durationType: string) => {
  let totalCost = 0;
  timeRanges.forEach(
    ({
      hourPerDuration,
      start,
      end,
    }: {
      hourPerDuration: any;
      start: any;
      end: any;
    }) => {
      const td =
        durationType === MonthOrWeek.WEEKLY
          ? weekDifference(start, end) + 1
          : calculateMonthDifference(start, end) + 1;
      totalCost += td * hourPerDuration;
    }
  );
  const value = totalCost % 1 != 0 ? totalCost.toFixed(2) : totalCost
  return value || 0;
};

const TabContent = ({
  name = "Discover",
  type,
}: {
  name: string;
  type?: string;
}) => {
  const [showTableView, setShowTableView] = useState(false);

  const onClicTableViewkHandler = () => {
    setShowTableView(!showTableView);
  };
  const allRoles = useSelector(getAllRoles)
  const allRegion = useSelector(getAllRegions)

  function getRole(index: number) {
    const obj = Array.isArray(allRoles) && allRoles?.find((role :any) => index == role.id)    
    return obj?.name
  }

  function getRegion(index: number) {
    const obj = Array.isArray(allRegion) && allRegion?.find((region :any) => index == region.id)    
    return obj?.name
  }

  const { resourcePlanning = [] } = useSelector(fetchCurrentProject);

  const activeApproachIndex = useSelector(getActiveApproachIndex);

  const approach = resourcePlanning.find((approach:any)=> approach.approachId == activeApproachIndex)

  const {
    resourceCount,
    totalCost,
    totalDuration,
    roles,
    chartList,
    durationType = MonthOrWeek.WEEKLY,
  } = useMemo(() => {
    let totalCost = 0;
    let resourceCount = 0;
    let totalDuration = 0;
    let roles: any = [];
    let chartList: any = [];
    if (type === "project") {
      const { build, conceive, discover } = approach || {};
      if (build || conceive || discover) {
        totalCost =
          build?.totalCost + conceive?.totalCost + discover?.totalCost;
        totalDuration =
          calulateTotalDurationBasedOnDurationType(
            build?.totalDuration,
            build?.durationType
          ) +
          calulateTotalDurationBasedOnDurationType(
            conceive?.totalDuration,
            conceive?.durationType
          ) +
          calulateTotalDurationBasedOnDurationType(
            discover?.totalDuration,
            discover?.durationType
          );

        const buildRoles = build?.roles.map((item: any) => ({
          ...item,
          role: item.roleLookupId,
          region: item.regionId,
          durationType: build?.durationType,
          roleTotalTime: calulateTotalDurationBasedOnDurationType(
            item.roleTotalTime,
            build?.durationType
          ),
        }));
        const conceiveRoles = conceive?.roles.map((item: any) => ({
          ...item,
          role: item.roleLookupId,
          region: item.regionId,
          durationType: conceive?.durationType,
          roleTotalTime: calulateTotalDurationBasedOnDurationType(
            item.roleTotalTime,
            conceive?.durationType
          ),
        }));
        const discoverRoles = discover?.roles.map((item: any) => ({
          ...item,
          role: item.roleLookupId,
          region: item.regionId,
          durationType: discover?.durationType,
          roleTotalTime: calulateTotalDurationBasedOnDurationType(
            item.roleTotalTime,
            discover?.durationType
          ),
        }));

        roles = Object.values(
          [...buildRoles, ...conceiveRoles, ...discoverRoles].reduce(
            (acc, { role = null, region = null, ...rest }) => {
              const totalHours = getPhaseWiseTotalHours(
                rest.timeRanges,
                rest.durationType
              );
              if (acc[`${role}_${region}`]) {
                acc[`${role}_${region}`].roleTotalCost += rest.roleTotalCost;
                acc[`${role}_${region}`].roleTotalTime += rest.roleTotalTime;
                acc[`${role}_${region}`].totalHours += totalHours;
              } else {
                acc[`${role}_${region}`] = {
                  ...rest,
                  role,
                  region,
                  totalHours,
                };
              }
              return acc;
            },
            {}
          )
        );

        chartList = Object.values(
          [...buildRoles, ...conceiveRoles, ...discoverRoles].reduce(
            (acc, { role = null, region = null, ...rest }) => {
              if (acc[role]) {
                acc[role].roleTotalCost += rest.roleTotalCost;
                acc[role].roleTotalTime += rest.roleTotalTime;
              } else {
                acc[role] = { ...rest, role, region };
              }
              return acc;
            },
            {}
          )
        );
        resourceCount = chartList.length;
      }
    }
    return type && type !== "project" && approach
      ? approach[type]
      : { resourceCount, totalCost, totalDuration, roles, chartList };
  }, [activeApproachIndex, resourcePlanning, type]);

  const columns: Column[] = [
    { 
      id: "roleLookupId", 
      label: "Role", 
      minWidth: 30, 
      render: (_, value) => getRole(value),
    },
    {
      id: "costPerHour",
      label: "Hours",
      minWidth: 20,
      render: (
        {
          timeRanges,
          durationType: durationTypeForProject,
          totalHours,
          ...props
        },
        value
      ) => {
        const totalHoursFrom =
          totalHours ||
          getPhaseWiseTotalHours(
            timeRanges,
            durationTypeForProject || durationType
          );
        return totalHoursFrom || 0;
      },
    },
    {
      id: "regionId",
      label: "Region",
      minWidth: 20,
      render: (_, value) => getRegion(value),
    },
    {
      id: "roleTotalCost",
      label: "Cost",
      minWidth: 20,
      align: "right",
      render: (_, value) => `$ ${(value || 0)?.toFixed(2)}`,
    },
    {
      id: "roleTotalTime",
      label: durationType === MonthOrWeek.WEEKLY ? "Weeks" : "Months",
      minWidth: 20,
      align: "right",
      render: (_, value) => Number(value || 0),
    },
  ];
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="sm:col-span-12">
        <div className="ml-16 bg-white w-[700px] mt-8 p-2 rounded-lg">
          <div className="grid grid-cols-12 gap-2 w-[750px]">
            <div className="col-span-2 ">
              <div className="flex flex-col justify-center h-[130px]">
                <p className="text-xs">
                  Information related to the{" "}
                  {type === "project" ? "Project" : "Phase"}
                </p>
                <p className="text-sm">{name}</p>
              </div>
            </div>
            <div className="col-span-10">
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <div className="flex flex-col items-center justify-center  w-[80%] h-[90%] rounded-2xl bg-[#0984E380]">
                    <Image src={moneyBag} alt="" width={35} height={35} />
                    <p className="text-sm  mt-0">COST</p>
                    <p className="text-sm text-white mt-0">
                      $ {totalCost || 0}
                    </p>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col items-center justify-center w-[80%] h-[90%] rounded-2xl bg-[#1DD1A1]">
                    <Image src={PlanningImg} alt="" width={35} height={35} />
                    <p className="text-sm mt-0">
                      {durationType === MonthOrWeek.WEEKLY ? "WEEKS" : "MONTHS"}
                    </p>
                    <p className="text-sm text-white mt-0">
                      {totalDuration || 0}
                    </p>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col items-center justify-center w-[80%] h-[90%] rounded-2xl bg-[#00CEC9]">
                    <Image src={MeetingImg} alt="" width={35} height={35} />
                    <p className="text-sm  mt-0">RESOURCES</p>
                    <p className="text-sm  text-white mt-0">
                      {resourceCount || 0}
                    </p>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col flex-start items-center justify-center w-[80%] h-[90%] rounded-2xl bg-[#3A227D] p-3">
                    <p className="text-sm mt-0">
                      <span className="text-xs text-white">
                        Click here to View Resource Breakdown
                      </span>
                    </p>
                    <button onClick={onClicTableViewkHandler} className="mt-4">
                      <Image src={NextImg} alt="" width={30} height={30} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showTableView && (
        <div className="sm:col-span-12 my-8 mx-16">
          <div className="border border-gray-300 rounded-lg bg-white p-3 shadow-md">
            <div className="grid grid-cols-12">
              <div className="col-span-3 relative">
                <ResponsiveContainer>
                  <PieChart width={180} height={250}>
                    <Pie
                      data={(chartList || roles)?.map((item: any) => ({
                        name: getRole(item.roleLookupId),
                        value: item.roleTotalCost,
                      }))}
                      cx={80}
                      cy={70}
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      activeIndex={0}
                      activeShape={renderActiveShape}
                    >
                      {roles.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          textRendering={`enrty`}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Text />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-0 right-4 group">
                  <Image src={InfoTooltip} width={20} alt="" height={20} />
                  <div className="opacity-0 bg-gray-500 w-[300px] bg-opacity-65 text-xs text-white rounded-md py-2 px-4 absolute z-10 transform -translate-x-1/2 group-hover:opacity-100 group-hover:translate-y-2">
                    This Pie chart contains the Percentage of cost utilized by
                    the Individual resource from total Cost of $ 15K
                  </div>
                </div>
              </div>
              <div className="col-span-9 resource-table-container">
                <div className="flex justify-between">
                  <div className="resource-table">
                    <p>Resource Breakdown</p>
                  </div>
                  <div className="resource-table">
                    <p>{roles.length}</p>
                    <p>Records</p>
                  </div>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-200">
                      {columns.map((columnname: Column, index: number) => (
                        <th
                          key={index}
                          className="py-2 px-4 text-xs bg-blue-200 text-black"
                        >
                          {columnname.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length > 0 ? (
                      roles.map((data: any) => {
                        return (
                          <tr className={`text-center ${data.isFractionalAllocation ? "bg-gradient-to-r from-[#EC6A0C70] to-[#EC6A0C10]": "bg-[#b9e5e8a1]"}`}>
                            <td>{getRole(data.roleLookupId)}</td>
                            <td>{getPhaseWiseTotalHours(data.timeRanges, durationType)}</td>
                            <td>{getRegion(data.regionId)}</td>
                            <td>{data.roleTotalCost}</td>
                            <td>{data.roleTotalTime}</td>
                          </tr>
                        );
                      })
                      ) : (
                        <tr className="bg-[#b9e5e8a1]">
                          <td colSpan={5} className="text-center">No Data</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabContent;
