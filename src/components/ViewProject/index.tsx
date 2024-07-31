import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppDispatch } from "../../features/store";
import { fetchCurrentProject,fetchEngagementType, getProjectById, fetchPractices, fetchProjectType, fetchVertical } from "../../features/Info/createInfoSlice";
import Image from "next/image";
import NextImg from "../../../public/assets/images/right.png";
import { setFinalised } from "@/features/summary/summarySlice";

const ViewProject = () => {
    // Parse the URL parameters
    const searchParams = new URLSearchParams(useSearchParams().toString());
    // Get the value of the 'projectId' parameter
    const projectId: any = searchParams.get('projectId');

    const dispatch = useDispatch<AppDispatch>();
    const infoDetails = useSelector(fetchCurrentProject);
    console.log("infoDetails", infoDetails)
    const engagementType = infoDetails?.engagementTypeId === 2 ? true : false

    const verticals = useSelector(fetchVertical);
    const practiceList = useSelector(fetchPractices);
    const projectTypeList = useSelector(fetchProjectType);
    const engagementTypes = useSelector(fetchEngagementType);

    useEffect(() => {
        dispatch(getProjectById(projectId));
        dispatch(setFinalised(false));
    }, []);

    const data = [
        { label: "Project Name", value: infoDetails?.projectName, },
        { label: "Vertical", value: verticals.find((item: { id: any; }) => item.id === infoDetails?.verticalId)?.name},
        { label: "Account Name", value: infoDetails?.clientName, },
        {
            label: "Project Type", value: Array.isArray(infoDetails?.projectTypeIds) ?
            infoDetails?.projectTypeIds.map((id: any) => (projectTypeList.find((item: { id: any; }) => item.id === id)?.name || "")).join(", ") : "",
        },
        { label: "Engagement Type", value: engagementTypes.find((item: { id: any; }) => item.id === infoDetails?.engagementTypeId)?.name },
        { label: "Pursuit Lead", value: infoDetails?.pursuitLead, },
        { label: "Estimation Owner", value: infoDetails?.estimationOwner, },
        { label: "Opportunity ID", value: infoDetails?.opportunityId, },
        {
            label: "Practice",
            value: Array.isArray(infoDetails?.practiceIds) ?
            infoDetails?.practiceIds.map((id: any) => (practiceList.find((item: { id: any; }) => item.id===id)?.name)).join(", ") : "",
        },
        { label: "Description", value: infoDetails?.description },
        { label: "Oppurtunity Link", value: infoDetails?.opportunityLink, },
    ];

    return (
        <div>
            <h1 className="px-2 pb-2 font-bold text-[#01105F] text-2xl">PURSUIT INFORMATION</h1>
            <div id="infoBg" className="bg-white rounded-xl shadow-md">
                <div id="infoC" className="p-5">
                    <div className="grid grid-cols-12 gap-y-10 m-10 box-border">
                        {data.map((item, index) => (
                            <div key={index} className={`${index === 0 || index === 10 ? "col-span-12":"col-span-4"} 
                                border-l-4 pl-4 border-[#BEEE00] border-800 text-[#FFF]`}>
                                <p className="divide-y-2 divide-white-300 font-semibold text-md">{item.label}</p>
                                <p className={index === 0 ? "text-sm" : ""}>{item.value}</p>
                            </div>
                        ))}
                        <div className="sm:col-span-4 flex justify-between">
                            {engagementType ? (
                                <Link href={`/wbs?projectId=${projectId}`}>
                                    <button className="estimation-btn rounded-lg p-2 flex items-center space-x-1">
                                        WBS Section
                                        <Image className="icon-button rounded-xl" src={NextImg} width={20} height={20} alt="" />
                                    </button>
                                </Link>
                            ) : (
                                <Link href={`/resource?projectId=${projectId}`}>
                                    <button className="resource-btn rounded-lg p-2 flex items-center space-x-1">
                                        Resource Section
                                        <Image className="icon-button rounded-xl" src={NextImg} width={20} height={20} alt="" />
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProject;
