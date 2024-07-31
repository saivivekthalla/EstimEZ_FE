import AddImage from "@/assets/icons/AddImage"
import SubtractImage from "@/assets/icons/SubstractImage";
import Confirmation from "@/components/common/Modal/Confirmation";
import { deleteOtherCost, fetchProductCategories, getOtherCost, getProductLicenseTotal, getplRow, setProductLicenseTotal, setplRow } from "@/features/budget/otherCostDiscountSlice"
import { AppDispatch } from "@/features/store"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

interface PlTableData
 {
    otherCostId?: number,
    productName: string,
    productLicenseModelId : number,
    unitCost: number,
    noOfUnits: number,
}

const PLTable = ({setBackendData} :any) => {
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: any = searchParams.get('projectId');
    const dispatch = useDispatch<AppDispatch>()
    const options = useSelector(fetchProductCategories)
    const row :Array<PlTableData>= useSelector(getplRow)
    const total = useSelector(getProductLicenseTotal)
    const [open, setOpen] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [deleteData, setDelete] = useState(0)

    useEffect(() => {
        if(confirm){
            dispatch(deleteOtherCost({projectId: projectId, otherCostId: deleteData})).then((res :any)=>{
                dispatch(getOtherCost(projectId)).then((res :any)=>{
                    setBackendData(res.payload)
                    if(res?.payload?.productLicense.length > 0)
                        dispatch(setplRow(res?.payload?.productLicense))
                    else
                        dispatch(setplRow([{productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0}]))
                    dispatch(setProductLicenseTotal(res?.payload?.productLicenseAmount))
                })
                alert("Deleted Successfully")
            })
        }
    }, [confirm])
    
    const handleTotal = (row :Array<PlTableData>) => {
        let tot :number=0
        row.map((obj: any) => tot+= isNaN(obj.unitCost * obj.noOfUnits) ? 0 : obj.unitCost * obj.noOfUnits)
        dispatch(setProductLicenseTotal(tot))
    }

    const handleUnit = (value :string, index: number) => {
        const updatedArray = row.map((object: PlTableData, ind: number) => {
            const obj = {...object}
            if(ind == index)
                obj.noOfUnits = isNaN(parseInt(value)) || value == undefined ? 0 : parseInt(value)
            return obj
        })
        dispatch(setplRow(updatedArray))
        handleTotal(updatedArray)
    }

    const handleCost = (value :string, index: number) => {        
        const updatedArray = row.map((object: PlTableData, ind: number) => {
            const obj = {...object}
            if(ind == index)
                obj.unitCost = isNaN(parseInt(value)) || value == undefined ? 0 : parseInt(value)
            return obj
        })
        dispatch(setplRow(updatedArray))
        handleTotal(updatedArray)
    }

    const handleModel = (value :number, index: number) => {        
        const updatedArray = row.map((object: PlTableData, ind: number) => {
            const obj = {...object}
            if(ind == index)
                obj.productLicenseModelId = value
            return obj
        })
        dispatch(setplRow(updatedArray))
    }

    const handleName = (value :string, index: number) => {
        const updatedArray = row.map((object: PlTableData, ind: number) => {
            const obj = {...object}
            if(ind == index)
                obj.productName = value
            return obj
        })
        dispatch(setplRow(updatedArray))
    }

    const addItem = () => {
        dispatch(setplRow([...row,{productName: '',productLicenseModelId: 0,unitCost: 0, noOfUnits:0}]))
    }

    const removeItem = async(index: number) => {
        const object : any = row.find((_ :PlTableData ,ind: number) => ind == index)
        if(object && compareData(object) && row.length == 1)
            alert("Please enter values")
        else{
            if(object.otherCostId){
                setDelete(object?.otherCostId)
                setOpen(true)
                setConfirm(false)
            }
            else{
                dispatch(setProductLicenseTotal(total-(row[index].unitCost * row[index].noOfUnits)))
                const updatedArray = row.filter((_ :PlTableData,ind :number)=> ind !== index)
                dispatch(setplRow(updatedArray))
                if(row.length == 1)
                    dispatch(setplRow([{productName: '',productLicenseModelId: 0,unitCost: 0, noOfUnits:0}]))
            }
        }
    }

    const compareData = (object: PlTableData) => {
        return object.productName == '' && object.productLicenseModelId == 0 && object.unitCost == 0 && object.noOfUnits == 0
    }

    return(
        <>
        <div className="relative justify-center rounded-lg overflow-hidden">
            <table className='table-auto'>
                <thead className='bg-[#1D154ACC]'>
                    <tr>
                        <th>Product Name</th>
                        <th>Subscription<br />Model</th>
                        <th>Charge Per <br /> Unit</th>
                        <th>No. of Time <br />Units</th>
                        <th>Total Cost</th>
                        <th></th>
                    </tr>        
                </thead>
                <tbody className='bg-[#4B3D99B8]'>
                    {
                        row.map((object:any, index: number)=>{                            
                            return(
                                <tr key={index}>
                                    <td className='p-3'>
                                        <input onChange={(event)=>handleName(event?.target.value, index)}
                                            className='bg-[#01105F] rounded-md p-1 pl-2' placeholder='Enter Product Name' 
                                            value={object.productName} type="text" />
                                    </td>
                                    <td className='p-3'>
                                        <select onChange={(event)=>handleModel(parseInt(event.target.value), index)} 
                                            value={object.productLicenseModelId}
                                            className='bg-[#01105F] p-2 rounded-md' name="model">
                                            <option value={0}>Select Model</option>
                                            {
                                                Array.isArray(options) && options?.map((element :any) => {
                                                    return (
                                                        <option value={element.Id}>{element.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </td>
                                    <td className='p-3'>
                                        <input onChange={(event)=>handleCost(event?.target.value, index)} 
                                            className='bg-[#01105F] rounded-md w-24 p-1 text-center' 
                                            value={(object.unitCost==0)?"":object.unitCost} 
                                            type="number" />
                                    </td>
                                    <td className='p-3'>
                                        <input onChange={(event)=>handleUnit(event?.target.value, index)}
                                            className='bg-[#01105F] rounded-md w-24 p-1 text-center' 
                                            value={(object.noOfUnits==0)?"":object.noOfUnits}
                                            type="number"/>
                                    </td>
                                    <td className='p-3'>
                                        <div className='bg-[#01105F] rounded-md w-24 p-1 text-center truncate'>
                                            {isNaN(object.unitCost * object.noOfUnits) ? 0 : object.unitCost * object.noOfUnits}
                                        </div>
                                    </td>
                                    <td className='p-3 px-6 text-[#4B3D99B8]' onClick={()=>removeItem(index)}>
                                        <SubtractImage width={20} height={20} color={"white"}/>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
            <div className="absolute bottom-1" onClick={()=>addItem()}>
                <AddImage width={20} height={20} color={"#01105F"}/>
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

export default PLTable