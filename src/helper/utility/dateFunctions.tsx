import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";

export function getTotalDates(month: string, year: any) {
  const months31 = ["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"];
  if ((month == "Feb" && year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    return 29;
  } else if (month == "Feb") {
    return 28;
  } else if (months31.includes(month)) {
    return 31;
  } else {
    return 30;
  }
}

export function getFirstDatesOfWeeks(year = 2023) {
  const firstDates: any = [];
  const startDate = new Date(year, 0, 1); // January 1st
  const endDate = new Date(year, 11, 31); // December 31st

  let currentDate = startDate;

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    firstDates.push(formattedDate);

    // Move to the next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return firstDates;
}

export const extractDate = (dateStr: string) => {
  const dateObj = new Date(dateStr);

  const date = dateObj.getDate(); // Get the date (1)
  const formattedDate = date.toString().padStart(2, "0");

  return formattedDate;
};

export const extractMonth = (dateStr: string) => {
  const dateObj = new Date(dateStr);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = dateObj.getMonth(); // Get the month index (9)
  const monthName = monthNames[monthIndex]; // Get the month name (Oct)
  return monthName;
};

export function filterDates(datesArray: any, dateRanges: any) {
  let filteredDates = datesArray;
  if (dateRanges) {
    filteredDates = datesArray.filter((date: any) => {
      const currentDate = new Date(date).toISOString(); // Convert date to ISO 8601 format
      for (const range of dateRanges) {
        if(range?.start && range.end){
          const start = new Date(range.start).toISOString();
          const end = new Date(range.end);
          end.setHours(23, 59, 59, 999); // Adjust the end time to the end of the day
          const endISO = end.toISOString();
        if (currentDate >= start && currentDate <= endISO) {
          return false; // Exclude the date if it falls within the range
        }
        }
      }
      return true; // Include the date if it doesn't fall within any range
    });
  }
  return filteredDates;
}

export const getDateMonth = (inputDate: any) => {
  const [day, month, year] = inputDate.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month, 10) - 1];

  return {
    date: day.padStart(2, "0"),
    month: monthName,
    dateMonth: day.padStart(2, "0") + " " + monthName,
  };
};

export function splitNineSixArray(array: any, chunkSize: any) {
  const result: any = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

// Function to convert date string in "dd-mm-yyyy" format to a Date object
export const parseDate = (dateString: any) => {
  const [day, month, year] = dateString?.split("-");
  return new Date(year, month - 1, day);
};

export const parsingDate = (inputDate: string) => {
  const parts = inputDate.split("-");
  const formattedDate = new Date(inputDate);
  return formattedDate;
};

export function paginateList(
  list: any[],
  itemsPerPage: number,
  currentPage: number
): any[] {
  if (!list || list.length === 0 || itemsPerPage <= 0 || currentPage <= 0) {
    // Return an empty array if the input list is empty or undefined, or if itemsPerPage or currentPage is invalid.
    return [];
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Use the slice method to extract the items for the current page from the list.
  return list.slice(startIndex, endIndex);
}

export const weekDifference = (start: any, end: any) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7));
};

export const sortedList = (list: any) => {
  return list.sort((a: any, b: any) => a.id - b.id);
};

export const findObjectById = (data: any, id: number) => {
  for (let obj of data) {
    if (obj.id === id) {
      return obj;
    }
  }
  return null; // Return null if no object with the specified id is found
};

// Generate an array of month names and values
export const generateMonthOptions = (year: any) => {
  const options: any = [];
  const date = new Date();

  for (let month = 0; month < 12; month++) {
    date.setFullYear(year, month, 1);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);
    const formattedDate = date.toISOString().split("T")[0];
    options.push({ value: formattedDate, name: monthName });
  }

  return options;
};

export function calculateMonthDifference(startDate: any, endDate: any) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate input dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  // Calculate the difference in months
  const months = (endYear - startYear) * 12 + (endMonth - startMonth);

  return months;
}

export const calculateWorkingHours = (
  startDate: Date,
  endDate: Date,
  hoursPerDay: number
) => {
  let totalHours = 0;

  // Loop through each day between startDate and endDate
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    // Check if it's not Saturday (6) or Sunday (0)
    if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
      totalHours += hoursPerDay;
    }
  }

  return totalHours;
};

export function removeDatesInRange(dates: any, rangesData: any) {
  const result = [...dates];

  for (const range of rangesData) {
    const { start, end } = range;

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate input dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const filteredDates = result.filter((date) => {
      const currentDate = new Date(date.value);

      return currentDate < startDate || currentDate > endDate;
    });

    result.length = 0;
    result.push(...filteredDates);
  }

  return result;
}

