import { calculateMonthDifference, extractDate, extractMonth, filterDates, generateMonthOptions, getAvailableDates, getFirstDatesOfWeeks, getTotalDates, weekDifference, sortTimeRange } from "@/helper/utility/dateFunctions";
import { MonthOrWeek } from "@/helper/enums/statusEnums";
import Checklist from "../../../../public/assets/svg/Checklist.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getCurrentYear, settingCurrentYear } from "@/features/resource/resourcePlanningSlice";
import DeleteModal from "@/components/common/Modal/Confirmation";
import moment from "moment";
import { calculateWorkingHours, createObject } from "@/helper/utility/dateFunctions";
import { AppDispatch } from "@/features/store";
import EditIcon from "@/assets/icons/EditIcon"
import DeleteIcon from "@/assets/icons/DeleteIcon"
import { colorClasses, daysOfWeek } from "@/helper/constants/staticData/calenderData";
import { WeekValue } from "@/helper/constants/types/ResourcePlanningtypes/CalenderTypes";
import { useSearchParams } from 'next/navigation';
import { deleteTimeRanges } from "@/features/resource/resourcePlanningSlice";
import styles from "../page.module.css"

const Card = ({
  open,
  durationType,
  roleTimeRange,
  setRoleTimeRange,
  resourcePlann,
  calendarProps1,
  selectedRole,
  isChecked,
  setIsChecked,
  yearOptions,
  getLatestData,
  handleClose,
  setEnableSave
}: any) => {
  const DefaultHoursPerDay = 8;
  const days = daysOfWeek;
  const initialState: WeekValue = {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
  };
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: any = searchParams.get('projectId');
  const [weekValue, setWeekValue] = useState<WeekValue>(initialState);
  const [confirm, setConfirm] = useState<Boolean>(false)
  const [monthlyFA, setMonthlyFA] = useState({
    startDate: "",
    startMonth: "",
    endDate: "",
    endMonth: "",
    hoursPerMonth: "",
  });

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const curentYear = useSelector(getCurrentYear);
  const listOfMonths = generateMonthOptions(curentYear);
  const [allocatedPercentage, setAllocatedPercentage] = useState("");
  const allValues = extractValuesFromArray(listOfMonths);
  const dateArray = getFirstDatesOfWeeks(currentYear);
  const dateArr = durationType === MonthOrWeek.WEEKLY ? dateArray : allValues;
  const weekDates = filterDates(dateArr, roleTimeRange);
  const monthDates = filterDates(allValues, roleTimeRange);
  const updatedDates =
    durationType === MonthOrWeek.WEEKLY ? weekDates : monthDates;
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [endDates, setEndDates] = useState(updatedDates);
  const [showCreate, setShowCreate] = useState(true);
  const [start, setStartDate] = useState("");
  const [end, setEndDate] = useState("");
  const [currentimeRangeIndex, setCurrentimeRangeIndex] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);
  const [deleteTimeRange,setDeleteTimeRange] = useState<any>({})
  const [hourPerWeekvalue, setHourPerWeek] = useState("");
  const [allocated, setAllocated] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateData, setUpdateData] = useState({ rangeId: null, createdAt: '', createdBy: '' })
  const isDisabled =
    !showCreate
      ? start === "" ||
      end === "" ||
      ((isChecked
        ? hourPerWeekvalue === ""
        : !allocated
          ? weekValue?.monday === "" &&
          weekValue?.tuesday === "" &&
          weekValue?.wednesday === "" &&
          weekValue?.thursday === "" &&
          weekValue?.friday === ""
          : allocatedPercentage === "") &&
        (isChecked
          ? hourPerWeekvalue === ""
          : monthlyFA?.startDate === ""))
      : false;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (Array.isArray(roleTimeRange)) {
      setShowCreate(roleTimeRange.length > 0 ? true : false);
    }
    dispatch(settingCurrentYear(currentYear));
  }, [roleTimeRange]);

  useEffect(() => {
    if (Array.isArray(roleTimeRange)) {
      setShowCreate(roleTimeRange.length > 0 ? true : false);
    }
  }, [open]);

  useEffect(()=>{
    if(!open){
      setStartDate("")
      setEndDate("")
      setHourPerWeek("")
      setAllocatedPercentage("")
      setMonthlyFA({
        startDate: "",
        startMonth: "",
        endDate: "",
        endMonth: "",
        hoursPerMonth: "",
      });
      setIsChecked(true)
      setAllocated(true)
      setWeekValue(initialState)
      setCurrentimeRangeIndex(0)
      setShowCreate(true)
      setShowUpdate(false)
    }
  }, [open])

  const getColorClass = (index: number) => {
    const colorIndex = index % 6;
    return colorClasses[colorIndex];
  };

  function extractValuesFromArray(arrayOfObjects: any) {
    return arrayOfObjects.map((item: any) => item.value);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setShowCreate(!showCreate);
    setEnableSave(true);
    if (!showCreate) {
      const weeks =
        durationType === MonthOrWeek.WEEKLY
          ? weekDifference(start, end) + 1
          : calculateMonthDifference(start, end) + 1;
      const total = Object.values(weekValue)
        .filter((value) => value !== "")
        .reduce((acc, value) => acc + parseInt(value || "0"), 0);
      let allocatedPercentageValue = 0;
      let actualWorkingHours = 0;
      if (durationType === MonthOrWeek.WEEKLY) {
        allocatedPercentageValue = allocated
          ? parseInt(allocatedPercentage)
          : (total / 40) * 100;
      } else if (durationType === MonthOrWeek.MONTHLY) {
        if (!allocated) {
          const firstDayOfStartMonth = new Date(
            `1 ${monthlyFA?.startMonth}, ${currentYear}`
          );
          const lastDayOfEndMonth = new Date(
            currentYear,
            new Date(
              Date.parse(`${monthlyFA?.endMonth} 1, ${currentYear}`)
            ).getMonth() + 1,
            0
          );
          const totalWorkingHours = calculateWorkingHours(
            firstDayOfStartMonth,
            lastDayOfEndMonth,
            DefaultHoursPerDay
          );
          actualWorkingHours = calculateWorkingHours(
            new Date(
              `${monthlyFA?.startMonth} ${monthlyFA?.startDate}, ${currentYear}`
            ),
            new Date(
              `${monthlyFA?.endMonth} ${monthlyFA?.endDate}, ${currentYear}`
            ),
            parseInt(monthlyFA?.hoursPerMonth)
          );
          allocatedPercentageValue =
            (actualWorkingHours / totalWorkingHours) * 100;
          allocatedPercentageValue = Number(
            allocatedPercentageValue.toFixed(2)
          );
        } else {
          allocatedPercentageValue = parseInt(allocatedPercentage);
        }
      }
      let hourPerDuration = isChecked
        ? parseInt(hourPerWeekvalue)
        : durationType === MonthOrWeek.WEEKLY
          ? (allocatedPercentageValue / 100) * 40
          : (allocated
            ? (allocatedPercentageValue / 100) * 160
            : actualWorkingHours);
      hourPerDuration = Number(hourPerDuration.toFixed(2));

      const rangeCost =
        Number(hourPerDuration) *
        Number(calendarProps1?.costPerHour) *
        Number(weeks);

      const week = total != 0 ? weekValue : null;
      const hpd =
        allocated
          ? allocatedPercentage == ""
            ? parseInt(monthlyFA?.hoursPerMonth)
            : (allocatedPercentageValue / 100) * 8
          : null;
      let startMonthRange = null;
      let endMonthRange = null;
      if (
        !(
          monthlyFA?.startMonth == "" ||
          monthlyFA?.startDate == "" ||
          monthlyFA?.endMonth == "" ||
          monthlyFA?.endDate == ""
        )
      ) {
        startMonthRange = new Date(
          `${monthlyFA?.startMonth} ${monthlyFA?.startDate}, ${currentYear}`
        ).toISOString();
        endMonthRange = new Date(
          `${monthlyFA?.endMonth} ${monthlyFA?.endDate}, ${currentYear}`
        ).toISOString();
      }
      const sortedTimeRange = sortTimeRange([...roleTimeRange])
      const newEntry =
        createObject(updateData, start, end, hourPerDuration, rangeCost, allocatedPercentageValue, startMonthRange, endMonthRange, hpd, week, durationType, allocated, isChecked)
      setWeekValue(initialState);
      
      if (showUpdate) {
        setRoleTimeRange(sortedTimeRange.map((range: any, index: number) => {
          if (index == currentimeRangeIndex)
            range = newEntry
          return range
        }))
      }
      else
        setRoleTimeRange([...roleTimeRange, newEntry]);
      setShowCreate(true);
      setEnableSave(false);
    }
    if (showUpdate)
      setShowUpdate(false)
    
    setUpdateData({ rangeId: null, createdAt: '', createdBy: '' })
    setMonthlyFA({
      startDate: "",
      startMonth: "",
      endDate: "",
      endMonth: "",
      hoursPerMonth: "",
    });
    setStartDate("")
    setEndDate("")
    setHourPerWeek("")
    setAllocatedPercentage("")
    setIsChecked(true)
    setAllocated(true)
  };

  // handles update and delete operation after creating the timeRange

  const handleUpdate = (timeRange: any, index: number) => {
    if (timeRange.rangeId) {
      setUpdateData({
        rangeId: timeRange.rangeId,
        createdAt: timeRange.createdAt,
        createdBy: timeRange.createdBy
      })
    }

    if (durationType == MonthOrWeek.WEEKLY) {
      if (timeRange?.allocationPercentage) {
        setIsChecked(false)
        if (timeRange?.fractionalWeekHours){
          setAllocated(false)
          setWeekValue(timeRange?.fractionalWeekHours)
        }
        else
          setAllocatedPercentage(timeRange?.allocationPercentage) 
      }
      else
        setHourPerWeek(timeRange?.hourPerDuration)
    } else {
      if (timeRange?.allocationPercentage) {
        setIsChecked(false)
        if (timeRange?.startMonthRange) {
          setAllocated(false)
          setMonthlyFA({
            startDate: moment(timeRange?.startMonthRange).format("DD").toString(),
            startMonth: moment(timeRange?.startMonthRange).format("MMM").toString(),
            endDate: moment(timeRange?.endMonthRange).format("DD").toString(),
            endMonth: moment(timeRange?.endMonthRange).format("MMM").toString(),
            hoursPerMonth: timeRange?.hourPerDay.toString(),
          });
        }
        else
          setAllocatedPercentage(timeRange?.allocationPercentage)
      }
      else
        setHourPerWeek(timeRange?.hourPerDuration)
    }
    setStartDate(timeRange?.start)
    setEndDate(timeRange?.end)
    setSelectedTimeRange(timeRange);
    setCurrentimeRangeIndex(index);
    setShowUpdate(true);
    setShowCreate(false);
  }

  useEffect(() => {
    if (confirm == true) {
      if (deleteTimeRange.rangeId) {
        const resBody: any = {
          projectId: parseInt(projectId),
          roleId: selectedRole.roleId,
          approachId: resourcePlann?.approachId,
          timeRangeIds: [deleteTimeRange?.rangeId],
          updatedBy: "Bounteous"
        };
        dispatch(deleteTimeRanges(resBody)).then((res: any) => {
          if (res.payload.status === 201) {
            getLatestData();
            handleClose();
          }
        });

      } else {
        getLatestData();
        handleClose()
      }

    }
  }, [confirm])

  const handleDeleteClick = (timeRange: any, currentTimeIndex: any) => {
    setDeleteTimeRange(timeRange)
    setShowDeleteModal(false)
    setConfirm(false)
  };
  // ----

  // handles change in the values  --------
  const handleStartDateChange = (event: any) => {
    const selectedStartDate = event.target.value;
    if (durationType === MonthOrWeek.MONTHLY) {
      setMonthlyFA({
        ...monthlyFA,
        startMonth: extractMonth(event.target.value),
      });
    }
    setStartDate(selectedStartDate);
    setEndDate("");
    // Filter the end dates based on the selected start date

    const filteredEndDates =
      durationType === MonthOrWeek.MONTHLY
        ? updatedDates.filter((date: any) => date >= selectedStartDate)
        : updatedDates.filter((date: any) => date >= selectedStartDate);
    const availableDates = getAvailableDates(
      selectedStartDate,
      roleTimeRange,
      filteredEndDates
    );
    setEndDates(availableDates);

    // Reset the selected end date if it's not a valid option anymore
    if (!filteredEndDates.includes(selectedEndDate)) {
      setSelectedEndDate("");
    }
  };

  const handleEndDateChange = (event: any) => {
    setSelectedEndDate(event.target.value);
    if (durationType === MonthOrWeek.MONTHLY) {
      setMonthlyFA({
        ...monthlyFA,
        endMonth: extractMonth(event.target.value),
      });
    }
    setEndDate(event.target.value);
  };

  const handleFAChange = (event: any) => {
    if (event.target.name == "hoursPerMonth") {
      if (event.target.value >= 0) {
        setMonthlyFA({
          ...monthlyFA,
          [event.target.name]: event.target.value,
        });
      }
    } else {
      setMonthlyFA({
        ...monthlyFA,
        [event.target.name]: event.target.value,
      });
    }
  };
  // ---------

  // form element compnent
  const ResourceTimeAllocator = () => {

    const changeNumber = (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const ele = document.getElementById(`${index}`);
      if (event.target.value == "" && ele != null) {
        ele.style.borderColor = "";
        ele.style.opacity = "0.75";
      } else if (ele != null) {
        ele.style.borderColor = "#E9FF66";
        ele.style.opacity = "1";
      }
      if (
        event.target.value != undefined 
      ) {
        event.target.value =event.target.value.replace(/^0+|[^1-8]/gi, '').charAt(0);
        setWeekValue({ ...weekValue, [event.target.name]: event.target.value });
      }
    };

    const changeAllocatedPercentage = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value.substring(0, 2);
      if (Number(value) > 0) {
        setAllocatedPercentage(value);
      } else setAllocatedPercentage("");
    };

    const handleHourPerWeekChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value.substring(0, 3);
      // Check if the value is greater than zero before updating the state
      if (Number(value) > 0) {
        setHourPerWeek(value);
      } else {
        // If the value is not greater than zero, set it to an empty string
        setHourPerWeek("");
      }
    };

    return (
      <div className={`h-auto rounded-sm w-[80%] p-[10px] mx-auto mt-[15px] ${styles.createRange} ${getColorClass(roleTimeRange.length)}`}>
        <label className="block font-semibold">
          {durationType === MonthOrWeek.MONTHLY ? "Start Month" : "Start Week"}
        </label>

        <select
          className="px-1 rounded-sm h-[35px] w-full"
          name="start"
          id="startDate"
          onChange={(e) => handleStartDateChange(e)}
          value={start}
        >
          <option disabled value="">Select {durationType === MonthOrWeek.MONTHLY ? "Start Month" : "Start Week"}</option>
          {start && !updatedDates.includes(start) && (
            <option value={start}>
              {durationType === MonthOrWeek.WEEKLY
                ? extractDate(start) + " " + extractMonth(start)
                : extractMonth(start)}
            </option>
          )}
          {updatedDates.map((date: any, index: number) => {
            const dateValue = extractDate(date);
            const monthValue = extractMonth(date);

            return (
              <option value={date} key={index}>
                {durationType === MonthOrWeek.WEEKLY
                  ? dateValue + " " + monthValue
                  : monthValue}
              </option>
            );
          })}
        </select>

        <label className="block font-semibold mt-[15px]">
          {durationType === MonthOrWeek.MONTHLY ? "End Month" : "End Week"}
        </label>
        <select
          className="px-1 rounded-sm h-[35px] w-full"
          name="end"
          id="rangeEndSelect"
          onChange={(e) => handleEndDateChange(e)}
          disabled={start === "" ? true : false}
          value={end}
        >
          <option disabled value="">Select {durationType === MonthOrWeek.MONTHLY ? "End Month" : "End Week"}</option>
          {end && !updatedDates.includes(end) && (
            <option value={end}>
              {durationType === MonthOrWeek.WEEKLY
                ? extractDate(end) + " " + extractMonth(end)
                : extractMonth(end)}
            </option>
          )}
          {endDates.map((date: any, index: number) => {
            const dateValue = extractDate(date);
            const monthValue = extractMonth(date);
            return (
              <option value={date} key={index}>
                {durationType === MonthOrWeek.WEEKLY
                  ? dateValue + " " + monthValue
                  : monthValue}
              </option>
            );
          })}
        </select>

        {isChecked ? (
          <div>
            <label className="block font-semibold mt-[15px]">
              {durationType === MonthOrWeek.MONTHLY ? "Hour/Month" : "Hour/Week"}
            </label>
            <input
              id="perHourInput"
              name="hourPerDuration"
              type="number"
              className="w-full block mt-[3px] border border-gray-400 rounded py-2 px-3 leading-tight"
              onChange={handleHourPerWeekChange}
              required
              value={hourPerWeekvalue}
              min="1"
              pattern="^[1-9]\d*"
            />
          </div>

        ) : (
          <label className="mt-4 flex flex-col">
            <p className="font-[600]">FA Choice</p>
            <div className="flex mt-1 mx-1 text-[0.5rem] text-white h-10 gap-2 relative">
              <div
                onClick={() => {
                  setAllocated(true);
                }}
                className={`${allocated
                  ? "text-white bg-[#35297F] after:bg-[#35297F] after:h-2 after:w-2 after:absolute after:-bottom-1 after:left-1/2 after:rotate-45 after:-translate-x-1/2"
                  : "bg-[#FFFFFFA1] text-[#808199] "
                  } flex text-center items-center rounded-md w-[50%] relative hover:cursor-pointer`}
              >
                <Image
                  className={`${allocated ? "" : "invisible"
                    } absolute -mt-4 ml-1`}
                  src={Checklist}
                  height={10}
                  width={10}
                  alt=""
                />
                Allocated Percentage
              </div>
              <div
                onClick={() => {
                  setAllocated(false);
                }}
                className={`${!allocated
                  ? "bg-[#35297F] text-white after:bg-[#35297F] after:h-2 after:w-2 after:absolute after:-bottom-1 after:left-1/2 after:rotate-45 after:-translate-x-1/2"
                  : "text-[#808199] bg-[#FFFFFFA1]"
                  } text-center flex items-center justify-center rounded-md w-[50%] relative hover:cursor-pointer whitespace-pre-line`}
              >
                <Image
                  className={`${!allocated ? "" : "invisible"
                    } absolute -ml-12 -mt-4`}
                  src={Checklist}
                  height={10}
                  width={10}
                  alt=""
                />
                {durationType === MonthOrWeek.MONTHLY
                  ? "Range\nPicker"
                  : "Hours\nper day"}
              </div>
            </div>
            {allocated ? (
              <div className="mt-2 p-1 h-[4rem] rounded-md bg-[#2B205FDB]">
                <p className="text-white text-[0.7rem] pl-2">
                  Allocated Percentage
                </p>
                <input
                  className="w-[90%] rounded-sm p-1 mt-2 ml-2 text-xs [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  value={allocatedPercentage}
                  id="allocatedPercentage"
                  name="allocatedPercentage"
                  onChange={(e) => changeAllocatedPercentage(e)}
                  placeholder="Enter Percentage"
                />
              </div>
            ) : durationType === MonthOrWeek.MONTHLY ? (
              <div className="mt-2 p-1 h-[10rem] rounded-md bg-[#2B205FDB]">
                <p className="text-white text-[0.7rem] mb-1">Start Range</p>
                <div className="grid grid-cols-2 gap-2 mb-1 mx-2">
                  <select
                    disabled={start === "" ? true : false}
                    className="h-[25px] px-1"
                    name="startMonth"
                    id="startRangeMonthSelect"
                    style={{ fontSize: "10px" }}
                    value={monthlyFA?.startMonth}
                  >
                    <option disabled value=""></option>
                    <option value={monthlyFA?.startMonth}>
                      {monthlyFA?.startMonth}
                    </option>
                  </select>
                  <select
                    className="h-[25px] px-1"
                    name="startDate"
                    id="startRangeDaySelect"
                    style={{ fontSize: "10px" }}
                    onChange={(e) => handleFAChange(e)}
                    disabled={monthlyFA?.startMonth === "" ? true : false}
                    value={monthlyFA?.startDate}
                  >
                    <option disabled value=""></option>
                    {Array.from(
                      {
                        length: getTotalDates(
                          monthlyFA?.startMonth,
                          yearOptions.currentYear
                        ),
                      },
                      (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <p className="text-white text-[0.7rem] mb-1">End Range</p>
                <div className="grid grid-cols-2 gap-2 mb-1 mx-2">
                  <select
                    disabled={end === "" ? true : false}
                    className="h-[25px] px-1"
                    name="endMonth"
                    id="endRangeMonthSelect"
                    style={{ fontSize: "10px" }}
                    value={monthlyFA?.endMonth}
                  >
                    <option disabled value=""></option>
                    <option value={monthlyFA?.endMonth}>
                      {monthlyFA?.endMonth}
                    </option>
                  </select>
                  <select
                    className="h-[25px] px-1"
                    name="endDate"
                    id="endRangeDaySelect"
                    style={{ fontSize: "10px" }}
                    onChange={(e) => handleFAChange(e)}
                    disabled={monthlyFA?.endMonth === "" ? true : false}
                    value={monthlyFA?.endDate}
                  >
                    <option disabled value=""></option>
                    {Array.from(
                      {
                        length: getTotalDates(
                          monthlyFA?.endMonth,
                          yearOptions.currentYear
                        ),
                      },
                      (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <p className="text-white text-[0.7rem] mb-1">Hours per day</p>
                <input
                  className="w-[90%] rounded-sm p-1 text-xs mx-2 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  placeholder="Enter Hours per day"
                  name="hoursPerMonth"
                  onChange={(e) => handleFAChange(e)}
                  value={monthlyFA?.hoursPerMonth}
                />
              </div>
            ) : (
              <div className="mt-2 p-1 h-[4.5rem] rounded-md bg-[#2B205FDB]">
                <p className="text-white text-[0.7rem] pl-2">Hours per day</p>
                <div className="grid grid-cols-5 text-center p-1 px-3 gap-2 h-[1rem] text-xs text-white">
                  {days.map((element: string, index: any) => {
                    return (
                      <div
                        id={`${index}`}
                        className={`border-solid border rounded-md col-span-1 pb-1 ${weekValue && weekValue[element] !== "" ? "opacity-100" : "opacity-75"} focus-within:border-[#E9FF66] focus-within:opacity-1`}
                      >
                        {element[0].toUpperCase()}
                        <input
                          type="number"
                          pattern="^[1-9]\\d*"
                          name={`${element}`}
                          value={weekValue == null ? "" : weekValue[element]}
                          onChange={(event) => changeNumber(event, index)}
                          className="w-[70%] bg-transparent focus:outline-none border-b text-[#E9FF66] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </label>
        )}
      </div>
    );
  };

  // renders list of timeRanges
  const TimeRangeCards = () => {
    // Sort the roleTimeRange array based on the end value
    const sortedTimeRange = sortTimeRange([...roleTimeRange])
    // Render TimeRangeCards only if roleTimeRange is not empty
    return sortedTimeRange.length > 0 && sortedTimeRange.map((timeRange: any, index: number) => (
      <div key={index} style={{ lineHeight: "15px" }} className={` rounded-lg w-[80%] p-[10px] ml-auto mr-auto my-[20px] mt-[12%] ${styles.rangeBg} ${styles?.[getColorClass(index)]}`}>
        <div className="h-full">
          <div className="w-[45%] inline-block text-left text-white">
            {durationType === MonthOrWeek.WEEKLY ? (
              <></>
            ) : timeRange.startMonthRange == null ? (
              <></>
            ) : (
              <>
                <p className="font-semibold" style={{ margin: "5px 0px", fontSize: "10px" }}>
                  Hours/Day
                </p>
                <p className="font-semibold" style={{ margin: "5px 0px", fontSize: "10px" }}>
                  {timeRange.hourPerDay}
                </p>
              </>
            )}
            <p className="font-semibold my-2" style={{ fontSize: '10px' }}>
              {durationType === MonthOrWeek.WEEKLY
                ? "Hour/Week"
                : timeRange.startMonthRange == null
                  ? "Hour/Month"
                  : "Total Hours in Range"}
            </p>
            <p className="my-2" style={{ fontSize: "16px" }}>
              {Number(timeRange.hourPerDuration).toFixed(2)}
            </p>
            <p className="font-semibold mt-[10px] mb-[5px]" style={{ fontSize: "10px" }}>
              {durationType === MonthOrWeek.MONTHLY
                ? "Total Months"
                : "Total weeks"}
            </p>
            <h3 style={{ fontSize: "16px" }}>
              {durationType === MonthOrWeek.MONTHLY
                ? calculateMonthDifference(timeRange.start, timeRange.end) + 1
                : weekDifference(timeRange.start, timeRange.end) + 1}
            </h3>
          </div>
          <div className="w-[55%] h-[90px] inline-block float-right">
            <div className="h-full">
              <div className="h-full flex flex-col items-center bg-white p-[10px] rounded-[5px]">
                <div className="flex space-x-2">
                  <div className="cursor-pointer" onClick={() => handleUpdate(timeRange, index)}>
                    <EditIcon />
                  </div>
                  <div className="cursor-pointer" onClick={() => {
                    handleDeleteClick(timeRange, index);
                    setShowDeleteModal(true);
                  }}>
                    <DeleteIcon />
                  </div>
                </div>
                <div>
                  <h5 className="my-[5px] text-center text-xs" >
                    Total Cost
                  </h5>
                   <h3 className={`text-center font-bold ${timeRange.rangeCost.toFixed(2).length >= 9 ? 'text-xs' : 'text-base'}`}>
                    {timeRange.rangeCost.toFixed(2)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {timeRange?.allocationPercentage != null ? (
            <>
              {durationType === MonthOrWeek.MONTHLY ? (
                <div className="text-white">
                  {timeRange.startMonthRange == null ? (
                    <>
                      <h5 className="mt-[10px] mb-[5px]" style={{ fontSize: "10px" }}>
                        Allocated Percentage
                      </h5>
                      <h3 style={{ fontSize: "16px" }}>
                        {timeRange?.allocationPercentage}%
                      </h3>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 w-full">
                      <h5 className="mt-[10px]" style={{ fontSize: "12px" }}>
                        Start Range
                      </h5>
                      <h5 className="mt-[10px]" style={{ fontSize: "12px" }}>
                        End Range
                      </h5>
                      <p className="mt-[10px]" style={{ fontSize: "12px" }}>
                        {moment(timeRange?.startMonthRange).format("DD MMM")}
                      </p>
                      <p className="mt-[10px]" style={{ fontSize: "12px" }}>
                        {moment(timeRange?.endMonthRange).format("DD MMM")}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-white">
                  <h5 className="mt-[10px] mb-[5px]" style={{ fontSize: "10px" }}>
                    Allocated Percentage
                  </h5>
                  <h3 className="my-2" style={{ fontSize: "16px" }}>
                    {timeRange?.allocationPercentage}%
                  </h3>
                  {timeRange.fractionalWeekHours == null ? (
                    <>
                      <h5 className="mt-[10px] mb-[5px]" style={{ fontSize: "10px" }}>
                        Hour/Day
                      </h5>
                      <h3 style={{ fontSize: "16px" }}>
                        {timeRange?.hourPerDay.toFixed(2)}
                      </h3>
                    </>
                  ) : (
                    <div className="flex justify-evenly mt-4 mb-2 ">
                      {days.map((day: string) => (
                        <div key={day} className="text-center">
                          <p className="mb-2 text-[12px]">
                            {day[0].toUpperCase()}
                          </p>
                          <p className="text-[12px]">
                            {String(timeRange?.fractionalWeekHours?.[day] || 0)}{" "}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    ));
  }

  return (
    <div className="flex flex-col gap-3 float-right h-[26rem] w-full mr-[2.5%] mt-[-10vh] overflow-y-scroll shadow-none">

      <DeleteModal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        setConfirm={setConfirm}
        data={"Any unsaved data will be gone. Are you sure?"}
      />

      <div className="">{showCreate ? TimeRangeCards() : ResourceTimeAllocator()}</div>

      {!showUpdate ? (
        <button
          className={`${isDisabled ? 'bg-gray-400' : 'bg-blue-400'} w-[45%] ml-auto mr-auto mb-3 text-sm text-white p-1 rounded-lg border-l border-t border-b border-white`}
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Create Range
        </button>
      ) : (
        <button
          className={`${isDisabled ? 'bg-gray-400' : 'bg-blue-400'} w-[45%] ml-auto mr-auto mb-3 text-sm text-white p-1 rounded-lg border-l border-t border-b border-white`}
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Update Range
        </button>
      )}
    </div>
  )

}
export default Card