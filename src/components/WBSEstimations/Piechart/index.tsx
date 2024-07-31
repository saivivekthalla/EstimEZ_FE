import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Image from "next/image";
import Highcharts, { Options } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchMasterTemplate, getWbsEstimationDetails } from "@/features/wbs/wbsSlice";
import { useSelector } from 'react-redux';

interface chartProps {
    isCollapse: boolean,
    setIsCollapse: Dispatch<SetStateAction<boolean>>
};

const HighChartDetails = (props: chartProps) => {
    const [collapseImage, setCollapseImage] = useState<JSX.Element | null>(null);
    const [noContentImage, setNoContentImage] = useState<JSX.Element | null>(null); 
    const getDetails = (name: string) => {
        const value = series.filter((data: any) => data.name == name)
        return `Simple: ${value[0]?.simple} \n Medium: ${value[0]?.medium} Complex: ${value[0]?.complex}`
    }
    const data: Array<Object> = useSelector(getWbsEstimationDetails)
    const masterTemplate: any = useSelector(fetchMasterTemplate);
    const getCategoryName = (id: number) => {
        return masterTemplate[0]?.content?.taskDetails[id - 1]?.taskName;
    }

    useEffect(() => {
        import('public/assets/svg/Collapse.svg').then(module => {
            setCollapseImage(<Image src={module.default} alt="Collapse" height={40} />);
        });
        import('public/assets/svg/no-content.svg').then(module => {
            setNoContentImage(<Image  src={module.default} alt="No Content" height={60} width={60} />);
        });
    }, []);

    let sum = 0;
    const filteredData = data?.filter((obj: any) => obj.totalHours > 0)
    const series: any = filteredData?.map((obj: any) => {
        sum += obj.totalHours;
        return { name: typeof (obj.category) == 'number' ? getCategoryName(obj.category) : obj.category, y: obj.totalHours, simple: obj.simple, medium: obj.medium, complex: obj.complex }
    });

    const options: Options = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'pie',
            backgroundColor: "rgba(255, 255, 255, 0.0)",
            margin: props.isCollapse == false && series?.length <= 12 ? (series?.length == 0 ? [30, 0, 150, 0] : [35, 0, 140, 0]) : [30, 0, 0, 0],
            height: "90%"
        },
        colors: ['#5470C6', '#FAC858', '#EE6666', '#73C0DE', '#91CC75'],
        title: {
            text: 'Estimation Summary',
            align: 'center',
            style: {
                fontSize: props.isCollapse ? '15px' : '18px'
            }
        },
        subtitle: {
            floating: true,
            useHTML: true,
            text: props.isCollapse == false && sum == 0 ? `<div style="margin-top: -40%;">To view the summary,<br/> kindly input the hours</div>` : '',
            align: "center",
            verticalAlign: "middle",
            widthAdjust: -50,
            style: {
                fontWeight: 'bold',
                color: 'black',
                fontSize: '75%'
            }
        },
        plotOptions: {
            pie: {
                showInLegend: props.isCollapse ? false : series?.length > 12 ? false : true,
                innerSize: sum > 0 ? '50%' : '60%',
            },
            series: {
                allowPointSelect: true,
                cursor: 'pointer',
            }
        },
        tooltip: {
            enabled: sum > 0 ? props.isCollapse ? false : true : false,
            formatter: function () {
                return getDetails(this.point.name);
            },
            followPointer: false
        },
        series: [
            {
                data: sum > 0 ? series : [{ name: "noData", y: 100 }],
                type: "pie",
                dataLabels: [{
                    enabled: sum > 0 ? true : false,
                    y: 2,
                    format: props.isCollapse ? '{point.name}' : `{point.name}<br/> <span style="font-size:10px;">{y} hrs</span>`,
                    style: {
                        fontSize: props.isCollapse ? '8px' : '12px',
                        fontWeight: 'normal',
                        textOutline: 'none'
                    },
                }, {
                    enabled: sum > 0 ? props.isCollapse ? false : true : false,
                    distance: -20,
                    format: '{point.percentage:.1f}%',
                    style: {
                        fontSize: '12px',
                        textOutline: 'none',
                        opacity: 0.7
                    },
                    filter: {
                        operator: '>',
                        property: 'percentage',
                        value: 2
                    }
                }]
            }],
        legend: {
            enabled: sum > 0 ? true : false,
            layout: "horizontal",
            floating: true,
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                fontSize: "12px",
            },
        },
        exporting: {
            enabled: false
        }
    };
    return (
        <div className="relative flex flex-col">
            <button hidden={props.isCollapse} onClick={() => props.setIsCollapse(true)}
                className="absolute right-5 -top-1 z-10">
                {collapseImage}
            </button>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <div className='absolute top-[25%] right-[45%]' hidden={props.isCollapse || sum != 0}>{noContentImage}</div>
            <button hidden={props.isCollapse == false} onClick={() => props.setIsCollapse(false)}
                className="bg-[#885AD5] mt-2 self-center w-fit rounded-xl text-white text-sm font-light px-3">
                Expand Summary Chart
            </button>
        </div>
    )
}
export default HighChartDetails