import { useState } from 'react';
import Link from 'next/link';
import { SCREEN_COLOR, WHITE_COLOR } from '@/helper/constants/colors';
import { dashboardTexts } from '@/helper/constants/textName';
import Image from 'next/image';

export default function Appcard({ records }: any) {

    const [color, setColor] = useState(WHITE_COLOR)
    const [toggleColor, setToggleColor] = useState<any>()

    const toggleColors = (index: any) => {
        setColor(SCREEN_COLOR)
        setToggleColor(index)
    }

    const mouseLeave = () => {
        setToggleColor(-1)
    }

    return (
        <>
            <div>
                {records.length > 0 ? records.map((item: any, index: any) => (
                    <div className="flex">
                        <Link href="/home">
                            <div
                                key={index}
                                className={`flex flex-col gap-2 w-40 items-center ${toggleColor === index ? "grey-bg" : "white-bg"} m-3 p-2 rounded-2xl shadow-lg`}
                                onMouseOver={() => toggleColors(index)}
                                onMouseLeave={mouseLeave}
                            >
                                <div className="m-1">
                                    <Image
                                        src="/assets/svg/icon.svg" // Specify the path to your SVG file in the public folder
                                        alt="Sample SVG"
                                        width={90}
                                        height={90}
                                    />
                                </div>
                                <div>

                                    <button className="text-md m-1 font-semibold">{item.title}</button>

                                </div>

                            </div>
                        </Link>
                    </div>
                )) : <h1>{dashboardTexts.utilityTabDescription}</h1>}
            </div>
        </>
    );
}
