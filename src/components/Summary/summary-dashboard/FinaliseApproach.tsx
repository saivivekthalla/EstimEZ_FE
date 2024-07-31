import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveApproachIndex,
  getClicked,
  getFinalised,
  getFinalzedApproach,
  postFinalizeApproach,
  setActiveApproachIndex,
  setClicked,
  setFinalised,
  setFinalisedApproach,
  setWbsStrategies,
  getWbsStrategies,
  setSelectedWbsStrategy,
  getSelectedWbsStrategy,
} from "../../../features/summary/summarySlice";
import LeftSliderArrow from "../../../../public/assets/images/left-slider-arrow.png";
import RightSliderArrow from "../../../../public/assets/images/right-slider-arrow.png";
import Image from "next/image";
import Nocontent from "../../../../public/assets/svg/no-content.svg";
import { useState } from "react";
import { AppDispatch } from "@/features/store";
import {
  fetchCurrentProject,
  fetchResourceApproachesList,
  getProjectById,
} from "@/features/Info/createInfoSlice";
import { useSearchParams } from "next/navigation";
import moment from 'moment';

const Finalisedapproach = () => {
  const [conflict, setConflict] = useState(false);
  const [page, setPage] = useState(1);

  const searchParams = new URLSearchParams(useSearchParams().toString());
  const projectId: any = searchParams.get("projectId");
  useEffect(() => {
    dispatch(getProjectById(projectId)).then((infoDetails: any) => {
      let onfinalisedApproach = infoDetails?.payload?.projectFinalizedRecord;
      if (onfinalisedApproach) {
        onfinalisedApproach = {
            ...onfinalisedApproach,
            selectedApproach: {
                ...onfinalisedApproach?.selectedApproach,
                dateTime: moment(onfinalisedApproach?.selectedApproach?.dateTime)
            },
            ...onfinalisedApproach?.previousSelectedApproaches == null ? null : {
            previousSelectedApproaches: [
                ...onfinalisedApproach?.previousSelectedApproaches?.map((approach: any) => (
                    approach = {
                        ...approach,
                        dateTime: moment(approach.dateTime)
                    }
                ))
            ]}
        }
    }
      if (onfinalisedApproach != null) {
        dispatch(setFinalisedApproach(onfinalisedApproach));
        dispatch(setFinalised(true));
        dispatch(
          setActiveApproachIndex(
            onfinalisedApproach.selectedApproach.approachId
          )
        );
        dispatch(setClicked(true));
      }
      const wbsStrategies = infoDetails?.payload?.wbsStrategies;
      if (wbsStrategies != null) {
        dispatch(setWbsStrategies(wbsStrategies));
      }
    });
  }, [projectId]);

  const dispatch = useDispatch<AppDispatch>();
  const infoDetails = useSelector(fetchCurrentProject);
  const clicked = useSelector(getClicked);
  const finalised = useSelector(getFinalised);
  const fixed =
    infoDetails?.engagementTypeId == 2
      ? true
      : false;
  const approachesList = useSelector(fetchResourceApproachesList);
  const activeApproachId = useSelector(getActiveApproachIndex);
  const finalisedApproach = useSelector(getFinalzedApproach);
  const resourcePlanning = approachesList;

  const wbsStrategies = useSelector(getWbsStrategies);
  const selectedWbsStrategy = useSelector(getSelectedWbsStrategy);
  let totalWbsStrategies = selectedWbsStrategy?.estimations?.length;
  if (totalWbsStrategies == 0) {
    totalWbsStrategies = 1;
  } //Setting total number of pages default as 1
  const filteredItems = finalised
    ? approachesList
    : approachesList?.filter(
        (curr: any) =>
          curr.approachId != finalisedApproach?.selectedApproach?.approachId
      );

  function capitalizeFLetter(string: string) {
    return string.replace(/^./, string[0].toUpperCase());
  }

  const getWbsComponents = () => {
    return ["simple", "medium", "complex"].map((key) => (
      <div className="border-l-4 pl-3 mb-4 text-sm border-[#8A79F3] border-800">
        <p className="text-[#2B205F] font-medium">
          {capitalizeFLetter(key)} hours
        </p>
        <p className="text-[#808199]">
          {selectedWbsStrategy?.estimations[page - 1]?.components[key]} hrs
        </p>
      </div>
    ));
  };

  useEffect(() => {
    resourcePlanning?.forEach((approach: any) => {
      if (approach.approachId == activeApproachId) {
        wbsStrategies?.forEach((wbsStrategy: any) => {
          if (wbsStrategy.id == approach.wbs_strategy_id) {
            dispatch(setSelectedWbsStrategy(wbsStrategy));
            setPage(1);
          }
        });
      }
    });
  }, [activeApproachId]);

  const onfinalize = () => {
    setConflict(false);
    if (!finalised) {
      const data = {
        approachId: activeApproachId,
        projectId: projectId,
      };
      dispatch(postFinalizeApproach(data)).then((data) => {
        dispatch(setFinalised(!finalised));
        if (
          data?.payload?.finalizedApproach?.selectedApproach?.differenceHours >
          500
        ) {
          setConflict(true);
        } else {
          setConflict(false);
        }
      });
    } else {
      dispatch(setClicked(!clicked));
    }
    dispatch(setFinalised(!finalised));
  };

  const onChangeApproachIndex = (index: number) => {
    if (!finalised) {
      dispatch(setClicked(true));
      dispatch(setActiveApproachIndex(index));
    }
  };

  const checkPrev = (id: number) => {
    const ids = finalisedApproach?.previousSelectedApproaches?.map(
      (obj: any) => {
        return obj.approachId;
      }
    );
    if (ids !== undefined) {
      return ids?.includes(id);
    } else {
      return false;
    }
  };

  const findIndex = (id: number) => {
    return finalisedApproach?.previousSelectedApproaches?.findIndex(
      (item: any) => item.approachId === id
    );
  };

  const hoverinfo = (item: any) => {
    const username =
      finalisedApproach?.previousSelectedApproaches[findIndex(item.approachId)]
        ?.userName;
    const date = moment(finalisedApproach?.previousSelectedApproaches[findIndex(item.approachId)]
    ?.dateTime).format("DD MMM YYYY");
    const time = moment(finalisedApproach?.previousSelectedApproaches[findIndex(item.approachId)]
    ?.dateTime).format("hh:mm A");
    return `${username}\n${date}\n${time}`;
  };

  return (
    <>
      <div className="grid grid-cols-11 border-solid border-2 border-[#402EAF99] ">
        <div className="h-[20em] col-span-6 flex-row font-family justify-center relative p-1">
          <div className="py-2 flex justify-center">
            <h3 className="text-[#1B0066] text-[1.2em] ">
              Resource Approach Selection
            </h3>
          </div>
          <div className="h-4/5 w-[95%] mx-2 pr-2 overflow-y-scroll overflow-x-visible">
            <div className="h-full w-full overflow-x-visible ">
              {filteredItems?.map((item: any) => (
                <>
                  <div
                    className="overflow-x-visible my-[0.2em] group relative"
                    onClick={() => onChangeApproachIndex(item.approachId)}
                  >
                    <div
                      title={
                        checkPrev(item.approachId) && finalised
                          ? hoverinfo(item)
                          : ""
                      }
                      className={`${
                        item.approachId === activeApproachId
                          ? "bg-[#2E42A6D9] rounded-lg"
                          : checkPrev(item.approachId) && finalised
                          ? "bg-slate-400 rounded-lg"
                          : ""
                      }
                   group overflow-x-visible py-2 px-3 border-t-2 `}
                    >
                      <div className="grid grid-cols-11 gap-4">
                        <div className="flex col-span-4 justify-center cursor-default">
                          <div className="text-center text-[0.8em] font-medium">
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white truncate w-[5.5rem] text-[1.2em] whitespace-pre"
                                  : "text-[#2B205F] truncate w-[6rem] text-[1.2em] whitespace-pre"
                              }
                            >
                              {item?.approachName}
                            </p>
                            <div
                              className={
                                item.approachId === activeApproachId
                                  ? "text-white"
                                  : "text-[#2B205F]"
                              }
                            >
                              <p>Total Cost</p>
                              <p> {item?.totalCost}</p>
                            </div>
                          </div>
                        </div>
                        <div className="overflow-x-visible col-span-7 cursor-default">
                          <div className="flex justify-between text-[0.8em]">
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white"
                                  : "text-[#000000B2]"
                              }
                            >
                              Conceive
                            </p>
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white font-light"
                                  : "text-[#000000B2] font-light"
                              }
                            >
                              $ {item?.conceive.totalCost || 0} 
                            </p>
                          </div>
                          <div className="flex justify-between text-[0.8em]">
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white"
                                  : "text-[#000000B2]"
                              }
                            >
                              Build 
                            </p>
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white font-light"
                                  : "text-[#000000B2] font-light"
                              }
                            >
                             $ {item?.build.totalCost || 0} 
                            </p>
                          </div>
                          <div className="flex justify-between text-[0.8em]">
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white"
                                  : "text-[#000000B2]"
                              }
                            >
                              Discover
                            </p>
                            <p
                              className={
                                item?.approachId === activeApproachId
                                  ? "text-white font-light"
                                  : "text-[#000000B2] font-light"
                              }
                            >
                             $ {item?.discover.totalCost || 0} 
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
       <div className="h-full col-span-5 flex flex-col justify-evenly p-1">
          <div className="flex justify-center py-1">
              <p className="text-[#1B0066] text-[1.2em] pb-1 justify-center ">
                Effort Estimation
              </p>
            </div>
            <hr />
            {fixed ? (
              <>
                {clicked ? (
                  <div className="pb-1 ">
                    <div className="flex flex-col items-center p-2 text-[#1B0066C9] font-medium text-[1.2em]">
                      <p>{selectedWbsStrategy.strategyName}</p>
                      <p className="text-sm">
                        {selectedWbsStrategy.totalStrategyHours} hrs
                      </p>
                      <p>
                        {
                          selectedWbsStrategy.estimations[page - 1]
                            ?.practiceRecord?.name
                        }
                      </p>
                    </div>
                    <div className="px-3">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="border-l-4 pl-3 mb-4 text-sm border-[#8A79F3] border-800">
                          <p className="text-[#2B205F] font-medium">
                            Total hours
                          </p>
                          <p className="text-[#808199]">
                            {
                              selectedWbsStrategy?.estimations[page - 1]
                                ?.totalEstimationHours
                            }{" "}
                            hrs
                          </p>
                        </div>
                        {getWbsComponents()}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[15px] leading-5 font-light text-[#00000080]">
                          Page {page} of {totalWbsStrategies}
                        </p>
                      </div>
                      <div>
                        <div className="grid grid-cols-2">
                          <div>
                            <Image
                              src={LeftSliderArrow}
                              alt=""
                              width={20}
                              height={20}
                              onClick={() => {
                                if (page - 1 != 0) {
                                  setPage(page - 1);
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Image
                              src={RightSliderArrow}
                              alt=""
                              width={20}
                              height={20}
                              onClick={() => {
                                if (page + 1 != totalWbsStrategies + 1) {
                                  setPage(page + 1);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center p-5">
                    <Image src={Nocontent} alt="" width={100} height={100} />
                    <p className="pt-5 w-[15em] text-[#808199] text-[0.8em]">
                      Choose an Resource Approach to show WBS and Practice
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center p-5">
                <Image src={Nocontent} alt="" width={100} height={100} />
                <p className="pt-5 w-[15em] text-[#808199] text-[0.8em]">
                  WBS is not applicable for the chosen Engagement-Type
                </p>
              </div>
            )}
        </div>
      </div>
      <div className="relative">
        <button
          disabled={!finalised ? (clicked ? false : true) : (approachesList.length == 1 ? true :false)}
          className={`${
            clicked ? "bg-[#2E42A6E5]" : "bg-slate-600"
          } p-2 text-white rounded-b-md `}
          onClick={() => onfinalize()}
        >
          {finalised ? "Try an another" : "Finalize"} Approach
        </button>
        {conflict && (
          <>
            <div className="absolute z-30 -bottom-[9em] w-[18em] border-[#F00] border-2 rounded-lg text-[0.7em] font-semibold text-[#F00] bg-white p-2">
              <span
                className="absolute right-2 cursor-pointer"
                onClick={() => setConflict(false)}
              >
                X
              </span>
              <span className=" font-bold text-[1rem]">Conflicts found</span>{" "}
              <br />
              More than 500 Hrs difference in Effort Estimation approach and
              Resource approach
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Finalisedapproach;
