import Image from 'next/image'
import SoftwareLicense from '../../../public/assets/svg/sl.svg'
import PLTable from './Tables/PLTable';
import { getProductLicenseTotal } from '@/features/budget/otherCostDiscountSlice';
import { useSelector } from 'react-redux';

const ProductLicense = ({setBackendData} :any) => {
    const total = useSelector(getProductLicenseTotal)
    return(
        <div>
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-3'>
                    <Image src={SoftwareLicense} width={60} height={60} alt={'Software License'}/>
                    <p className="text-2xl">Bounteous Product License</p>
                </div>
                <div className="flex gap-12">
                    <p>Amount : </p>
                    <p className="bg-[#1D154A] px-2 rounded-md">$ {total}</p>
                </div>
            </div>
            <div className='bg-[#DAF8FFE0] mt-5 rounded-md relative p-4 flex justify-center'>
                <PLTable setBackendData={setBackendData} />
            </div>
        </div>
    );
};

export default ProductLicense;