export const findApproachById = (templateId: number, estimationData: any) => {
  // const approaches = estimationData?.approaches || [];
  const approach = estimationData?.approaches.find(
    (item: any) => item.id === templateId
  );

  return approach || null;
};

// Function to compare the user's input with the existing data
export function compareData(userInput: any, existingData: any) {
  // If the lengths of the arrays are different, changes exist
  if (userInput.length !== existingData.length) {
    return true;
  }

  // Iterate over each object in the userInput array
  for (let i = 0; i < userInput.length; i++) {
    const userObj = userInput[i];
    const matchingData = existingData.find(
      (data: any) =>
        data.categoryId === userObj.categoryId &&
        data.subcategoryId === userObj.subcategoryId
    );

    // If no matching data is found for the current object, there are changes
    if (!matchingData) {
      return true;
    }

    // Compare each property of the matching data with the current user's object
    for (const prop in userObj) {
      if (userObj[prop] !== matchingData[prop]) {
        return true; // Changes found
      }
    }
  }

  // No changes found
  return false;
}

export function findDifferences(existing: any, newObj: any) {
  const updatedObj = { ...existing };
  let hasDifference = false;

  Object.keys(newObj).forEach((key) => {
    if (existing[key] !== newObj[key]) {
      updatedObj[key] = newObj[key];
      hasDifference = true;
    }
  });

  if (hasDifference) {
    updatedObj.updatedAt = new Date().toISOString();
    return [updatedObj];
  }

  return [];
}

// export function removeUnchangedObjects(newlyAdded: any, existingData: any) {
//     if (!newlyAdded || !existingData) {
//         return [];
//     }

//     return newlyAdded.map((newObj: any) => {
//         const existingObj = existingData.find((obj: any) => obj.roleId === newObj.roleId);
//         if (!existingObj) {
//             return newObj;
//         }

//         const isDifferent = JSON.stringify(newObj) !== JSON.stringify(existingObj);
//         if (isDifferent) {
//             const newTimeRanges = newObj.timeRanges.filter((newTimeRange: any) => {
//                 return !existingObj.timeRanges.some(
//                     (existingTimeRange: any) => JSON.stringify(existingTimeRange) !== JSON.stringify(newTimeRange)
//                 );
//             });

//             const hasNewTimeRanges = newTimeRanges.length > 0;
//             const updatedAt = hasNewTimeRanges ? new Date().toISOString() : null;

//             return {
//                 ...newObj,
//                 timeRanges: hasNewTimeRanges ? newTimeRanges : [],
//                 updatedAt: updatedAt,
//                 isRoleDeleted: false,
//             };
//         }

//         return null;
//     }).filter(Boolean);
// }

export function removeUnchangedObjects(newlyAdded: any, existingData: any) {
  if (!newlyAdded || !existingData) {
    return [];
  }

  return newlyAdded
    .map((newObj: any) => {
      const existingObj = existingData.find(
        (obj: any) => obj.roleId === newObj.roleId
      );
      if (!existingObj) {
        return newObj;
      }

      const isDifferent =
        JSON.stringify(newObj) !== JSON.stringify(existingObj);
      if (isDifferent) {
        const newTimeRanges = newObj.timeRanges.map((newTimeRange: any) => {
          const existingTimeRange = existingObj.timeRanges.find(
            (existingTimeRange: any) =>
              existingTimeRange.rangeId === newTimeRange.rangeId
          );
          if (!existingTimeRange) {
            return newTimeRange;
          }

          const isTimeRangeDifferent =
            JSON.stringify(newTimeRange) !== JSON.stringify(existingTimeRange);
          const updatedAt = isTimeRangeDifferent
            ? new Date().toISOString()
            : existingTimeRange.updatedAt;

          return {
            ...newTimeRange,
            updatedAt: updatedAt,
            isDeleted: false,
          };
        });

        const hasNewTimeRanges = newTimeRanges.length > 0;

        return {
          ...newObj,
          timeRanges: hasNewTimeRanges ? newTimeRanges : [],
          updatedAt: hasNewTimeRanges ? new Date().toISOString() : null,
          isRoleDeleted: false,
        };
      }

      return null;
    })
    .filter(Boolean);
}

export const getRoleIdsByIndexes = (data: any, indexes: any) => {
  const roleIds = indexes.map((index: any) => {
    if (index >= 0 && index < data.length) {
      return data[index].roleId;
    } else {
      return null;
    }
  });

  return roleIds;
};

