import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { fetchEffortDistributionData, getEffortDistribution } from "@/features/dealDesk/effortDistributionSlice";

export default function triangle() {

  const dispatch = useDispatch<AppDispatch>();
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: any = searchParams.get("projectId");

  useEffect(() => {
    dispatch(getEffortDistribution(projectId));
  },[]);

  const effortDistributionData: any = useSelector(fetchEffortDistributionData);
  return (
    <div className="w-[85%] flex justify-center drop-shadow-[1.25em_0.75em_0.1em_rgba(0,0,0,0.2)]">
      <div className="h-[63vh] w-[55vw] absolute bg-white [clip-path:polygon(38%_0%,10%_100%,28.5%_100%,50%_0%)] flex">
        <div className="self-end">
          <p className="absolute right-[74%] bottom-[19%] text-end text-[0.7vw] font-bold">
            Total Cost
          </p>
          <p className="absolute right-[75%] bottom-[14%] text-end text-[1vw] font-bold">
            ${effortDistributionData?effortDistributionData[3]?.totalCost:0}
          </p>
          <p className="absolute right-[76%] bottom-[9%] text-end text-[0.7vw] font-bold">
            Total Time(Hrs)
          </p>
          <p className="absolute right-[78%] bottom-[4%] text-end text-[1vw] font-bold">
          {effortDistributionData?effortDistributionData[3]?.totalTime:0}
          </p>
        </div>
      </div>
      <div className="h-[63vh] w-[55vw] absolute bg-gradient-to-t from-gray-100 from-30% via-white via-35% to-white [clip-path:polygon(38%_0%,17.1%_74.5%,37%_74.5%,50%_0%)] flex">
        <div className="self-end">
          <p className="absolute right-[67%] bottom-[43%] text-end text-[0.7vw] font-bold">
            Total Cost
          </p>
          <p className="absolute right-[68%] bottom-[38%] text-end text-[1vw] font-bold">
          ${effortDistributionData?effortDistributionData[2]?.totalCost:0}
          </p>
          <p className="absolute right-[69.5%] bottom-[33%] text-end text-[0.7vw] font-bold">
            Total Time(Hrs)
          </p>
          <p className="absolute right-[71%] bottom-[28%] text-end text-[1vw] font-bold">
          {effortDistributionData?effortDistributionData[2]?.totalTime:0}
          </p>
        </div>
      </div>
      <div className="h-[63vh] w-[55vw] absolute bg-gradient-to-t from-gray-100 from-55% via-white via-57% to-white [clip-path:polygon(38%_0%,23.7%_50.8%,44.5%_50.8%,50%_0%)] flex">
        <div className="self-end">
          <p className="absolute right-[61%] bottom-[64%] text-end text-[0.7vw] font-bold">
            Total Cost
          </p>
          <p className="absolute right-[62%] bottom-[59%] text-end text-[1vw] font-bold">
          ${effortDistributionData?effortDistributionData[1]?.totalCost:0}
          </p>
          <p className="absolute right-[63%] bottom-[55%] text-end text-[0.7vw] font-bold">
            Total Time(Hrs)
          </p>
          <p className="absolute right-[65%] bottom-[50%] text-end text-[1vw] font-bold">
          {effortDistributionData?effortDistributionData[1]?.totalTime:0}
          </p>
        </div>
      </div>
      <div className="h-[63vh] w-[55vw] absolute bg-gradient-to-t from-black via-gray-200 to-white [clip-path:polygon(38%_0%,30%_28.5%,50%_28.5%,50%_0%)] flex">
        <div className="self-end">
          <p className="absolute right-[54%] bottom-[89%] text-end text-[0.7vw] font-bold">
            Total Cost
          </p>
          <p className="absolute right-[55%] bottom-[84%] text-end text-[1vw] font-bold">
          ${effortDistributionData?effortDistributionData[0]?.totalCost:0}
          </p>
          <p className="absolute right-[56%] bottom-[79%] text-end text-[0.7vw] font-bold">
            Total Time(Hrs)
          </p>
          <p className="absolute right-[58%] bottom-[74%] text-end text-[1vw] font-bold">
          {effortDistributionData?effortDistributionData[0]?.totalTime:0}
          </p>
        </div>
      </div>
      <div className="h-[63vh] w-[35vw] absolute bg-[#885AD5] [clip-path:polygon(50%_0%,5%_100%,95%_100%,50%_0%)] flex justify-center">
        <div className="absolute self-end flex-col">
          <p className="text-[3vw] leading-none text-white font-bold text-center">{effortDistributionData?effortDistributionData[3]?.count:0}</p>
          <p className="mb-2 text-[0.9vw] text-white font-bold text-center">
            ({effortDistributionData?effortDistributionData[3]?.percentage:0}%)
          </p>
          <p className="mb-2 text-[0.9vw] font-extrabold text-white text-center">
            Associates
          </p>
        </div>
      </div>
      <div className="h-[55vh] w-[30vw] absolute bg-gradient-to-b from-black via-black to-transparent [clip-path:polygon(50%_0%,11%_85.5%,95.8%_100%,50%_0%)]"></div>
      <div className="h-[47vh] w-[26vw] absolute bg-[#5353C1] [clip-path:polygon(50%_0%,4.8%_100%,95.2%_100%,50%_0%)] flex justify-center">
        <div className="absolute self-end flex-col">
          <p className="text-[2.5vw] leading-none text-white font-bold text-center">{effortDistributionData?effortDistributionData[2]?.count:0}</p>
          <p className="mb-1 text-[0.9vw] text-white font-bold text-center">
            ({effortDistributionData?effortDistributionData[2]?.percentage:0}%)
          </p>
          <p className="mb-1 text-[0.9vw] font-extrabold text-white text-center">
            Senior
          </p>
        </div>
      </div>
      <div className="h-[38vh] w-[21vw] absolute bg-gradient-to-b from-black via-black to-transparent [clip-path:polygon(50%_0%,12%_84%,95.3%_100%,50%_0%)]"></div>
      <div className="h-[32vh] w-[18vw] absolute bg-[#4198D6] [clip-path:polygon(50%_0%,5.5%_100%,94.5%_100%,50%_0%)] flex justify-center">
        <div className="absolute self-end flex-col">
          <p className="text-[2.3vw] text-white font-bold text-center">{effortDistributionData?effortDistributionData[1]?.count:0}</p>
          <p className="text-[0.8vw] text-white font-bold text-center">
            ({effortDistributionData?effortDistributionData[1]?.percentage:0}%)
          </p>
          <p className="mb-1 text-[0.9vw] font-extrabold text-white text-center">
            Leads
          </p>
        </div>
      </div>
      <div className="h-[21vh] w-[13vw] absolute bg-gradient-to-b from-black via-black to-transparent [clip-path:polygon(50%_0%,16%_85%,90.5%_100%,50%_0%)]"></div>
      <div className="h-[18vh] w-[11vw] absolute bg-[#36C3CD] [clip-path:polygon(50%_0%,9%_100%,91%_100%,50%_0%)] flex justify-center">
        <div className="absolute self-end flex-col">
          <p className="text-[2vw] leading-none text-white font-bold text-center">{effortDistributionData?effortDistributionData[0]?.count:0}</p>
          <p className="mb-1 text-[0.8vw] text-white font-bold text-center">
            ({effortDistributionData?effortDistributionData[0]?.percentage:0}%)
          </p>
          <p className="mb-2 text-[0.9vw] font-extrabold text-white text-center">
            Executives
          </p>
        </div>
      </div>
    </div>
  );
}
