'use client'

export default function table(){
    return(
        <>
        <div className="relative">
        <div className="p-5">
        <table className="bg-border-spacing-5 w-3/4 rounded-t-3xl rounded-b-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4198d633] to-[#4198d680] ">
            <thead className="">
                <tr className=" mb-3 drop-shadow-[0_0.5rem_0.2rem_rgba(0,0,0,0.2)]">
                    <th className="p-3 drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#4198D6] relative z-40 rounded-l-full ">Roles</th>
                    <th className="drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#6CAFE0] relative z-30">Phase</th>
                    <th className="drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#97C6E9] relative z-20">Region</th>
                    <th className="drop-shadow-[0.5rem_0_0.3rem_rgba(0,0,0,0.2)] bg-[#B3D6EF] relative z-10">Number of Occurences</th>
                    <th className="bg-[#C2DEF2] rounded-r-full">Role Frequency</th>
                </tr>
            </thead>
            <tbody className="p-5 text-center ">
               
            <tr>
                <td className="p-3">Technical Manager</td>
                <td className="">Discover</td>
                <td className="">NA</td>
                <td className="">2</td>
                <td className=" ">
                    <div className="flex justify-center items-center">
                    <div className="w-3/4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                        <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
                    </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td className="p-3">Technical Manager</td>
                <td className="">Discover</td>
                <td className="">NA</td>
                <td className="">2</td>
                <td className=" ">
                    <div className="flex justify-center items-center">
                    <div className="w-3/4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                        <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
                    </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td className="p-3">Technical Manager</td>
                <td className="">Discover</td>
                <td className="">NA</td>
                <td className="">2</td>
                <td className=" ">
                    <div className="flex justify-center items-center">
                    <div className="w-3/4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                        <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
                    </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td className="p-3">Technical Manager</td>
                <td className="">Discover</td>
                <td className="">NA</td>
                <td className="">2</td>
                <td className=" ">
                    <div className="flex justify-center items-center">
                    <div className="w-3/4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                        <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
                    </div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        <div className="absolute place-content-end">
        <img className=" h-28" src="/assets/logo.png" alt="" />    
        </div>
        </div>
        </>
    )
}