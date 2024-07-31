import { useEffect, useState } from 'react';
import CustomerChargeBack from './CustomerChargeBack'
import ProductLicense from './ProductLicense';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/features/store';
import { getCustomerChargeBackTotal, getOhterCostTotal, getOtherCost, getProductLicenseTotal, getSoftwareLicenseTotal, getTravelRow, getplRow, getslRow, lookupProduct, lookupSoftware, lookupTravel, postOtherCost, putOtherCost, setCustomerChargeBackTotal, setOtherCostTotal, setProductLicenseTotal, setSoftwareLicenseTotal, setTravelExpensesTotal, setTravelRow, setplRow, setslRow } from '@/features/budget/otherCostDiscountSlice';
import { useSearchParams } from 'next/navigation';
import { setdataSaved } from '@/features/resource/resourcePlanningSlice';

const OtherCost = () => {
    const dispatch = useDispatch<AppDispatch>()
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: any = searchParams.get('projectId');
    const [backendData, setBackendData] = useState<any>()
    const otherCostTotal = useSelector(getOhterCostTotal)
    const ccBTotal = useSelector(getCustomerChargeBackTotal)
    const plBTotal = useSelector(getProductLicenseTotal)
    const travelRow = useSelector(getTravelRow)
    const plRow = useSelector(getplRow)
    const slRow = useSelector(getslRow)
    
    useEffect(()=>{
        dispatch(lookupTravel())
        dispatch(lookupProduct())
        dispatch(lookupSoftware())
        dispatch(getOtherCost(projectId)).then((res :any)=>{
            setBackendData(res.payload)
            if(res?.payload?.productLicense.length > 0)
                dispatch(setplRow(res?.payload?.productLicense))
            else
                dispatch(setplRow([{productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0}]))

            if(res?.payload?.softwareLicense.length > 0)
                dispatch(setslRow(res?.payload?.softwareLicense))
            else
                dispatch(setslRow([{hardwareSoftwareLicenseFee: 0, softwareLicenseModelId: 0, unitCost: 0, noOfUnits:0}]))

            if(res?.payload?.travelExpenses.length > 0)
                dispatch((setTravelRow(res?.payload?.travelExpenses)))
            else
                dispatch(setTravelRow([{travelExpenseId: 0,cost:0}]))
            
            dispatch(setTravelExpensesTotal(res?.payload?.travelExpensesAmount))
            dispatch(setSoftwareLicenseTotal(res?.payload?.softwareLicenseAmount))
            dispatch(setCustomerChargeBackTotal(res?.payload?.customerChargeBackAmount))
            dispatch(setProductLicenseTotal(res?.payload?.productLicenseAmount))
            dispatch(setOtherCostTotal(res?.payload?.totalAmount))
        })
        
    },[])
    useEffect(()=>{
        dispatch(setOtherCostTotal(plBTotal+ccBTotal))
    },[plBTotal,ccBTotal])

    useEffect(()=>{
        const travel = travelRow?.filter((data: any, index: number)=> !equalcheck(data,backendData?.travelExpenses[index]) && !equalcheck({travelExpenseId: 0,cost:0},data))
        const software = slRow?.filter((data: any, index: number)=> !equalcheck(data, backendData?.softwareLicense[index]) && !equalcheck({hardwareSoftwareLicenseFee: 0, softwareLicenseModelId: 0, unitCost: 0, noOfUnits:0},data))
        const product = plRow?.filter((data: any, index: number)=>  !equalcheck(data, backendData?.productLicense[index]) && !equalcheck({productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0},data))
        if(travel.length > 0 || software.length > 0 || product.length > 0){
            dispatch(setdataSaved(false))
        }
        else
            dispatch(setdataSaved(true))
    },[travelRow,slRow,plRow,backendData])

    async function saveData() {
        let postSuccess = false, putSuccess = false;
        const travelCheck = travelRow.filter((data:any)=> (data.travelExpenseId == 0 || data.cost == 0) && !equalcheck({travelExpenseId: 0,cost:0},data))
        const softwareCheck = slRow.filter((data :any)=> (data.hardwareSoftwareLicenseFee == 0 || data.softwareLicenseModelId == 0 || data.unitCost == 0 || data.noOfUnits == 0) && !equalcheck({hardwareSoftwareLicenseFee: 0, softwareLicenseModelId: 0, unitCost: 0, noOfUnits:0},data))
        const productCheck = plRow.filter((data :any)=> (data.productName == '' || data.productLicenseModelId == 0 || data.unitCost == 0 || data.noOfUnits == 0) && !equalcheck({productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0},data))
        console.log(travelCheck,softwareCheck,productCheck);
        
        if(travelCheck.length > 0 || softwareCheck.length > 0 || productCheck.length > 0){
            alert("Please Enter All Values");
            return
        }
        const postObj = {
            projectId: projectId,
            travelExpenseDTOS : travelRow?.filter((data: any)=> !data.hasOwnProperty('otherCostId') && !equalcheck({travelExpenseId: 0,cost:0},data)),
            softwareLicenseDTOS : slRow?.filter((data: any)=> !data.hasOwnProperty('otherCostId') && !equalcheck({hardwareSoftwareLicenseFee: 0, softwareLicenseModelId: 0, unitCost: 0, noOfUnits:0},data)),
            productLicenseDTOS : plRow?.filter((data: any)=> !data.hasOwnProperty('otherCostId') && !equalcheck({productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0},data)),
            createdAt: new Date().toISOString(),
            createdBy: "Bounteous"
        }
        const putObj = {
            projectId: projectId,
            travelExpenseDTOS : travelRow?.filter((data: any, index: number)=>data.hasOwnProperty('otherCostId') && !equalcheck(data,backendData?.travelExpenses[index]) && !equalcheck({travelExpenseId: 0,cost:0},data)),
            softwareLicenseDTOS : slRow?.filter((data: any, index: number)=>data.hasOwnProperty('otherCostId') && !equalcheck(data, backendData?.softwareLicense[index]) && !equalcheck({hardwareSoftwareLicenseFee: 0, softwareLicenseModelId: 0, unitCost: 0, noOfUnits:0},data)),
            productLicenseDTOS : plRow?.filter((data: any, index: number)=> data.hasOwnProperty('otherCostId') && !equalcheck(data, backendData?.productLicense[index]) && !equalcheck({productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0},data)),
            updatedAt: new Date().toISOString(),
            updatedBy: "Bounteous"
        }
        if(postObj.productLicenseDTOS.length == 0 && postObj.softwareLicenseDTOS.length == 0 && postObj.travelExpenseDTOS.length == 0 &&
            putObj.productLicenseDTOS.length == 0 && putObj.softwareLicenseDTOS.length == 0 && putObj.travelExpenseDTOS.length == 0){
                alert("No new values to save")
                return
            }

        if(postObj.productLicenseDTOS.length > 0 || postObj.softwareLicenseDTOS.length > 0 || postObj.travelExpenseDTOS.length > 0){
            await dispatch(postOtherCost(postObj)).then((res: any)=>{
                dispatch(getOtherCost(projectId)).then((res :any)=>{
                    setBackendData(res.payload)
                    if(res?.payload?.productLicense.length > 0)
                        dispatch(setplRow(res?.payload?.productLicense))
                    if(res?.payload?.softwareLicense.length > 0)
                        dispatch(setslRow(res?.payload?.softwareLicense))
                    if(res?.payload?.travelExpenses.length > 0)
                        dispatch((setTravelRow(res?.payload?.travelExpenses)))
                    dispatch(setTravelExpensesTotal(res?.payload?.travelExpensesAmount))
                    dispatch(setSoftwareLicenseTotal(res?.payload?.softwareLicenseAmount))
                    dispatch(setCustomerChargeBackTotal(res?.payload?.customerChargeBackAmount))
                    dispatch(setProductLicenseTotal(res?.payload?.productLicenseAmount))
                    dispatch(setOtherCostTotal(res?.payload?.totalAmount))
                })
            })
            postSuccess = true
        }
        if(putObj.productLicenseDTOS.length > 0 || putObj.softwareLicenseDTOS.length > 0 || putObj.travelExpenseDTOS.length > 0){
            await dispatch(putOtherCost(putObj)).then((res: any)=>{
                dispatch(getOtherCost(projectId)).then((res :any)=>{
                    setBackendData(res.payload)
                    if(res?.payload?.productLicense.length > 0)
                        dispatch(setplRow(res?.payload?.productLicense))
                    if(res?.payload?.softwareLicense.length > 0)
                        dispatch(setslRow(res?.payload?.softwareLicense))
                    if(res?.payload?.travelExpenses.length > 0)
                        dispatch((setTravelRow(res?.payload?.travelExpenses)))
                    dispatch(setTravelExpensesTotal(res?.payload?.travelExpensesAmount))
                    dispatch(setSoftwareLicenseTotal(res?.payload?.softwareLicenseAmount))
                    dispatch(setCustomerChargeBackTotal(res?.payload?.customerChargeBackAmount))
                    dispatch(setProductLicenseTotal(res?.payload?.productLicenseAmount))
                    dispatch(setOtherCostTotal(res?.payload?.totalAmount))
                })
            })
            putSuccess = true
        }
        if(putSuccess || postSuccess)
            alert("Saved Successfully")
        else
            alert("Save Failed")
    }

    function equalcheck(obj1: any, obj2: any) { return JSON.stringify(obj1) === JSON.stringify(obj2) }

    return(
        <div className="bg-[#1D154AE5] p-6 gap-7 text-white rounded-md">
            <div className="flex justify-between p-3 items-center">
                <p className='text-2xl font-extralight'>Budget - Other Costs </p>
                <div className="flex gap-2 items-center text-lg">
                    <p className='font-medium'>Total Amount : </p>
                    <p className="bg-[#1D154A] px-2 rounded-md font-thin">$ {otherCostTotal}</p>
                </div>
                <button className='border border-[#B7C4F2BD] px-4 py-1 rounded-sm'
                    onClick={saveData}>
                    Save
                </button>
            </div>
            <CustomerChargeBack setBackendData={setBackendData} />
                <hr className='m-7'/>
            <ProductLicense setBackendData={setBackendData} />
        </div>
    );
};

export default OtherCost;