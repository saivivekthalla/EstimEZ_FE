import React, { useMemo, useState } from "react";
import PriceList from "./PriceList";
import { fetchCurrentProject } from "../../../features/Info/createInfoSlice";
import { useSelector } from "react-redux";
import { getActiveApproachIndex } from "../../../features/summary/summarySlice";
import { weekDifference, calculateMonthDifference } from "../../../helper/utility/dateFunctions";
import { MonthOrWeek } from "@/helper/enums/statusEnums";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      className={`tab-panel ${value !== index ? "hidden" : ""}`}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="px-1">{children}</div>}
    </div>
  );
}

const getPhaseWiseTotalHours = (timeRanges: any, durationType: string, originalCost: number) => {
  let totalCost = 0
  timeRanges.forEach(({ hourPerDuration, start, end } : {hourPerDuration: any, start: any, end: any}) => {
    const td = durationType === MonthOrWeek.WEEKLY ? weekDifference(start, end) + 1 : calculateMonthDifference(start, end) + 1;
    totalCost += td * hourPerDuration * originalCost
  })

  return totalCost || 0;
}

const getCost = (roles: any[], durationType: string) => {
  return roles?.reduce(
    (
      cost: any,
      {
        isCustomCost,
        costPerHour,
        roleTotalCost,
        roleTotalDuration,
        timeRanges,
        originalCost
      }: {
        isCustomCost: boolean;
        costPerHour: number;
        roleTotalCost: number;
        roleTotalDuration: number;
        timeRanges: any;
        originalCost: number
      }
    ) => {
      cost.cCost += isCustomCost ? getPhaseWiseTotalHours(timeRanges, durationType, originalCost) : roleTotalCost;
      cost.sCost += roleTotalCost;
      return cost;
    },
    { sCost: 0, cCost: 0 }
  );
};

const ConsolitatedCostDetails = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { resourcePlanning = [] } = useSelector(fetchCurrentProject);
  const activeApproachIndex = useSelector(getActiveApproachIndex);
  const approach = resourcePlanning.find((approach :any)=> approach.approachId == activeApproachIndex)
  const { discoverTotalCost, conceiveTotalCost, buildTotalCost } =
    useMemo(() => {
      let discoverTotalCost = {
        sCost: 0,
        cCost: 0,
      };
      let conceiveTotalCost = {
        sCost: 0,
        cCost: 0,
      };
      let buildTotalCost = {
        sCost: 0,
        cCost: 0,
      };
      const {
        build = {},
        conceive = {},
        discover = {},
      } = approach || {};
      discoverTotalCost = getCost(discover?.roles, discover.durationType);
      conceiveTotalCost = getCost(conceive?.roles, conceive.durationType);
      buildTotalCost = getCost(build?.roles, build.durationType);
    
      return { discoverTotalCost, conceiveTotalCost, buildTotalCost };
    }, [activeApproachIndex, resourcePlanning]);
  return (
    <>
      <div className="c-section-1 border rounded-md border-solid border-gray-200 mb-1 p-0">
        <div className="px-3">
            <nav className="flex space-x-5 pl-1" aria-label="Tabs">
              {["Discover", "Conceive", "Build"].map((label, index) => (
                <button
                  key={index}
                  className={`tab-btn ${value === index ? "active" : ""}`}
                  onClick={(e) => handleChange(e, index)}
                >
                  {label}
                </button>
              ))}
            </nav>
          <TabPanel value={value} index={0}>
            <PriceList
              cCost={discoverTotalCost?.cCost || 0}
              sCost={discoverTotalCost?.sCost || 0}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PriceList
              cCost={conceiveTotalCost?.cCost || 0}
              sCost={conceiveTotalCost?.sCost || 0}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PriceList
              cCost={buildTotalCost?.cCost || 0}
              sCost={buildTotalCost?.sCost || 0}
            />
          </TabPanel>
        </div>
      </div>
      <div className="c-section-2 px-4 rounded-md">
        <p className="text-white text-xs inline-block border-b-2 pb-1 border-[#e3f13dcf]">
          Total
        </p>
        <PriceList
          cCost={
            discoverTotalCost?.cCost +
              conceiveTotalCost?.cCost +
              buildTotalCost?.cCost || 0
          }
          sCost={
            discoverTotalCost?.sCost +
              conceiveTotalCost?.sCost +
              buildTotalCost?.sCost || 0
          }
        />
      </div>
    </>
  );
};
export default ConsolitatedCostDetails;
