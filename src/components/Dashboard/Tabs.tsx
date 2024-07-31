import Appcard from "./AppCards";
import { dashboardTexts } from "@/helper/constants/textName";
import { useState } from "react";


const enterpriseList = [
    {
        id: 1,
        title: dashboardTexts.appTitle,
        text: dashboardTexts.appDescription,
    }
];



export default function BasicTabs({ records }: any) {
    const [value, setValue] = useState(0);

    const handleChange = (newValue: any) => {
        setValue(newValue);
    };

    return (
        <div className="custom-box">
            <div className="border-b">
                <div className="border-b border-gray-200">
                    <nav className="flex" aria-label="basic tabs example">
                        <button
                            className={`${value === 0
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                } py-4 px-6 border-b-2 border-transparent font-medium text-sm`}
                            onClick={() => handleChange(0)}
                        >
                            {dashboardTexts.appTabTitle}
                        </button>
                        <button
                            className={`${value === 1
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                } py-4 px-6 border-b-2 border-transparent font-medium text-sm`}
                            onClick={() => handleChange(1)}
                        >
                            {dashboardTexts.utilityTabTitle}
                        </button>
                    </nav>
                </div>

            </div>
            {
                value == 0 ? (
                    <div>
                        <Appcard records={enterpriseList} />
                    </div>
                ) :
                    (
                        <div>
                        </div>
                    )
            }
        </div>
    );
}