export const consolidateRoleTotal = (data: any) => {
  let roleTotalCost = 0;
  let roleTotalTime = 0;

  data.forEach((row: any) => {
    roleTotalCost += row.roleTotalCost || 0;
    roleTotalTime += row.roleTotalTime || 0;
  });

  return {
    roleTotalCost,
    roleTotalTime,
    length: data.length,
  };
};

export const replaceRolesInObjectForm = (
  objectForm: any,
  roles: any,
  currentPhase: any,
  currentexsistingapproachTotalCost: any
) => {
  
  const { totalDuration, totalCost, resourceCount, durationType } =
    objectForm[currentPhase];
  const obj = consolidateRoleTotal(roles);
  const updatedObjectForm = {
    approachTotalCost: currentexsistingapproachTotalCost - obj.roleTotalCost,
    phase: {
      [currentPhase]: {
        totalDuration: totalDuration - (obj.roleTotalTime || 0),
        totalCost: totalCost - obj.roleTotalCost,
        resourceCount: resourceCount - (obj.length || 0),
        durationType,
        roles,
      },
    },
  };
  return updatedObjectForm;
};

export const compareArrays = (existingData: any, newData: any) => {
  if (!existingData || !newData || existingData.length !== newData.length) {
    return true; // Differences found or null array
  }

  for (let i = 0; i < existingData.length; i++) {
    const obj1 = existingData[i];
    const obj2 = newData[i];

    if (
      !obj1.timeRanges ||
      !obj2.timeRanges ||
      obj1.timeRanges.length !== obj2.timeRanges.length
    ) {
      return true; // Differences found in timeRanges arrays or null arrays
    }

    for (let j = 0; j < obj1.timeRanges.length; j++) {
      const range1 = obj1.timeRanges[j];
      const range2 = obj2.timeRanges[j];

      for (let key in range1) {
        if (range1[key] !== range2[key]) {
          return true; // Differences found in timeRanges objects
        }
      }
    }

    for (let key in obj1) {
      if (key !== "timeRanges" && obj1[key] !== obj2[key]) {
        return true; // Differences found in non-timeRanges properties
      }
    }
  }

  return false; // No differences found
};

export const sortTimeRange = (timeRangeArray: any[]) => {
  
  return timeRangeArray?.sort((a: any, b: any) => {
    const dateA = new Date(a.end);
    const dateB = new Date(b.end);
    return dateA.getTime() - dateB.getTime();
  });
};

export const buttonEnabler = (existingData: any, newData: any) => {
  if (!Array.isArray(newData) || newData.length === 0) {
    return false; // newData is not an array or has length zero
  } else {
    if (existingData.length === newData.length) {
      for (let i = 0; i < existingData.length; i++) {
        const existingObj = existingData[i];
        const newObj = newData[i];

        if (
          existingObj.role !== newObj.role ||
          existingObj.region !== newObj.region ||
          existingObj.costPerHour !== newObj.costPerHour ||
          existingObj.roleTotalCost !== newObj.roleTotalCost ||
          existingObj.roleTotalTime !== newObj.roleTotalTime
        ) {
          if (
            newObj.role === "" ||
            newObj.region === "" ||
            newObj.costPerHour === "" ||
            newObj.roleTotalCost === "" ||
            newObj.roleTotalTime === "" ||
            newObj.costPerHour === 0 ||
            newObj.roleTotalCost === 0 ||
            newObj.roleTotalTime === 0
          ) {
            return false;
          }
          return true; // Differences found in fields
        }
      }
      return false;
    } else {
      for (let i = 0; i < newData.length; i++) {
        const newObj = newData[i];

        if (
          newObj.role === "" ||
          newObj.region === "" ||
          newObj.costPerHour === null ||
          newObj.roleTotalCost === null ||
          newObj.roleTotalTime === null ||
          newObj.role === " " ||
          newObj.region === " " ||
          newObj.costPerHour === 0 ||
          newObj.roleTotalCost === 0 ||
          newObj.roleTotalTime === 0
        ) {
          return false; // Differences found in fields
        }
      }
      return true;
    }
  }
};

