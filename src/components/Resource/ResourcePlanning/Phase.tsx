import { getCurrentPhase, setCurrentPhase } from '@/features/resource/resourcePlanningSlice'
import { AppDispatch } from '@/features/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Phase = ({phaseList}: any) => {
    const dispatch = useDispatch<AppDispatch>()
    const currentPhase = useSelector(getCurrentPhase)
    
  return (
        <div className='grid grid-flow-col grid-cols-10 gap-16 justify-items-center px-6 h-28'>
        {
            phaseList.map((phase: any, index: number)=>{
                return (
                    phase.title == currentPhase ? 
                    <div key={index} className='bg-[#B09FFF40] p-3 col-span-4 h-28 justify-self-stretch rounded-t-2xl'>
                        <div className='bg-[#2B205F] rounded-2xl text-white px-5 py-3'>
                            <p className='text-lg font-bold uppercase mb-2'>{phase.title}</p>
                            <div className='grid grid-cols-2 gap-y-3'>
                                <div>
                                    <span className='font-semibold'>Total Cost</span> 
                                    <br /> $ {phase.totalCost || 0}
                                </div>
                                <div>
                                    <span className='font-semibold'>Resource Count</span>
                                    <br /> {phase.totalCount || 0}
                                </div>
                                <div>
                                    <span className='font-semibold'>Total Duration</span>
                                    <br /> {phase.totalDuration || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div key={index} className="bg-[#46C0C8] px-5 pt-5 rounded-t-[2rem] cursor-pointer justify-self-stretch col-span-3 h-28"
                        onClick={()=>dispatch(setCurrentPhase(phase.title))}>
                        <p className='text-lg font-bold uppercase text-white mb-2'>{phase.title}</p>
                        <p className='font-semibold'>Total Cost</p>
                        <p>$ {phase.totalCost || 0}</p>
                    </div>
                )
            })
        }
        </div>
  )
}

export default Phase