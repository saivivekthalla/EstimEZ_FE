import circleChart from "../../../../public/assets/images/Circle Chart.svg";
import Image from "next/image";
import "../../../styles/dealDesk.scss";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppDispatch } from "@/features/store";
import { getFractionalAllocation, fetchFractioanlAllocationData } from "@/features/dealDesk/fractionalAllocationSlice"
import React from "react";

export default function fractionalAllocation() {
  let ReactApexChart;
  if (typeof window !== 'undefined') {
    ReactApexChart = require("react-apexcharts").default;
  }
  const dispatch = useDispatch<AppDispatch>();
  const FAData = useSelector(fetchFractioanlAllocationData);
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: string | null = searchParams.get("projectId");

  useEffect(() => {
    dispatch(getFractionalAllocation(projectId));
  }, [])

  let [series, setSeries] = useState([
    {
      name: "",
      data: [],
    },
  ]);
  let [options, setOptions] = useState({});
  let [nameRegion, setNameRegion] = useState("");

  // Custom sorting function based on year and then month
  const customSort = (a: string, b: string): number => {
    const yearA = parseInt(a.split(" ")[1]);
    const yearB = parseInt(b.split(" ")[1]);
    const monthA = a.split(" ")[0];
    const monthB = b.split(" ")[0];

    if (yearA !== yearB) {
      return yearA - yearB;
    }

    // If the years are the same, sort by month
    const monthsOrder = ["Jan'", "Feb'", "Mar'", "Apr'", "May'", "Jun'", "Jul'", "Aug'", "Sep'", "Oct'", "Nov'", "Dec'"];
    return monthsOrder.indexOf(monthA) - monthsOrder.indexOf(monthB);
  };

  const getHoursMap = (data: any) => {

    const hoursMap: Record<string, number[]> = {};
    const weeks: string[] = ["week1", "week2", "week3", "week4", "week5", "week6"]; // Assuming a maximum of 6 weeks
    weeks.forEach((week) => {
      hoursMap[week] = Array(data.length).fill(0);
    });

    data?.forEach((item: any, monthIndex: any) => {
      weeks.forEach((week, weekIndex) => {
        if (item.weekrange[week]) {
          hoursMap[week][monthIndex] = item.weekrange[week];
        }
      });
    });

    return hoursMap;
  }

  function showModal(name: any, region: any, allocation: any) {
    let modal = document.getElementById("myModal");
    if (modal != null) modal.style.display = "block";

    let disabler = document.getElementById("disabler");
    if (disabler != null) disabler.style.display = "block";

    const formattedDates: string[] = allocation.map((item: any) => `${item.month.charAt(0).toUpperCase()}${item.month.slice(1)}' ${(item.year % 100).toString().padStart(2, '0')}`);
    formattedDates.sort(customSort);
    const hoursMap: any = getHoursMap(allocation);

    setNameRegion(name + " - " + region);
    setSeries([
      {
        name: "1st Week",
        data: hoursMap?.week1,
      },
      {
        name: "2nd Week",
        data: hoursMap?.week2,
      },
      {
        name: "3rd Week",
        data: hoursMap?.week3,
      },
      {
        name: "4th Week",
        data: hoursMap?.week4,
      },
      {
        name: "5th Week",
        data: hoursMap?.week5,
      },
      {
        name: "6th Week",
        data: hoursMap?.week6,
      },
    ]);
    setOptions({
      chart: {
        id: "simple-bar",
      },
      xaxis: {
        categories: formattedDates,
      },
      yaxis: {
        tickAmount: 5,
        title: {
          text: "Hours",
        },
      },
      dataLabels: {
        formatter: function (value: any) {
          return value > 0 ? value : ''
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#000000'],
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "90%",
          dataLabels: {
            position: 'top',
          }
        },
      },
    });
  }

  function closeModal() {
    let modal = document.getElementById("myModal");
    if (modal != null) modal.style.display = "none";

    let disabler = document.getElementById("disabler");
    if (disabler != null) disabler.style.display = "none";
  }

  return (
    <div>
      <div id="disabler" className="w-full h-full hidden top-0 left-0 z-10 absolute bg-[#00000050]"></div>
      <div
        id="myModal"
        className="modal hidden fixed m-auto z-20 inset-0 w-[83%] h-[83%]"
      >
        <div className="modal-content h-full bg-[#fefefe] absolute  m-auto right-0 left-0 p-[20px] w-full rounded-xl">
          <span
            className="close text-[#aaa] float-right text-2xl font-bold cursor-pointer"
            onClick={closeModal}
          >
            &times;
          </span>
          <p className="text-2xl font-bold mb-3">{nameRegion}</p>
          <div className="overflow-x-auto h-full w-full text-xs">
            <ReactApexChart
              type="bar"
              options={options}
              series={series}
              height='90%'
              width='100%'
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <p className="text-2xl font-bold mb-3">Fractional Allocation</p>
        <p className="text-2xl font-bold mb-3">{FAData.length == null ? 0 : FAData.length} Records</p>
      </div>
      <div
        className="bg-border-spacing-5 rounded-t-3xl rounded-b-3xl
            bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#885AD525]
            to-[#885AD550] w-full relative h-72"
      >
        <Image
          src={circleChart}
          alt="image"
          height={220}
          width={220}
          className="absolute bottom-0"
        ></Image>
        <table className="bg-border-spacing-5 rounded-t-3xl rounded-b-3xl w-full absolute">
          <thead className="flex w-full ">
            <tr className="flex w-full text-white mb-3 drop-shadow-[0_0.5rem_0.2rem_rgba(0,0,0,0.2)]">
              <th className="p-4 bg-[#885AD5] rounded-l-full w-[40%]">Roles</th>
              <th className="p-4 bg-[#A480DF] shadow-[inset_5px_0px_5px_#00000040] w-[30%]">
                Phase
              </th>
              <th className="p-4 bg-[#BEA4E8] shadow-[inset_5px_0px_5px_#00000040] rounded-r-full w-[30%]">
                Region
              </th>
            </tr>
          </thead>
          <tbody className="flex flex-col items-center justify-between p-3">
            <div className="overflow-y-auto w-full h-48 ">
              {FAData.length > 0 ? (
                FAData?.map((item: any) => (
                  <tr className="w-full">
                    <td className="w-[30rem] h-[50px]">
                      <a
                        href="#"
                        className="underline text-[#01105F] pl-[35%]"
                        onClick={() => {
                          showModal(item.role.name, item.region.code, item.range);
                        }}
                      >
                        {item.role.name}
                      </a>
                    </td>
                    <td className="w-[24rem] h-[50px] pl-[12%] capitalize">{item.phase}</td>
                    <td className="w-[21rem] h-[50px] text-center">{item.region.code}</td>
                  </tr>
                ))
              ) : (
                <div className="w-full h-full font-semibold flex items-center justify-center">
                  <p>No Data Available</p>
                </div>
              )}
            </div>
          </tbody>
        </table>
      </div>
    </div>
  );
}