export const dataPersisted = (existingData: any, newData: any) => {
  if (!Array.isArray(newData) || newData.length === 0) {
    return true;
  } else {
    if (existingData.length === newData.length) {
      for (let i = 0; i < existingData.length; i++) {
        const existingObj = existingData[i];
        const newObj = newData[i];
        if (
          existingObj.role !== newObj.role ||
          existingObj.region !== newObj.region ||
          existingObj.costPerHour !== newObj.costPerHour ||
          existingObj.roleTotalCost !== newObj.roleTotalCost ||
          existingObj.roleTotalTime !== newObj.roleTotalTime
        ) {
          if (
            newObj.role === "" &&
            newObj.region === "" &&
            newObj.costPerHour === "" &&
            newObj.roleTotalCost === 0 &&
            newObj.roleTotalTime === 0
          ) {
            return true;
          }
          return false;
        }
      }
      return true;
    } else {
      let isSame = false;
      for (let i = 0; i < newData.length; i++) {
        if (existingData[i] != newData[i]) {
          const newObj = newData[i];
          if (
            newObj.role === "" &&
            newObj.region === "" &&
            newObj.costPerHour === "" &&
            newObj.roleTotalCost === 0 &&
            newObj.roleTotalTime === 0
          ) {
            isSame = true;
          } else {
            isSame = false;
            break;
          }
        }
      }
      return isSame;
    }
  }
};

