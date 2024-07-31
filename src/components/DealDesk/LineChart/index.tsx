"use client"
import React, { useState, useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import DonutChartComponent from "../DonutChart";
import { fetchLinechartData, fetchLinechartStatus, getLinechart } from "@/features/dealDesk/linechartSlice";
import { AppDispatch } from "@/features/store";
import { useSearchParams } from 'next/navigation';

const LineChartComponent = () => {
    let ReactApexChart;
    if (typeof window !== 'undefined') {
        ReactApexChart = require("react-apexcharts").default;
    }
    const dispatch = useDispatch<AppDispatch>();
    const lineData = useSelector(fetchLinechartData);
    const status = useSelector(fetchLinechartStatus);
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: string | null = searchParams.get('projectId');
    const [chartData, setChartData] = useState<any>({
        series: [
            {
                name: 'Total',
                data: [20, 25, null, 22, null, 20, 22, 25, null, null, 12, null, 14, null]
            },
            {
                name: 'Discover',
                data: [5, 5, 10, 8, 7, 5, 4, 59, 15, 60, 10, 10, 7, 8]
            },
            {
                name: 'Conceive',
                data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null]
            },
            {
                name: 'Build',
                data: [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null]
            },
        ],
        options: {
            chart: {
                height: '350',
                type: 'line',
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: true
                }
            },
            stroke: {
                width: [5, 5, 4],
                curve: 'straight'
            },
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            yaxis: {
                title: {
                    text: 'Resource Count'
                },
                // min: 5,
                // max: 40
            },
            xaxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                // categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',],
                title: {
                    text: 'Duration (Weeks)'
                }
            },
        },
    });

    useEffect(() => {
        dispatch(getLinechart(projectId));
    },[]);

    useEffect(() => {
        setseries()
    }, [status])

    const setseries = () => {
        const size: number[] = [];
        const newseries = chartData?.series.map((currentSeries:any) => {
            const currentLineData = lineData?.find((current: any) => current.name == currentSeries.name.toLowerCase()); 
            const len = currentLineData?.resources?.length - 1
            const arr = new Array(currentLineData?.resources[len]?.week).fill(null);
            const limit =currentLineData?.resources[len]?.week;
            currentLineData?.resources?.forEach((resources :any)=>{
                arr[resources?.week-1] = resources?.resourceCount;  
            })
            if(currentLineData?.name == "total"){
                for(let i=1;i<=limit;i++){
                    size.push(i)
                } 
            }            
            return { name: currentSeries.name, data: arr  }
        })
        setChartData({
            ...chartData, 
            series: newseries,
            options: { ...chartData.options, labels: size }
        })
    }
    return (
        <div className="flex justify-between">
            <div id="chart" className="w-2/3">
                <ReactApexChart options={chartData.options} series={chartData.series} type='line' height='350' />
            </div>
            <div className="w-1/3">
                <DonutChartComponent />
            </div>
        </div>
    );
};

export default LineChartComponent;