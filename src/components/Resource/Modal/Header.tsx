import React from 'react';
import { MonthOrWeek } from "@/helper/enums/statusEnums";
import {HeaderProps} from "@/helper/constants/types/ResourcePlanningtypes/CalenderTypes"

function Header({ calendarProps, durationType }: HeaderProps) {
  return (
    <div className="text-white h-7 w-[65%] bg-blue-900 rounded-br-3xl p-1 text-left text-sm">
      <span className="px-3">
        <h4 className="inline font-bold">Role: </h4>
        <p className="inline font-semibold">{calendarProps.roleName}</p>
      </span>
      <span className="px-4">
        <h4 className="inline font-bold">Cost/Hour: </h4>
        <p className="inline font-semibold">$ {calendarProps.costPerHour}</p>
      </span>
      <span className="px-4">
        <h4 className="inline font-bold">View: </h4>
        <p className="inline font-semibold">
          {durationType === MonthOrWeek.MONTHLY
            ? MonthOrWeek.MONTHLY
            : MonthOrWeek.WEEKLY}
        </p>
      </span>
    </div>
  );
}

export default Header;
