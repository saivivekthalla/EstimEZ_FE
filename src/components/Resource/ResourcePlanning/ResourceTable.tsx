import AddImage from '@/assets/icons/AddImage'
import { fetchCurrentProject, fetchResourceApproacheById, getProjectById } from '@/features/Info/createInfoSlice'
import { getAllRegions, getAllRoles, getAllRatecards, getCurrentPhase, setdataSaved, createRolesAndTimeRanges, updateRolesAndTimeRanges, deleteRoles } from '@/features/resource/resourcePlanningSlice'
import { AppDispatch } from '@/features/store'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DateIcon from "../../../../public/assets/support-icon/date-icon.png";
import Image from "next/image";
import { MonthOrWeek } from '@/helper/enums/statusEnums'
import { calculateMonthDifference, calculateMonths, calculateWeeks, weekDifference } from '@/helper/utility/dateFunctions'
import { Role } from "@/helper/constants/types/ResourcePlanningtypes/resourcePlanTypes"
import toolTip from "../../../../public/assets/images/toolTip.svg";
import dynamic from 'next/dynamic'
const Modal = dynamic(()=> import("../Modal"));
const DeleteModal = dynamic(()=>import("@/components/common/Modal/Confirmation"));

const Table = ({ details, setDetails }: any) => {
    const dispatch = useDispatch<AppDispatch>()
    const [openAlert, setopenAlert] = useState(false)
    const [checked, setChecked] = useState<Array<number>>([])
    const phase = useSelector(getCurrentPhase)
    const [selectedRole, setSelectedRole] = useState({})
    const allRoles = useSelector(getAllRoles)
    const allRegion = useSelector(getAllRegions)
    const allRatecards = useSelector(getAllRatecards)
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState<Boolean>(false)
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: any = searchParams.get("projectId");
    const approachId: any = searchParams.get("approachId");
    const projectDetails = useSelector(fetchCurrentProject);
    const [showTooltip, setShowTooltip] = useState(-1);

    let existingData: any
    let flag: boolean
    const resourcePlann = useSelector((state) => fetchResourceApproacheById(state, Number(approachId)));
    projectDetails?.resourcePlanning?.forEach((approach: any) => {
        if (approach.approachId == parseInt(approachId))
            existingData = { ...approach }
    });
    const [calendarProps, setCalendarprops] = useState({
        roleName: "",
        costPerHour: "",
        weeklyOrYearly: "",
        index: 0,
        timeRanges: [],
    });

    useEffect(() => {
        setChecked([])
        if (details?.[phase]?.durationType == null)
            setDetails({ ...details, [phase]: { ...details?.[phase], durationType: "Weekly" } })
    }, [phase])

    useEffect(() => {
        if(existingData && details){
            flag = true
            const existingDiscoverRoles = existingData.discover?.roles || [];
            const existingConceiveRoles = existingData.conceive?.roles || [];
            const existingBuildRoles = existingData.build?.roles || [];

            const detailsDiscoverRoles = details.discover?.roles || [];
            const detailsConceiveRoles = details.conceive?.roles || [];
            const detailsBuildRoles = details.build?.roles || [];

            const backendData = [...existingDiscoverRoles, ...existingConceiveRoles, ...existingBuildRoles];
            const currentData = [...detailsDiscoverRoles, ...detailsConceiveRoles, ...detailsBuildRoles];

            if (equalcheck(backendData, currentData))
                dispatch(setdataSaved(true))
            else
                dispatch(setdataSaved(false))
        }

    }, [details])

    useEffect(() => {
        if (confirm == true) {
            deleteData(true)
        }
      }, [confirm])

    const getLatestData = () => {
        dispatch(getProjectById(projectId)).then((res: any) => {
            const index = res?.payload?.resourcePlanning?.findIndex(
                (item: any) => item.approachId === Number(approachId)
            );
            existingData = res?.payload?.resourcePlanning[index]?.[phase].roles
            setDetails(res?.payload?.resourcePlanning[index]);
        });
    };


    function setData(role: any, index: any) {
        const name = allRoles?.filter((data: any) => { if (data.id == role.roleLookupId) return data.name })


        setCalendarprops({
            roleName: name[0].name,
            costPerHour: role.costPerHour,
            weeklyOrYearly: phase,
            index: index,
            timeRanges: role.timeRanges,
        })
        setSelectedRole({ ...role, rowIndex: index })
        setOpen(true);
    }

    const addItem = () => {
        setDetails({
            ...details,
            [phase]: {
                ...details?.[phase],
                roles: [
                    ...details?.[phase].roles,
                    {
                        roleLookupId: 0,
                        regionId: 0,
                        originalCost: null,
                        costPerHour: null,
                        isCustomCost: false,
                        isFractionalAllocation: false,
                        timeRanges: [],
                        roleTotalCost: null,
                        roleTotalTime: null,
                        createdBy: 'bounteous',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        });
    }

    const checkRole = (index: number) => {
        if (checked.includes(index))
            setChecked(checked.filter((id: number) => id !== index))
        else
            setChecked([...checked, index])
    }

    function checkAll() {
        const arr: number[] = []
        if (checked.length < details?.[phase].roles.length) {
            for (let i = 0; i < details?.[phase].roles.length; i++)
                arr.push(i);
        }
        setChecked(arr)
    }

    const handleDataChange = (value: any, name: string, index: number) => {
        setDetails((prevDetails: any) => {
            const updatedDetails = JSON.parse(JSON.stringify(prevDetails));
            updatedDetails[phase].roles[index][name] = parseInt(value);
            if (name == "regionId" || name == "roleLookupId") {
                updatedDetails[phase].roles[index].originalCost = getRateCard(updatedDetails[phase].roles[index].roleLookupId, updatedDetails[phase].roles[index].regionId)
                updatedDetails[phase].roles[index].costPerHour = getRateCard(updatedDetails[phase].roles[index].roleLookupId, updatedDetails[phase].roles[index].regionId)

            }
            if (name == "costPerHour")
                updatedDetails[phase].roles[index].isCustomCost = parseInt(value) != getRateCard(updatedDetails[phase].roles[index].roleLookupId, updatedDetails[phase].roles[index].regionId)
            if (updatedDetails[phase].roles[index].timeRanges.length > 0) {
                let totalRangeCost = 0
                updatedDetails[phase].roles[index].timeRanges.map((range: any) => {

                    const weeks = details?.[phase]?.durationType == "Weekly"
                        ? weekDifference(range.start, range.end) + 1
                        : calculateMonthDifference(range.start, range.end) + 1;
                    range.rangeCost = Number(updatedDetails[phase].roles[index].costPerHour) * Number(range.hourPerDuration) * Number(weeks)
                    totalRangeCost += range.rangeCost
                })
                updatedDetails[phase].roles[index].roleTotalCost = totalRangeCost
            }
            if(updatedDetails[phase].roles[index].hasOwnProperty("updatedBy") || updatedDetails[phase].roles[index].hasOwnProperty("updatedAt")){
                updatedDetails[phase].roles[index].updatedBy = "bounteous"
                updatedDetails[phase].roles[index].updatedAt = new Date().toISOString()
            }

            return updatedDetails;
        });
    }

    function getRateCard(aroleId: number, aregionId: number) {

        let roleName: string = '', regionCode: string = ''
        allRoles.map((role: any) => {
            if (role.id == aroleId)
                roleName = role.name
        })
        allRegion.map((region: any) => {
            if (region.id == aregionId)
                regionCode = region.code
        })

        let originalCost: number = 0
        allRatecards.map((value: any) => {
            if (value.name == roleName) {
                value.cost.map((price: any) => {
                    if (price.region == regionCode) {
                        originalCost = price.hour
                    }
                })
            }
        })

        return originalCost
    }

    async function saveData() {
        let putRoles: any = [];
        let postRoles: Array<Role> = [];
        let postSuccess: Boolean = false
        let putSuccess: Boolean = false

        for (const data of details?.[phase].roles) {
            if (
                data.roleLookupId === 0 ||
                data.regionId === 0 ||
                (data.isCustomCost === false ? data.originalCost === 0 : (data.costPerHour === "" || data.costPerHour === 0)) ||
                !data.roleTotalCost ||
                !data.roleTotalTime
            ) {
                alert("Please enter values");
                return;
            }

            if (!data.roleId) {
                postRoles.push(data);
            } else {
                const existingRole = existingData[phase]?.roles?.find((prevData: any) =>
                    data.roleId === prevData.roleId && !equalcheck(data, { ...prevData })
                );
                if (existingRole) {
                    putRoles.push({ ...data, timeRanges: data.timeRanges.filter((range: any, index: number) => !equalcheck(range, existingRole.timeRanges[index])) });
                }
            }
        }

        if (postRoles.length === 0 && putRoles.length === 0) {
            alert("No New Values to Save");
            return;
        }
        const dataObj = {
            projectId: Number(projectId),
            phaseType: phase,
            approachId: Number(approachId),
            durationType: details?.[phase]?.durationType,
        };

        if (postRoles.length > 0) {

            const postObj = {
                ...dataObj,
                roles: postRoles
            };

            try {
                await dispatch(createRolesAndTimeRanges(postObj));
                postSuccess = true
                getLatestData();
            } catch (err: any) {
                postSuccess = false
            }
        }

        if (putRoles.length > 0) {
            const putObj = {
                ...dataObj,
                roles: putRoles
            };
            try {
                await dispatch(updateRolesAndTimeRanges(putObj));
                putSuccess = true
                getLatestData();
            } catch (err: any) {
                putSuccess = false
            }
        }
        if (postSuccess || putSuccess) {
            alert("Saved Successfully");
        } else {
            alert("Save Failed");
        }
    }


    function equalcheck(obj1: any, obj2: any) { return JSON.stringify(obj1) === JSON.stringify(obj2) }

    async function deleteData(isConfirmed = false) {
        let deleteArr: number[] = []
        let flag: boolean | undefined = undefined
        details?.[phase].roles.map((data: any, index: number) => {
            if (!data.hasOwnProperty("roleId")) {
                flag = true
            }
            if (checked.includes(index) && data.roleId) {
                deleteArr.push(data.roleId)
            }
        })
        //calling delete api
        const deleteObj = {
            projectId: projectId,
            phase: phase,
            approachId: parseInt(approachId),
            roleIds: deleteArr,
            updatedBy: "bounteous",
            updatedAt: new Date().toISOString()
        }
        if (deleteArr.length > 0) {
            if (flag == true && isConfirmed == false) {
                setopenAlert(true)
                return
            }
            try {
                await dispatch(deleteRoles(deleteObj))
                alert("Deleted Successfully");
                getLatestData()
                setConfirm(false)
                setopenAlert(false)
            } catch (err: any) {
                alert("Delete Failed");
            }
        } else {
            setDetails({
                ...details,
                [phase]: {
                    ...details?.[phase],
                    roles: details?.[phase].roles.filter((_: any, ind: number) => !checked.includes(ind))
                }
            })
        }

        setChecked([])
    }

    const handleClose = () => {
        setOpen(false);
    };

    // gets the total from timerange and updates in the respective role
    const updateData = (newTimeRanges: any, index: any) => {
        const getCostAndWeek = consolidateTotalCostAndWeeks(newTimeRanges);
        const updatingData = [...details?.[phase].roles]
        let a = updatingData[index].isFractionalAllocation;
        for (let i = 0; i < newTimeRanges.length; i++) {
            if (newTimeRanges[i].allocationPercentage != null) {
                a = true;
                break;
            }
        }
        const updatingRole = {
            ...updatingData[index],
            timeRanges: newTimeRanges,
            roleTotalCost: getCostAndWeek.totalCost,
            roleTotalTime: getCostAndWeek.weeks,
            isFractionalAllocation: a,
        };
        updatingData[index] = updatingRole;
        setDetails({
            ...details,
            [phase]: {
                ...details?.[phase],
                roles: updatingData
            }
        })
        handleClose();
    };

    function consolidateTotalCostAndWeeks(data: any) {
        let totalCost = 0;
        let weeks = 0;

        for (let i = 0; i < data.length; i++) {
            totalCost += data[i].rangeCost;
            weeks +=
            details?.[phase]?.durationType === MonthOrWeek.MONTHLY
                    ? calculateMonths(data[i].start, data[i].end)
                    : calculateWeeks(data[i].start, data[i].end);
        }
        return {
            totalCost,
            weeks,
        };
    }

    const handleDataChangeClick = (role: Role, index: number) => {
        setData(role, index);
    };

    return (
        <div className='pt-24 px-6 flex-col justify-center'>
            <div id='header' className='flex justify-between'>
                <div className='text-white gap-4 flex'>
                    <button onClick={() => { saveData() }} className='bg-[#0C1960] p-1 px-3 rounded-lg'>Save</button>
                    <button onClick={() => { deleteData() }} disabled={details?.[phase]?.roles?.length == 0 || checked.length == 0}
                        className={`bg-[#0C1960] p-1 px-3 rounded-lg ${(details?.[phase]?.roles?.length == 0 || checked.length == 0) && 'bg-slate-400'}`}>
                        Delete</button>
                </div>
                <div className={`bg-white rounded-md ${details?.[phase]?.roles?.length > 0 && 'pointer-events-none'}`}>
                    <button onClick={() => setDetails({ ...details, [phase]: { ...details?.[phase], durationType: "Monthly" } })}
                        className={`p-1 px-2 rounded-l-lg ${details?.[phase]?.durationType == 'Monthly' && 'bg-[#0C1960] text-white'} 
                                    ${details?.[phase]?.roles?.length > 0 && 'text-slate-200'}`}>
                        Monthly
                    </button>
                    <button onClick={() => setDetails({ ...details, [phase]: { ...details?.[phase], durationType: "Weekly" } })}
                        className={`p-1 px-2 rounded-r-lg ${details?.[phase]?.durationType == 'Weekly' && 'bg-[#0C1960] text-white'} 
                                    ${details?.[phase]?.roles?.length > 0 && 'text-slate-200'}`}>
                        Weekly
                    </button>
                </div>
            </div>
            <div className='relative w-full justify-center'>
                <div className='justify-center rounded-xl overflow-hidden mt-5'>
                    <table className='table-auto border-collapse border w-full min-w-[500px] overflow-x-scroll overflow-y-scroll'>
                        <thead className='text-white bg-[#5B53BD] border-b-2'>
                            <tr className='grid grid-cols-12'>
                                <th className='border-r-2 p-4 ' >
                                    <input type="checkbox" className='accent-transparent align-middle h-4 w-4 cursor-pointer' onChange={(e)=>{}}
                                        checked={checked.length == details?.[phase]?.roles?.length && details?.[phase]?.roles?.length !== 0}
                                        onClick={checkAll} name="selectAll" />
                                </th>
                                <th className='col-span-3 border-r-2 p-4'>Role</th>
                                <th className='col-span-3 border-r-2 p-4'>Region</th>
                                <th className='col-span-2 border-r-2 p-4'>Cost/Hr</th>
                                <th className='capitalize border-r-2 py-4'>{details?.[phase]?.durationType}</th>
                                <th className='col-span-2 p-4'>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                details?.[phase]?.roles?.length > 0 ?
                                    details?.[phase]?.roles.map((role: any, index: number) => {
                                        return (
                                            <tr key={index} className={`grid grid-cols-12 border-b-2 ${role.isFractionalAllocation? "bg-gradient-to-r from-[#EC6A0C70] to-[#EC6A0C10]" : "bg-white"}`}>
                                                <td className='p-4 border-r-2 text-center'>
                                                    <input type="checkbox" onClick={() => checkRole(index)} onChange={(e)=>{}} checked={checked.includes(index)}
                                                        className='cursor-pointer align-middle accent-transparent h-4 w-4 checkbox border-none' name="checkbox" />
                                                </td>
                                                <td className='p-4 border-r-2 col-span-3 '>
                                                    <select name="roleLookupId" onChange={(event) => handleDataChange(event?.target.value, event.target.name, index)}
                                                        value={role.roleLookupId}
                                                        className='w-full h-full border text-center rounded-md py-2 bg-transparent border-none'>
                                                        <option value={0} disabled>Select Role</option>
                                                        {allRoles?.map((Role: any, index:number) => <option key={index} selected={role.roleLookupId == Role.id} value={Role.id}>{Role.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className='p-4 border-r-2 col-span-3'>
                                                    <select name="regionId" disabled={role.roleLookupId == 0 || role.roleLookupId == null}
                                                        onChange={(event) => handleDataChange(event?.target.value, event.target.name, index)}
                                                        value={role.regionId}
                                                        className='border w-full text-center h-full rounded-md py-2 bg-transparent border-none'>
                                                        <option value={0} disabled>Select Region</option>
                                                        {allRegion?.map((Region: any, index:number) => <option key={index} selected={role.regionId == Region.id} value={Region.id}>{Region.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className='flex p-4 border-r-2 col-span-2'>
                                                    <div className='flex justify-evenly'>
                                                        <input
                                                            className='w-2/3 border text-center rounded-md py-1 px-1 [&::-webkit-inner-spin-button]:appearance-none bg-transparent border-none'
                                                            disabled={role.regionId === 0 || role.regionId === null}
                                                            onChange={(event) => handleDataChange(event.target.value, event.target.name, index)}
                                                            name='costPerHour'
                                                            value={role.regionId === 0 || role.regionId === null ? '' : role.costPerHour}
                                                            type="number"
                                                        />
                                                    </div>
                                                    <div className="relative inline-block mb-1 justify-items-center">
                                                        <Image
                                                            src={toolTip}
                                                            alt="image"
                                                            height={35}
                                                            width={35}
                                                            className="inline cursor-pointer"
                                                            onMouseEnter={() => setShowTooltip(index)}
                                                            onMouseLeave={() => setShowTooltip(-1)}
                                                        />

                                                        <div
                                                            className={`w-24 ml-1 text-xs absolute opacity-100 left-full top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-2 rounded ${showTooltip === index ? "block" : "hidden"
                                                                }`}
                                                        >
                                                            {role.regionId === 0 || role.roleLookupId === 0 ? (
                                                                <span>Please select the fields</span>
                                                            ) : (
                                                                <>
                                                                    Original Cost: <span className="font-bold">{role.originalCost}</span>
                                                                </>
                                                            )}
                                                        </div>


                                                    </div>
                                                </td>
                                                <td className='py-4 border-r-2 col-span-1 text-center'>
                                                    {
                                                        role.roleTotalTime == null ?
                                                            <button className='text-xs text-gray-600 rounded-lg border-[2px] py-1 mx-1'
                                                                disabled={role.costPerHour == 0 || role.costPerHour == null}
                                                                onClick={() => handleDataChangeClick(role, index)}>
                                                                <p>Configure {details?.[phase]?.durationType}</p>
                                                            </button>
                                                            :
                                                            <div className="">
                                                                {role.roleTotalTime}
                                                                <button className="ml-1" disabled={role.costPerHour == 0 || role.costPerHour == null} onClick={() => handleDataChangeClick(role, index)}>
                                                                    <Image
                                                                        src={DateIcon}
                                                                        alt="Example Image"
                                                                        width={12}
                                                                        height={12}
                                                                    />
                                                                </button>
                                                            </div>
                                                    }
                                                </td>
                                                <td className='p-4 border-r-2 col-span-2 text-center'>
                                                    $ {role.roleTotalCost || 0}
                                                </td>
                                            </tr>
                                        )
                                    }) :
                                    <tr className='border-b-2 bg-white'>
                                        <td className='text-center p-4'>No Data</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div onClick={() => { addItem() }} className='absolute -bottom-3 bg-white p-1 rounded-full right-1/2 cursor-pointer'>
                    <AddImage color={'#2B205F'} width={20} height={20} />
                </div>
            </div>
            <Modal
                open={open}
                durationType={details?.[phase]?.durationType}
                handleClose={handleClose}
                calendarProps1={calendarProps}
                onChildDataChange={updateData}
                resourcePlann={resourcePlann}
                currentPhase={phase}
                existingDatas={existingData[phase].roles}
                selectedRole={selectedRole}
                getLatestData={getLatestData}
            />
            <DeleteModal
                open={openAlert}
                setOpen={setopenAlert}
                setConfirm={setConfirm}
                data={"Any unsaved data will be gone. Are you sure?"}
            />
        </div>
    )
}

export default Table