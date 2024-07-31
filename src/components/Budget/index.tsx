import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ApproachSelection from './ApproachSelection';
import BudgetSummary from './BudgetSummary';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscount, fetchOtherCost, getProjectById } from '@/features/Info/createInfoSlice';
import { AppDispatch } from '@/features/store';


const BudgetDashboard = () => {
    useEffect(()=>{
        dispatch(getProjectById(projectId))
    },[]);
    const dispatch = useDispatch<AppDispatch>()
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: any = searchParams.get('projectId');
    const otherCost = useSelector(fetchOtherCost)
    const discount = useSelector(fetchDiscount)
    const [selectedCard,setSelectedCard] = useState(null);
    const selected = selectedCard !== null;
    // need to add discount condition
    const configured = otherCost != 0 || discount != 0;

    return (
        <div className="grid gap-y-4 h-full">
            <div className="flex justify-between">
                <h1 className='text-lg font-semibold text-[#1B0066]'>BUDGET DASHBOARD</h1>
                <p>
                    Can't find the right approach?
                    <Link href={`/resource?projectId=${projectId}`}>
                        <span className='text-[#1B0066] ml-1 font-semibold border-b-2 border-[#1B0066]'>Go to Resource</span>
                    </Link>
                </p>
            </div>
            <ApproachSelection setSelectedCard={setSelectedCard}/>
            <BudgetSummary selected={selected} configured={configured} details={selectedCard} otherCost={otherCost} discount={discount} projectId={projectId} />
        </div>
    );
};

export default BudgetDashboard;