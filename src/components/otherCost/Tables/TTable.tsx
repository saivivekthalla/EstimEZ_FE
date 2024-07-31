import AddImage from "@/assets/icons/AddImage"
import SubtractImage from "@/assets/icons/SubstractImage";
import { deleteOtherCost, fetchTravelCategories, getOtherCost, getTravelExpensesTotal, getTravelRow, setTravelExpensesTotal, setTravelRow } from "@/features/budget/otherCostDiscountSlice";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/features/store";
import { useSearchParams } from "next/navigation";
import Confirmation from "@/components/common/Modal/Confirmation";
import { useEffect, useState } from "react";


interface TTableData {
    otherCostId?: number,
    travelExpenseId: number,
    cost: number
}

export const TTable = ({setBackendData} :any) => {
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: any = searchParams.get('projectId');
    const dispatch = useDispatch<AppDispatch>()
    const options = useSelector(fetchTravelCategories)
    const rows :Array<TTableData> = useSelector(getTravelRow)
    const total = useSelector(getTravelExpensesTotal)
    const [open, setOpen] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [deleteData, setDelete] = useState(0)
    useEffect(()=>{
        if(confirm){
            dispatch(deleteOtherCost({projectId: projectId, otherCostId: deleteData})).then((res :any)=>{
                dispatch(getOtherCost(projectId)).then((res :any)=>{
                    setBackendData(res.payload)
                    if(res?.payload?.travelExpenses.length > 0)
                        dispatch((setTravelRow(res?.payload?.travelExpenses)))
                    else
                        dispatch(setTravelRow([{travelExpenseId: 0,cost:0}]))
                    dispatch(setTravelExpensesTotal(res?.payload?.travelExpensesAmount))
                })
                alert("Deleted Successfully")
            })
        }
    },[confirm])
    const addItem = () => {
        dispatch(setTravelRow([...rows,{travelExpenseId: 0,cost:0}]))
    }
    
    const removeItem = async(index: number) => {
        const object = rows.find((_ :TTableData,ind: number)=> ind == index)
        if(object && compareData(object) && rows.length == 1){
            alert("Please Enter Values")
        }
        else
        {
            if(object?.otherCostId){
                setDelete(object?.otherCostId)
                setOpen(true)
                setConfirm(false)
            }
            else{
                dispatch(setTravelExpensesTotal(total-rows[index].cost))
                const updatedArray = rows.filter((_ :TTableData,ind: number)=> ind !== index)
                dispatch(setTravelRow(updatedArray))
                if(rows.length == 1)
                    dispatch(setTravelRow([{travelExpenseId: 0,cost:0}]))
            }
        }
    }

    const handleTotal = (value: string, index: number) => {
        let total :number = isNaN(parseInt(value)) ? 0 : parseInt(value)
        const updatedArray = rows.map((object:TTableData, ind:number) => {
            const obj = {...object}
            if(ind == index) 
                obj.cost = total
            return obj
        })
        dispatch(setTravelRow(updatedArray))
        let tot :number=0
        updatedArray.map((obj: any) => tot+=Number(obj.cost))
        dispatch(setTravelExpensesTotal(tot))
    }

    const handleModel = (value :number, index: number) => {
        const updatedArray = rows.map((object: TTableData, ind: number) => {
            const obj = {...object}
            if(ind == index)
                obj.travelExpenseId = value
            return obj
        })
        dispatch(setTravelRow(updatedArray))
    }

    const compareData = (object: TTableData) => {
        return object.travelExpenseId == 0 && object.cost == 0;
    }

    return(
        <>
        <div className='rounded-lg overflow-hidden border flex justify-center'>
            <table className='table-auto gap-8'>
                <thead className='bg-[#1D154ACC]'>
                    <tr>
                        <th className='p-2'>Category</th>
                        <th>Cost</th>
                        <th></th>
                    </tr>        
                </thead>
                <tbody className='bg-[#4B3D99B8]'>
                    {
                        rows?.map((object: TTableData, index: number) => {
                        return(
                            <tr key={index}>
                                <td className='p-3 pl-12'>
                                    <select className='bg-transparent p-2 rounded-md' value={object.travelExpenseId} onChange={(event)=>handleModel(parseInt(event.target.value),index)} name="model" id="">
                                        <option disabled className="bg-[#4B3D99B8]" value={0}>Select Model</option>
                                        {
                                            Array.isArray(options) && options?.map((element :any) => {
                                                return (
                                                    <option className="bg-[#4B3D99B8]" value={element.id}>{element.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </td>
                                <td className='p-3'>
                                    <input onChange={(event)=>handleTotal(event.target.value, index)} 
                                        className='bg-[#01105F] rounded-md w-24 p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                        value={(object.cost==0)?"":object.cost}
                                        placeholder="Enter Cost"
                                        type="number" />
                                </td>
                                <td className='p-3 px-6 text-[#4B3D99B8]' onClick={()=>removeItem(index)}>
                                    <SubtractImage width={20} height={20} color={"white"}/>
                                </td>
                            </tr>
                        )})
                    }
                </tbody>
            </table>
            <div className="absolute bottom-1" onClick={()=>addItem()}>
                <AddImage width={20} height={20} color={"#01105F"}/>
            </div>
        </div>
        <Confirmation 
            open={open}
            setOpen={setOpen}
            data='Any unsaved data will be gone. Are you sure?'
            setConfirm={setConfirm}
        />
        </>
    )
}