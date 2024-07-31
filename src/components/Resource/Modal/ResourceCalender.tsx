import React from 'react';
import { getCurrentYear } from "../../../features/resource/resourcePlanningSlice";
import { extractDate, extractMonth, generateMonthOptions, getFullDate } from "../../../helper/utility/dateFunctions";
import { useSelector } from "react-redux";
import styles from '../page.module.css'
import { startColorClasses, endColorClasses, selectedColorClasses } from "@/helper/constants/staticData/calenderData"
import { CustomComponentProps } from "@/helper/constants/types/ResourcePlanningtypes/CalenderTypes"

function ResourceCalender({ durationType, MonthOrWeek, roleTimeRange, dateMatrix, yearOptions }: CustomComponentProps) {

    const getColorClass = (index: number, colorClasses: any) => {
        const colorIndex = index % 6;
        return colorClasses[colorIndex];
    };

    const YearDateMatrix = ({ roleTimeRange }: any) => {
        const curentYear = useSelector(getCurrentYear);

        const selectedDate = roleTimeRange.reduce((obj: any, data: any) => {
            const start = getFullDate(data.start);
            const end = getFullDate(data.end);
            obj[start] = { ...data };
            obj[end] = { ...data };
            return obj;
        }, {});

        let isStart = false;
        let selectedIndex = 0;
        let currentClass = "";
        
        const listOfMonths = generateMonthOptions(curentYear);
        const listOfMonthsNested = [
            listOfMonths.slice(0, 4),
            listOfMonths.slice(4, 8),
            listOfMonths.slice(8, 12),
        ];
        return (
            <div className="w-[95%] m-5 grid grid-rows-3 gap-1 item-center">
                {listOfMonthsNested.map((months: any) => {
                    return (
                        <div className="w-full p-1 grid grid-cols-4 gap-1 px-6">
                            {months.map((month: any) => {
                                const currentDate = getFullDate(month?.value);
                                const startDate = getFullDate(selectedDate[currentDate]?.start);
                                const endDate = getFullDate(selectedDate[currentDate]?.end);
                                if (selectedDate[currentDate] && startDate === endDate) {
                                    currentClass = `border-r-4 rounded-lg ${styles?.[getColorClass(
                                        selectedIndex,
                                        startColorClasses
                                    )]}`
                                    isStart = false
                                    selectedIndex += 1;
                                } else if (selectedDate[currentDate] && !isStart) {
                                    isStart = true;
                                    currentClass = `${styles.selectedStart} ${styles.selectedDate} ${styles?.[getColorClass(
                                        selectedIndex,
                                        startColorClasses
                                    )]}`;
                                } else if (selectedDate[currentDate] && isStart) {
                                    isStart = false;
                                    currentClass = `${styles.selectedEnd} ${styles.selectedDate} ${styles?.[getColorClass(selectedIndex,endColorClasses)]}`;
                                    selectedIndex += 1;
                                } else if (isStart) {
                                    currentClass = `${styles.selectedDate} ${styles?.[getColorClass(
                                        selectedIndex,
                                        selectedColorClasses
                                    )]}`;
                                } else {
                                    currentClass = "";
                                }
                                return (
                                    <div className={`flex justify-center border-white border-4 ${currentClass}`}>
                                        <div className={styles.yearCalendarCell}>
                                            <div className="block">
                                                <p className="text-xs w-full m-0 leading-none">
                                                    {month.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };


    const WeekOrMonthTable = ({
        roleTimeRange = [],
        dateMatrix = [],
    }: {
        roleTimeRange: any;
        dateMatrix: any;
    }) => {
        const selectedDate = roleTimeRange.reduce(
            (timeRange: any, timeRangeData: any) => {
                const start = getFullDate(timeRangeData.start);
                const end = getFullDate(timeRangeData.end);
                timeRange[start] = { ...timeRangeData };
                timeRange[end] = { ...timeRangeData };
                return timeRange;
            },
            {}
        );

        let isStart = false;
        let selectedIndex = 0;
        let currentClass = "";
        
        return (
            <div className="grid grid-rows-6 m-1 item-center" >
                {dateMatrix.map((arrayDate: any, index: any) => (
                    <div className="grid grid-cols-9 gap-1 p-1" key={index}>
                        {arrayDate.map((date: any, colIndex: number) => {
                            const dateValue = extractDate(date);
                            const monthValue: any = extractMonth(date);
                            const currentDate = getFullDate(date);
                            const startDate = getFullDate(selectedDate[currentDate]?.start);
                            const endDate = getFullDate(selectedDate[currentDate]?.end);
                            if (selectedDate[currentDate] && startDate === endDate) {
                                currentClass = ` border-r-4 rounded-lg ${styles?.[getColorClass(
                                    selectedIndex,
                                    endColorClasses
                                )]}`
                                isStart = false
                                selectedIndex += 1;
                            }
                            else if (selectedDate[currentDate] && !isStart) {
                                isStart = true;
                                currentClass = `${styles.selectedStart} ${styles.selectedDate} ${styles?.[getColorClass(
                                    selectedIndex,
                                    startColorClasses
                                )]}`;
                            } else if (selectedDate[currentDate] && isStart) {
                                isStart = false;
                                currentClass = `${styles.selectedEnd} ${styles.selectedDate} ${styles?.[getColorClass(
                                    selectedIndex,
                                    endColorClasses
                                )]}`;
                                selectedIndex += 1;
                            } else if (isStart) {
                                currentClass = `${styles.selectedDate} ${styles?.[getColorClass(
                                    selectedIndex,
                                    selectedColorClasses
                                )]}`;
                            } else {
                                currentClass = "";
                            }

                            return (
                                <div key={colIndex} className={`flex justify-center border-white border-4 ${currentClass} text-xs`}>

                                    <div className={`${styles.calendarCell} m-[3px] w-[90%]`}>
                                        <div className="block font-bold">
                                            <p className="text-xs flex justify-center font-semibold w-full h-full m-0 leading-5">
                                                {dateValue}
                                            </p>
                                            <p className="text-[70%] uppercase block w-full m-0 h-full leading-none">
                                                {monthValue}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="items-center h-full w-full float-left shadow-md rounded-lg">
            <div className="block w-full">
                {durationType === MonthOrWeek.MONTHLY ? (
                    <YearDateMatrix roleTimeRange={roleTimeRange} />
                ) : (
                    <WeekOrMonthTable roleTimeRange={roleTimeRange} dateMatrix={dateMatrix} />
                )}
                <div className="text-base ml-3">
                    *
                    {durationType === MonthOrWeek.MONTHLY
                        ? MonthOrWeek.MONTHLY
                        : MonthOrWeek.WEEKLY}{" "}
                    start: {yearOptions?.weekStartDay || ""}
                </div>
            </div>
        </div>
    );
}

export default ResourceCalender;
