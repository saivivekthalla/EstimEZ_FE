import React, { useState, useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFirstDatesOfWeeks, splitNineSixArray } from "../../../helper/utility/dateFunctions";
import {
  getCurrentYear,
  settingCurrentYear,
} from "../../../features/resource/resourcePlanningSlice";
import { MonthOrWeek } from "@/helper/enums/statusEnums";
import { AppDispatch } from "@/features/store";
import Header from "./Header";
import Toggle from "./Toggle";
import ResourceCalender from "./ResourceCalender";
import {ButtonGroupProps,YearSelectorProps,calendarProps} from "@/helper/constants/types/ResourcePlanningtypes/CalenderTypes";
import {weekStartDays} from "@/helper/constants/staticData/calenderData";
const Card = lazy(()=>import("../TimeRangeCard"));

const Modal = (props: calendarProps) => {
  const {
    open,
    calendarProps1,
    onChildDataChange,
    durationType,
    resourcePlann,
    currentPhase,
    existingDatas,
    selectedRole,
    getLatestData,
    handleClose,
  } = props;

  useEffect(()=>{
    setRoleTimeRange(calendarProps1.timeRanges)
  },[calendarProps1])
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [enableSave, setEnableSave] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [roleTimeRange, setRoleTimeRange] = useState([]);
  const currentyear = useSelector(getCurrentYear);
  let yearOptions: any;
  const dateArray = getFirstDatesOfWeeks(currentyear);
  const columnSize = 9;
  const dateMatrix = splitNineSixArray(dateArray, columnSize);
  const dispatch = useDispatch<AppDispatch>();
  const getYearOptions = () => {
    const previousYear = currentYear - 1;
    const nextYear = currentYear + 1;
    const currentYearDate = new Date(currentYear, 0, 1);
    const currentYearDay = currentYearDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const weekStartDay = weekStartDays[currentYearDay];
    return {
      previousYear,
      currentYear,
      nextYear,
      weekStartDay,
    };
  };
  yearOptions = getYearOptions();

  const changeYear = (year: any) => {
    setCurrentYear(year);
    dispatch(settingCurrentYear(year));
  };

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };


  function YearSelector({ yearOptions, changeYear }: YearSelectorProps) {
    return (
      <div className=" flex justify-around  h-[8%] w-[70%] bg-transparent rounded-br-3xl">
        <div className="float-left h-full flex">
          <button
            className="text-gray-600 flex items-end m-0 border-none cursor-pointer"
            style={{
              backgroundColor: "transparent"
            }}
            onClick={() => changeYear(yearOptions.previousYear)}
          >
            {yearOptions.previousYear}
          </button>
        </div>

        <div
          className="flex h-full justify-center"
        >
          <h1 className="text-gray-600 flex items-end m-0 border-none">
            {yearOptions.currentYear}
          </h1>
        </div>

        <div className="float-right h-full flex transition duration-1000">
          <button
            className="text-gray-600 flex items-end m-0 border-none cursor-pointer"
            style={{
              background: "transparent",
            }}
            onClick={() => changeYear(yearOptions.nextYear)}
          >
            {yearOptions.nextYear}
          </button>
        </div>

      </div>
    );
  }

  function ButtonGroup({ enableSave, onChildDataChange, roleTimeRange, calendarProps, props }: ButtonGroupProps) {
    return (
      <div className="ml-auto mr-auto text-white">
        <button
          className={`px-3 py-1 text-white text-sm rounded-md m-2 ${enableSave ? ('bg-gray-400') : ('bg-[#10217e]')}`}
          onClick={() => {
            onChildDataChange(roleTimeRange, calendarProps.index);
          }}
          disabled={enableSave}
        >
          Save
        </button>
        <button className="px-3 py-1 text-white text-sm rounded-md m-2 bg-[#10217e]" onClick={props.handleClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div
      className="calendar-container bg-white rounded-lg h-[550px] w-[830px]"
    >
      <div className="flex justify-between">
        <Header calendarProps={calendarProps1} durationType={durationType} />
        <Toggle isChecked={isChecked} toggleSwitch={toggleSwitch} />
      </div>

      <YearSelector yearOptions={yearOptions} changeYear={changeYear} />

      <div className="flex flex-row p-3">
        <div className="w-[70%]">
          <ResourceCalender
            durationType={durationType}
            MonthOrWeek={MonthOrWeek}
            roleTimeRange={roleTimeRange}
            dateMatrix={dateMatrix}
            yearOptions={yearOptions}
          />
        </div>
        <div className=" w-[30%] flex flex-col mt-6">

          <Card
            open={open}
            durationType={durationType} 
            roleTimeRange={roleTimeRange}
            setRoleTimeRange={setRoleTimeRange}
            resourcePlann={resourcePlann}
            calendarProps1={calendarProps1}
            selectedRole={selectedRole}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            yearOptions={yearOptions}
            getLatestData={getLatestData}
            handleClose={handleClose}
            setEnableSave={setEnableSave}
          />
          <ButtonGroup
            enableSave={enableSave}
            onChildDataChange={onChildDataChange}
            roleTimeRange={roleTimeRange}
            calendarProps={calendarProps1}
            props={props}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;