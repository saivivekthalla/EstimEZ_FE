import { useEffect, useState, lazy } from 'react'; 
import Image from "next/image";
import Link from "next/link";
import forwardIcon from "../../../public/assets/svg/backward-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { useSearchParams } from "next/navigation";
import { getWbsEstimationDetails, createTemplate, updateTemplate, fetchCurrentTemplate, fetchMasterTemplate, getCurrentWbsTemplate } from "@/features/wbs/wbsSlice";
import { getCurrentPractice, getCurrentTemplateId, getCurrentWBS, setCurrentTemplateId, setCurrentWBS } from "@/features/estimation/estmationSlice";
import { alertText } from "@/helper/constants/textName";
import { fetchCurrentProject, getProjectById } from "@/features/Info/createInfoSlice";
import { checkAllValues, compareData } from "@/helper/utility/helperFunctions"

const CategoryDetails = lazy(() => import("./Categorydetails"));
const HighChartDetails = lazy(() => import("./Piechart"));

const EstimationDetails = () => {
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = new URLSearchParams(useSearchParams());
    const projectId: any = searchParams.get('projectId');
    const strategyId: any = searchParams.get('strategyId');
    const [isdefault, setisdefault] = useState(false);
    const [isCollapse, setIsCollapse] = useState(false);
    const [isQaTemplate, setQaTemplate] = useState(false)
    const [isQaTemplateToggle, setQaTemplateToggle] = useState(false)
    const project = useSelector(fetchCurrentProject)
    const currentWbs = useSelector(getCurrentWBS)
    const wbsEstimationDetails = useSelector(getWbsEstimationDetails)
    const currentTemplateId = useSelector(getCurrentTemplateId)
    const currentPracticeId = useSelector(getCurrentPractice)
    const masterTemplate = useSelector(fetchMasterTemplate);
    const currentTemplate: any = useSelector(fetchCurrentTemplate)

    useEffect(() => {
        if (currentWbs?.estimations?.length > 0) {
            const foundEstimation = currentWbs?.estimations?.find((ele: any) => ele.practiceRecord.id === currentPracticeId.id);
            if (foundEstimation && currentTemplate.content !== null) {
                dispatch(getCurrentWbsTemplate({ strategyId: strategyId, templateId: foundEstimation.templateId }))
                if (foundEstimation.isCustom == true) {
                    setisdefault(true)
                }
                else {
                    setisdefault(false)
                }
            }
        }
    }, [])

    useEffect(() => {
        const wbs = project?.wbsStrategies?.filter((ele: any) => ele.id == strategyId)
        if (wbs)
            dispatch(setCurrentWBS(wbs[0]))
    }, [project])

    const handleSave = async () => {
        try {
            if (currentTemplateId == null) {
                if (isQaTemplate) {
                    const postData = {
                        qaContent: wbsEstimationDetails,
                        createdAt: new Date().toISOString(),
                        createdBy: "Bounteous",
                        wbsStrategyId: Number(strategyId),
                        masterEstimationTemplateId: null,
                        practiceId: currentPracticeId.id,
                        isCustom: masterTemplate.status == 404 ? false : true
                    }
                    if (wbsEstimationDetails.length == 0 || checkAllValues(wbsEstimationDetails)) {
                        alert(alertText.pleaseFill);
                        return;
                    }
                    dispatch(createTemplate(postData)).then((res: any) => {
                        if (res.payload.id) {
                            dispatch(setCurrentTemplateId(res.payload.id))
                            dispatch(getProjectById(projectId));
                            dispatch(getCurrentWbsTemplate({ strategyId: strategyId, templateId: res.payload.id }))
                            alert(alertText.saveSuccess);
                        }
                    }).catch((error: any) =>
                        alert(alertText.saveFailed)
                    )
                }
                else {
                    const filteredData: any = [];

                    wbsEstimationDetails.forEach((category: any) => {
                        if(typeof(category.category)=='number'){
                            const categoryHasNonNullValues = category.simple !== null || category.medium !== null || category.complex !== null;
                            const filteredSubcategories = category.subcategories.filter((subcategory: any) => {
                                return subcategory.simple !== null || subcategory.medium !== null || subcategory.complex !== null;
                            });
                            if (categoryHasNonNullValues || filteredSubcategories.length > 0) {
                                const filteredCategory = {
                                    ...category,
                                    subcategories: filteredSubcategories
                                };
                                filteredData.push(filteredCategory);
                            }
                        }
                        else
                            filteredData.push(category)

                    });
                    const postObj = {
                        content: filteredData,
                        createdAt: new Date().toISOString(),
                        createdBy: "Bounteous",
                        wbsStrategyId: Number(strategyId),
                        masterEstimationTemplateId: masterTemplate.length > 0 ? (isdefault ? null : 1) : null,//has to be changed based on future changes
                        practiceId: currentPracticeId.id,
                        isCustom: masterTemplate.length > 0 ? isdefault : true
                    }

                    if (wbsEstimationDetails.length == 0 || checkAllValues(wbsEstimationDetails)) {
                        alert(alertText.pleaseFill);
                        return;
                    }

                    const res = await dispatch(createTemplate(postObj));
                    if (res.payload.id) {
                        dispatch(getCurrentWbsTemplate({ strategyId: strategyId, templateId: res.payload.id }))
                        dispatch(getProjectById(projectId));
                        dispatch(setCurrentTemplateId(res.payload.id))
                        alert(alertText.saveSuccess);
                    } else {
                        alert(alertText.saveFailed);
                    }

                }
            }
            else {
                if (isQaTemplate) {
                    const putData = {
                        qaContent: wbsEstimationDetails,
                        updatedBy: "Bounteous",
                    }
                    if (!compareData(currentTemplate.qaContent, wbsEstimationDetails)) {
                        dispatch(updateTemplate({ putData, id: currentTemplateId })).then((res: any) => {
                            if (res.payload.id) {
                                
                                dispatch(setCurrentTemplateId(res.payload.id));
                                dispatch(getProjectById(projectId))
                                dispatch(getCurrentWbsTemplate({ strategyId: strategyId, templateId: res.payload.id }))
                                alert(alertText.saveSuccess)
                            }
                        }
                        ).catch((error: any) =>
                            alert(alertText.saveFailed)
                        )
                    } else {
                        alert("No changes detected. No new values to save.");
                    }

                }
                else {
                    const filteredData: any = [];

                    wbsEstimationDetails.forEach((category: any) => {
                        if(typeof(category.category)=='number'){
                            const categoryHasNonNullValues = category.simple !== null || category.medium !== null || category.complex !== null;
                            const totalHoursGreaterThanZero = category.totalHours > 0;

                            const filteredSubcategories = category.subcategories.filter((subcategory: any) => 
                                subcategory.simple !== null || subcategory.medium !== null || subcategory.complex !== null || typeof(subcategory.subcategory) == 'string' 
                            );

                            if ((categoryHasNonNullValues || filteredSubcategories.length > 0) && totalHoursGreaterThanZero) {
                                const filteredCategory = {
                                    ...category,
                                    subcategories: filteredSubcategories
                                };
                                filteredData.push(filteredCategory);
                            }
                        }
                        else
                            filteredData.push(category)
                    });
                    
                    const putData = {
                        content: filteredData,
                        updatedBy: "Bounteous"
                    }
                    const putObj = {
                        putData,
                        id: currentTemplateId
                    };
                    if (!compareData(currentTemplate.content, filteredData)) {
                        const response = await dispatch(updateTemplate(putObj))
                        if (response.payload.id) {
                            dispatch(setCurrentTemplateId(response.payload.id));
                            dispatch(getCurrentWbsTemplate({ strategyId: strategyId, templateId: response.payload.id }))
                            dispatch(getProjectById(projectId));
                            alert(alertText.saveSuccess);
                        } else {
                            alert(alertText.saveFailed);
                        }
                    } else {
                        alert("No changes detected. No new values to save.");
                    }


                }

            }

        } catch (err) {
            console.log("currentTemplate", err);
        }

    }

    return (
        <div className="h-full">
            <div className="flex justify-between mb-6">
                <div className="text-[#4C0157] font-bold">
                    <div className="flex flex-row">
                        {
                            isQaTemplate ?
                                <button onClick={() => { setQaTemplate(false); setQaTemplateToggle(false) }}>
                                    <Image className="mx-2" src={forwardIcon} alt="forwardImage" width={25} height={25} />
                                </button>
                                :
                                <Link href={`/WBSPractices?projectId=${projectId}&strategyId=${strategyId}`}>
                                    <Image className="mx-2" src={forwardIcon} alt="forwardImage" width={25} height={25} />
                                </Link>
                        }
                        <div className="">{currentWbs?.strategyName} - {currentPracticeId?.name} {isQaTemplate ? '- QA Template' : ''}</div>
                    </div>
                </div>
                <div className={`${isQaTemplate ? 'hidden' : ''} flex gap-3 `}>
                    <button disabled={!isQaTemplateToggle} onClick={() => setQaTemplate(true)} className={`${isQaTemplateToggle ? 'text-[#4E69F4] underline' : 'text-[#01105F]'} font-bold text-lg`}>QA Template</button>
                    <div className="bg-[#CBE4FBCF] rounded-lg transition-all text-xs">
                        <button className={`${isQaTemplateToggle ? 'bg-[#2B205F] my-1 ml-1 text-white p-1 px-3 rounded-md' : 'text-[#AAAAAA99] p-1 px-2 rounded-sm'} px-6`}
                            onClick={() => setQaTemplateToggle(true)}>
                            Yes
                        </button>
                        <button className={`${isQaTemplateToggle ? 'text-[#AAAAAA99] p-1 px-2 rounded-sm' : 'bg-[#2B205F] my-1 mr-1 text-white p-1 px-3 rounded-md'} px-6`}
                            onClick={() => setQaTemplateToggle(false)}>
                            No
                        </button>
                    </div>
                </div>

                <button onClick={handleSave} className="bg-[#0C1960] text-white px-4 py-1 text-sm rounded-md">
                    Save
                </button>
            </div>
            <div className={`flex justify-around ${isQaTemplate ? 'hidden' : (currentPracticeId.id != 1 ? 'hidden' : '')}`}>
                <div className={`bg-[#CBE4FBCF] rounded-xl transition-all text-xs ${(currentTemplateId == null || currentTemplate.content == null) && (checkAllValues(wbsEstimationDetails)) ? '' : 'pointer-events-none'}`}>
                    <button className={`${isdefault ? 'text-[#AAAAAA99] p-1 px-2 rounded-md' : 'bg-[#2B205F] my-1 ml-1 text-white p-1 px-3 rounded-xl'}`}
                        onClick={() => setisdefault(false)}>
                        Default
                    </button>
                    <button className={`${isdefault ? 'bg-[#2B205F] my-1 mr-1 text-white p-1 px-3 rounded-xl' : 'text-[#AAAAAA99] p-1 px-2 rounded-md'}`}
                        onClick={() => setisdefault(true)}>
                        Custom
                    </button>
                </div>
            </div>
            <div id="maincomponent" className="flex h-full w-full m-2 gap-4 transition delay-1000">
                <div className={`${isCollapse ? "w-9/12 mr-24" : "w-1/2"}`}>
                    <CategoryDetails custom={isdefault} qaTemplate={isQaTemplate} />
                </div>
                <div className={`${isCollapse ? "w-3/12" : "w-1/2"} h-full`}>
                    <HighChartDetails isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
                </div>
            </div>
        </div>
    );
};

export default EstimationDetails;