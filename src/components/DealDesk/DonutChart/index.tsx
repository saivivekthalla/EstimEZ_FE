"use client"
import { fetchDonutchartData, fetchDonutchartStatus, getDonutchart } from "@/features/dealDesk/linechartSlice";
import { AppDispatch } from "@/features/store";
import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { useSearchParams } from 'next/navigation';

const DonutChartComponent = () => {
    let ReactApexChart;
    if (typeof window !== 'undefined') {
        ReactApexChart = require("react-apexcharts").default;
    }
    const dispatch = useDispatch<AppDispatch>();
    const donutData = useSelector(fetchDonutchartData);
    const status = useSelector(fetchDonutchartStatus);
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: string | null= searchParams.get('projectId');
    useEffect(() => {
        dispatch(getDonutchart(projectId))
    }, []);
    useEffect(() => {
        if (status)
            setDonut()
    }, [status]);
    const [chartData, setChartData] = useState<any>({
        series: [50,50],
        options: {
            chart: {
                id: "donutChart",
                width: 380,
                type: 'donut',
            },
            dataLabels: {
                enabled: true
            },
            fill: {
                type: 'gradient',
            },
            labels: ["Off-shore", "On-shore"],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                }
            }],
            legend: {
                offsetY: 100,
                offsetX: 120,
                floating :true
            },
            tooltip:{
                enabled: true,
                y:{
                    formatter: function(value :any){return value.toFixed(2)}
                }
            }
        },
    });

    const setDonut=()=>{
        const newSeries = [donutData?.offshore?.percentage, donutData?.onshore?.percentage]
        setChartData({ ...chartData, series: newSeries })
    }
    return (
        <div className="chart-wrap">
            <div id="chart">
                <ReactApexChart options={chartData.options} series={chartData.series} type="donut" width={380} />
            </div>
        </div>
    );
};


export default DonutChartComponent;