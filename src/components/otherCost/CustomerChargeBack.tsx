import Image from 'next/image'
import Teamwork from '../../../public/assets/svg/teamwork.svg'
import Airplane from '../../../public/assets/svg/airplane.svg'
import SoftwareLicense from '../../../public/assets/svg/sf2.svg'
import { useEffect, useState } from 'react';
import { TTable } from './Tables/TTable';
import SLTable from './Tables/SLTable';
import { useDispatch, useSelector } from 'react-redux';
import { getSoftwareLicenseTotal, getTravelExpensesTotal, setCustomerChargeBackTotal, setOtherCostTotal } from '@/features/budget/otherCostDiscountSlice';
import { AppDispatch } from '@/features/store';

const CustomerCargeBack = ({setBackendData} :any) => {
    const dispatch = useDispatch<AppDispatch>()
    const [selected, setSelected] = useState('travel')
    const tBTotal = useSelector(getTravelExpensesTotal)
    const lBTotal = useSelector(getSoftwareLicenseTotal)

    useEffect(()=>{
        dispatch(setCustomerChargeBackTotal(tBTotal+lBTotal))
    },[tBTotal,lBTotal])

    return(
        <div className="">
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-3'>
                    <Image src={Teamwork} width={60} height={60} alt={''}/>
                    <p className="text-2xl">Customer Charge Back</p>
                </div>
                <div className="flex gap-12">
                    <p>Amount : </p>
                    <p className="bg-[#1D154A] px-2 rounded-md">$ {tBTotal+lBTotal}</p>
                </div>
            </div>
            <div className='bg-[#DAF8FFE0] pl-4 mt-12 rounded-md relative p-4 flex justify-center'>
                <div className='absolute flex gap-4 left-4 -top-8'>
                    <div className={`bg-[#07C2FE] hover:cursor-pointer gap-2 flex text-black ${selected == 'travel' ? 'p-2 pr-4 rounded-md' : 'h-8 p-1 pr-32 rounded-t-md'}`}
                    onClick={()=>setSelected('travel')}>
                        <Image src={Airplane} width={selected == 'travel' ? 50 : 30} height={selected == 'travel' ? 50 : 30} alt={''}/>
                        {
                            selected == 'travel' ?
                            <p>
                                <span className='font-bold text-lg'>Travel & Expenses</span> 
                                <span className='text-sm'><br />$ {tBTotal}</span>
                            </p>
                            :
                            <p className='font-bold'>Travel</p>
                        }
                    </div>
                    <div className={`bg-[#7DF9DBF0] hover:cursor-pointer gap-2 flex text-black ${selected == 'license' ? 'p-2 pr-8 rounded-md' : 'h-8 p-1 pr-4 rounded-t-md'}`}
                    onClick={()=>setSelected('license')}>
                        <Image src={SoftwareLicense} width={selected == 'license' ? 50 : 30} height={selected == 'license' ? 50 : 30} alt={''}/>
                        {
                            selected == 'license' ?
                                <p>
                                    <span className='font-bold text-lg'>Software License</span> <br />
                                    <span className='text-sm'>$ {lBTotal}</span>
                                </p>
                            :
                                <p className='font-bold'>Software License</p>
                        }
                    </div>
                </div>
                <div className='mt-10 flex justify-center'>
                    {
                        selected == 'travel' ?
                        <TTable setBackendData={setBackendData} />
                        :
                        <SLTable setBackendData={setBackendData} />
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomerCargeBack;