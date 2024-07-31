import { MonthOrWeek } from "../enums/statusEnums";

export const debounce = (func: any, timeout?: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(this, args);
    }, (timeout || 300));
  };
};

export const calulateTotalDurationBasedOnDurationType = (count: number, type: string) => type === MonthOrWeek.WEEKLY ? count : Math.ceil((count * 30) / 7)