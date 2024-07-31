import { useState } from 'react';
import SearchIcon from "../../../public/assets/images/search-button.svg"
import BasicTabs from './Tabs';
import Image from 'next/image';
import { dashboardTexts } from '@/helper/constants/textName';
import Bannerlogo from "../../../public/assets/images/bannerlogo.png";
const initalState = [
    {
        id: 1,
        title: dashboardTexts.appTitle,
        text: dashboardTexts.appDescription,
    }
]

const OneBouteousPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [records, setRecords] = useState(initalState);

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value);
        setRecords(initalState.filter(record => record.title.toLowerCase().includes(event.target.value.toLowerCase())))
    };

    return (
        <>
            <div>
                <div className={`bg-[#e3e3e3] py-[2px]`}>
                    <div className='flex m-1'>
                        <button>
                            <div className="space-y-1 mx-2">
                                <div className="w-4 h-0.5 bg-gray-600"></div>
                                <div className="w-4 h-0.5 bg-gray-600"></div>
                                <div className="w-4 h-0.5 bg-gray-600"></div>
                            </div>
                        </button>
                        <div className="m-1">
                            <Image src={Bannerlogo} alt="Bounteous Logo" width={130} height={30} />
                        </div>
                        <div className="flex-grow" />
                        <div>
                            <div className='p-2 bg-white mx-2  text-black '>
                                <Image className="text-black mx-2" src={SearchIcon} height={20} width={20} alt={"Search Icon"} />
                                <input
                                    placeholder="Search…"
                                    className='outline-none'
                                    onChange={(e: any) => handleChange(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <>
                <BasicTabs records={records} />
            </>
        </>
    )
}

export default OneBouteousPage