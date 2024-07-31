import { InfoDashboardTexts } from "@/helper/constants/textName";
import { useEffect, useState } from 'react';

const CreateEstimation = () => {

  let [timeOfDay,settimeOfDay] = useState("Morning!");

  useEffect(() => {
    const hours = new Date().getHours();
    if(hours >= 0 && hours< 12){
      settimeOfDay("Morning!");
    }else if(hours >= 12 && hours < 18){
      settimeOfDay("Afternoon!");
    }else if(hours >= 18 && hours < 24){
      settimeOfDay("Evening!");
    }
  },[]);

  return (
    <div className="px-3 w-43 min-w-[200px]">
      <div className="grid grid-cols-1 gap-2">
        <div className="sm:col-span-10">
          <div className="relative">
            <h4 className="text-3xl font-medium mb-2">
              {InfoDashboardTexts.welcomeMessage + timeOfDay}
            </h4>
            <h5 className="text-xl typography-heading">
              {InfoDashboardTexts.name}
            </h5>
            <div className="relative rounded-xl bg-[#ACD7FF8F] mx-10 mt-5">
              <div className="p-4 pb-10">
                <p className="text-base">
                  {InfoDashboardTexts.aboutSection}
                </p>
              </div>
            </div>
            <div className="flex absolute -bottom-10 left-1/2 -translate-x-1/2 justify-center items-center p-4">
              <a href="/projectinfo">
                <button className="button-styled">
                  {InfoDashboardTexts.createEstimation}
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEstimation;

