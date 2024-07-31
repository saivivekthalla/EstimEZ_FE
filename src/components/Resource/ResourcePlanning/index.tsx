import React, { useState } from 'react'
import Phase from './Phase'
import Table from './ResourceTable'
import { getCurrentPhase } from '@/features/resource/resourcePlanningSlice'
import { useSelector } from 'react-redux'
import { fetchCurrentProject } from '@/features/Info/createInfoSlice'
import { useSearchParams } from 'next/navigation'
import { approach } from '@/helper/constants/types/ResourcePlanningtypes/resourcePlanTypes'

const Resource = () => {
    const searchParams = new URLSearchParams(useSearchParams());
    const approachId: any = searchParams.get("approachId");
    const projectDetails = useSelector(fetchCurrentProject)
    let approachDetails : approach  = projectDetails?.resourcePlanning?.find((approach :approach) => {
        return approach.approachId === parseInt(approachId, 10);
    });
    
    // initial data for this state should be current approaches data
    const [details,setDetails] = useState(approachDetails)
    const currentPhase = useSelector(getCurrentPhase)
    const phaseList = [
        {
            title: "discover", totalCost: approachDetails?.discover?.totalCost,
            totalDuration: approachDetails?.discover?.totalDuration, totalCount: approachDetails?.discover?.resourceCount
        },
        {
            title: "conceive", totalCost: approachDetails?.conceive?.totalCost,
            totalDuration: approachDetails?.conceive?.totalDuration, totalCount: approachDetails?.conceive?.resourceCount
        },
        {
            title: "build", totalCost: approachDetails?.build?.totalCost,
            totalDuration: approachDetails?.build?.totalDuration, totalCount: approachDetails?.build?.resourceCount
        }
    ];
    
  return (
    <div className='py-3 h-full'>
        <Phase phaseList={phaseList} currentPhase={currentPhase}/>
        <div className='bg-[#B09FFF40] h-fit pb-5 rounded-2xl'>
            <Table details={details} setDetails={setDetails}/>
        </div>
    </div>
  )
}

export default Resource