import React from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteIcon from "../../../public/assets/svg/delete-icon.svg";
import EditIcon from "../../../public/assets/svg/edit-icon.svg";
import ForwardIcon from "../../../public/assets/svg/forward-icon.svg";
import toolTip from "../../../public/assets/images/toolTip.svg";
import PlusIcon from "../../../public/assets/svg/plus-icon.svg"
import {
    setBuildDurationType,
    setConceiveDurationType,
    setCurrentPhase,
    setDiscoverDurationType,
  } from "../../features/resource/resourcePlanningSlice";
import { useSearchParams } from "next/navigation";
import { newApproachCardStyle } from ".";

const ResourceDataCard = ({ resourceList, currentCardsOnPage, deleteData, strategyMapping, strategyMappingDescription, engagementType, setShowTooltip, showTooltip, handleOpen, dispatch, getProjectById} :any) => {
    const searchParams = new URLSearchParams(useSearchParams());
    const projectId: any = searchParams.get("projectId");
    const engagementTypeLabel = "Fixed Scope - Projects";

    
    return (
        <section className="grid grid-cols-3 gap-2 px-3 gap-y-8 w-full">
            {resourceList && resourceList.length > 0 ? (
                currentCardsOnPage?.map((each: any, index: number) => {
                    const strategyName = strategyMapping[each.wbs_strategy_id] || "N/A";
                    const strategyDescription =
                        strategyMappingDescription[each.wbs_strategy_id] || "N/A";
                    return (
                        <section className="w-80">
                            <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-78  h-62">
                                <div>
                                    <div className="h-24">
                                        <div className="mb-2">
                                            <div className="flex justify-between p-4 pb-0 h-12">
                                                <div className="font-bold  text-sm w-48 break-words whitespace-pre">
                                                    {each.approachName}
                                                </div>
                                                <div className="flex">
                                                    <button>
                                                        <Image
                                                            src={DeleteIcon}
                                                            onClick={() => deleteData([each.approachId])}
                                                            alt="My Image"
                                                            width={30}
                                                            height={20}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {engagementType === engagementTypeLabel && (
                                            <div className="font-bold  pl-4 text-sm w-48 h-12 break-words">
                                                {strategyName}
                                                <div className="relative inline-block">
                                                    <Image
                                                        src={toolTip}
                                                        alt="image"
                                                        height={15}
                                                        width={15}
                                                        className="inline ml-1 mb-1 cursor-pointer"
                                                        onMouseEnter={() => setShowTooltip(index)}
                                                        onMouseLeave={() => setShowTooltip(-1)}
                                                    />

                                                    <div className={`ml-1 text-xs absolute opacity-100 left-full top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-2 rounded 
                                                        ${showTooltip === index ? "block" : "hidden"}`}
                                                        style={{ maxWidth: "8rem" }}
                                                    >
                                                        {strategyDescription}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 w-80 h-24 break-words">
                                        {each.description}
                                    </div>
                                </div>
                                <div className={`h-14 text-zinc-50 font-bold text-sm bg-blue-400 p-4 flex justify-between items-center`}>
                                    <div>
                                        <p className="">Total Cost</p>
                                        <p className="text-lg">
                                            {each.totalCost !== null ? `$${each.totalCost}` : `$${0}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button>
                                            <Image
                                                className="bg-white rounded-full p-1"
                                                onClick={() => {
                                                    handleOpen(index, "updating");
                                                }}
                                                src={EditIcon}
                                                alt="My Image"
                                                width={30}
                                                height={30}
                                            />
                                        </button>
                                        <button
                                            onClick={() => {
                                                dispatch(setCurrentPhase("discover"));
                                                dispatch(setDiscoverDurationType(""));
                                                dispatch(setBuildDurationType(""));
                                                dispatch(setConceiveDurationType(""));
                                                dispatch(getProjectById(projectId));
                                            }}
                                        >
                                            <Link href={`/resource/estimation?projectId=${projectId}&approachId=${each.approachId}`}>
                                                <Image
                                                    className="bg-white rounded-full"
                                                    src={ForwardIcon}
                                                    alt="My Image"
                                                    width={30}
                                                    height={30}
                                                />
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })
            ) : (
                <div className="border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                    style={newApproachCardStyle}
                    onClick={() => handleOpen(null)}>
                    <button className="focus:outline-none p-3">
                        <Image src={PlusIcon} alt={"AddIcon"}/>
                    </button>
                    <p className="text-md font-semibold text-gray-400">Create new Approach</p>
                </div>
            )}
        </section>
    );
};


export default ResourceDataCard;