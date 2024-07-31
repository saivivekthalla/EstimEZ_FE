import React from 'react';
import Cross from "../../../../public/assets/svg/Cross.svg";
import Tick from "../../../../public/assets/svg/Tick.svg";
import Image from 'next/image';
import {ToggleProps} from "@/helper/constants/types/ResourcePlanningtypes/CalenderTypes"

function Toggle({ isChecked, toggleSwitch }: ToggleProps) {
    return (
        <div className="pt-2 w-[15%] ml-auto mr-auto">
            <label className="flex items-center cursor-pointer">
                <div className="mx-2 w-10 text-[0.5rem] text-[#4A3A95] font-medium">
                    Fractional Allocation
                </div>
                <div className="relative ">
                    <input
                        type="checkbox"
                        id="toggleSwitch"
                        className="sr-only"
                        checked={isChecked}
                        onChange={toggleSwitch}
                    />
                    <div
                        className={`block w-12 h-6 text-[0.7em] content-center rounded-full text-white ${isChecked ? "bg-[#8E8E8E]" : "bg-[#9094FF]"
                            } shadow-inner`}
                    >
                        {" "}
                        {isChecked ? (
                            <p className={`${isChecked ? "pt-1 pl-6" : "invisible"}`}>
                                NO
                            </p>
                        ) : (
                            <p className={`${isChecked ? "invisible" : "pt-1 pl-1"}`}>
                                YES
                            </p>
                        )}{" "}
                    </div>
                    <div
                        className={`absolute left-3 top-1 w-4 h-4 bg-white rounded-full transition-transform transform 
          ${isChecked ? "-translate-x-2" : "translate-x-full"}`}
                    >
                        {" "}
                        <Image
                            className="-mt-[0.5em] ml-[0.1em]"
                            src={isChecked ? Cross : Tick}
                            height={12}
                            width={12}
                            alt=""
                        />{" "}
                    </div>
                </div>
            </label>
        </div>
    );
}

export default Toggle;