export const getFullDate = (date: string) => {
  if (!date) return "";
  else {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}-${
      newDate.getMonth() + 1
    }-${newDate.getDate()}`;
  }
};

export const getcurrentTemplateId = (wbs :any, practiceName :any) => {
  // Check if wbs and estimations array exist
  if (wbs && wbs.estimations && wbs.estimations.length > 0) {
      // Find the estimation object for the given practice name
      const estimation = wbs.estimations.find((obj :any) => obj?.practiceRecord?.name === practiceName);
      
      // If estimation object is found, return its templateId
      if (estimation) {
          return estimation.templateId;
      }
  }
  
  // Return null if estimation object is not found
  return null;
};

export function calculateWeeks(startDate: any, endDate: any) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set the start date to the beginning of the week
  const startOfWeek = new Date(start);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  // Set the end date to the beginning of the next week
  const endOfWeek = new Date(end);
  endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 7);

  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(endOfWeek.getTime() - startOfWeek.getTime());

  // Calculate the number of weeks
  const weeks = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));

  return weeks;
}

export function calculateMonths(startDate: any, endDate: any) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  const months = (endYear - startYear) * 12 + (endMonth - startMonth);

  return months + 1;
}

export function getAvailableDates(
  selectedDate: any,
  selectedRanges: any,
  dates: any
) {
  const selectedDateTime = new Date(selectedDate).getTime();

  let nearestDate: any = null;
  let isNearestDateFound = false;
  for (const range of selectedRanges) {
    const startDate = new Date(range.start).getTime();
    if (
      startDate > selectedDateTime &&
      (!nearestDate || startDate < nearestDate)
    ) {
      nearestDate = startDate;
      isNearestDateFound = true;
    }
  }

  if (!isNearestDateFound) {
    return dates;
  }

  let availableDates: any = [];
  for (const date of dates) {
    const currentDate = new Date(date).getTime();
    if (currentDate === nearestDate) {
      return availableDates;
    }
    if (currentDate < nearestDate) {
      availableDates.push(date);
    }
  }

  return availableDates;
}

export function prepareUpdateAndDelete(
  originalObject: any,
  currentPhase: any,
  calendarProps: any
) {
  const filteredObject = {
    approachTotalCost: originalObject?.totalCost,
    phase: {
      [currentPhase]: {
        totalDuration: originalObject[currentPhase].totalDuration,
        totalCost: originalObject[currentPhase].totalCost,
        resourceCount: originalObject[currentPhase].resourceCount,
        durationType: originalObject[currentPhase].durationType,
        // roles: [calendarProps],
        roles: [{ ...calendarProps, isRoleDeleted: false }],
      },
    },
  };

  return filteredObject;
}

export function filterTimeRanges(
  originalObj: any,
  currentPhase: any,
  rangeIdToRemove: any,
  timeRangeCost: any,
  deletionWeeksRange: any
) {
  const updatedRoleTotalCost =
    originalObj.phase[currentPhase].roles[0].roleTotalCost - timeRangeCost;

  const updatedPhaseTotalCost =
    originalObj.phase[currentPhase].totalCost - timeRangeCost;

  const updatedRoleTotalWeek =
    originalObj.phase[currentPhase].roles[0].roleTotalTime - deletionWeeksRange;

  const updatedPhaseTotalWeek =
    originalObj.phase[currentPhase].totalDuration - deletionWeeksRange;
  // Deep clone the original object
  const obj = JSON.parse(JSON.stringify(originalObj));

  // Check if the input object is defined and has the required structure
  if (
    obj &&
    obj.phase &&
    obj.phase[currentPhase] &&
    obj.phase[currentPhase].roles
  ) {
    // Loop through roles
    for (let i = 0; i < obj.phase[currentPhase].roles.length; i++) {
      const role = obj.phase[currentPhase].roles[i];

      // Check if the role has timeRanges
      if (role.timeRanges) {
        // Filter timeRanges to keep only the one with the specified rangeId
        role.timeRanges = role.timeRanges
          .filter((range: any) => range.rangeId === rangeIdToRemove)
          .map((filteredRange: any) => {
            // Remove null values and add "isDeleted" property
            const sanitizedRange = {
              ...filteredRange,
              isDeleted: true,
            };

            // Remove null values
            Object.keys(sanitizedRange).forEach(
              (key) =>
                sanitizedRange[key] === null && delete sanitizedRange[key]
            );

            return sanitizedRange;
          });
      }
    }
    // Update the roleTotalCost with updatedRoleTotalCost
    obj.phase[currentPhase].roles[0].roleTotalCost = updatedRoleTotalCost;
    obj.phase[currentPhase].roles[0].roleTotalTime = updatedRoleTotalWeek;
    obj.phase[currentPhase].totalCost = updatedPhaseTotalCost;
    obj.phase[currentPhase].totalDuration = updatedPhaseTotalWeek;
  }

  return obj;
}

export function getTimeRangeById(mainObject: any, currentPhase: any, id: any) {
  for (const role of mainObject.phase[currentPhase].roles) {
    for (const timeRange of role.timeRanges) {
      if (timeRange.rangeId === id) {
        return timeRange;
      }
    }
  }
  // Return null if no match is found
  return null;
}

export function updateTimeRanges(
  originalObject: any,
  newTimeRange: any,
  currentPhase: any,
  updatedRoleCost: any,
  updatedPhaseTotalCost: any,
  updatedPhaseTotalWeek: any,
  updatedRoleWeek: any
) {
  // Check if the original object has the necessary structure
  if (
    !originalObject ||
    !originalObject.phase ||
    !originalObject.phase[currentPhase] ||
    !originalObject.phase[currentPhase].roles
  ) {
    console.error("Invalid object structure");
    return originalObject;
  }

  // Update the timeRanges array with the new object
  originalObject.phase[currentPhase].totalCost = updatedPhaseTotalCost;
  originalObject.phase[currentPhase].totalDuration = updatedPhaseTotalWeek;

  // Update the timeRanges array with the new object
  originalObject.phase[currentPhase].roles.forEach((role: any) => {
    // console.log("Update check", role.roleTotalCost);
    // role.timeRanges = [newTimeRange];
    role.timeRanges = [Object.assign({}, newTimeRange, { isDeleted: false })];
    role.roleTotalCost = updatedRoleCost;
    role.roleTotalTime = updatedRoleWeek;
  });

  return originalObject;
}

import { WeekValue } from "../constants/types/ResourcePlanningtypes/CalenderTypes";

export const createObject = (
  updateData :any,
  start :string,
  end :string,
  hourPerDuration :number,
  rangeCost :number,
  allocatedPercentageValue :number,
  startMonthRange :string | null,
  endMonthRange :string | null,
  hpd :number | null,
  week :WeekValue | null,
  durationType: string,
  allocated :boolean,
  isChecked :boolean) => {      
    let obj = {}
    if(updateData.rangeId !== null){
      Object.assign(obj,
        {
          rangeId: updateData.rangeId,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          createdBy: updateData.createdBy,
          createdAt: updateData.createdAt,
          updatedBy: "Bounteous",
          updatedAt: new Date().toISOString()
        })
    }
    else{
      Object.assign(obj,
        {
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          createdBy: "Bounteous",
          createdAt: new Date().toISOString()
        })
    }
    if(isChecked){
      Object.assign(obj, {
        hourPerDuration: hourPerDuration,
        rangeCost: rangeCost,
      })
    }
    else if (durationType == "Weekly"){
      if(allocated){
        Object.assign(obj,{
          hourPerDuration: hourPerDuration,
          rangeCost: rangeCost,
          allocationPercentage: allocatedPercentageValue,
          hourPerDay: hpd,
        })
      }
      else{
        Object.assign(obj,{
          hourPerDuration: hourPerDuration,
          rangeCost: rangeCost,
          allocationPercentage: allocatedPercentageValue,
          fractionalWeekHours: week,
        })
      }
    }
    else{
      if(allocated){
        Object.assign(obj,{
          hourPerDuration: hourPerDuration,
          rangeCost: rangeCost,
          allocationPercentage: allocatedPercentageValue,
          hourPerDay: hpd,
        })
      }
      else{
        Object.assign(obj,{
          hourPerDuration: hourPerDuration,
          rangeCost: rangeCost,
          allocationPercentage: allocatedPercentageValue,
          startMonthRange: startMonthRange,
          endMonthRange: endMonthRange,
          hourPerDay: hpd,
        })
      }
    }
  return obj
};