import CreateEstimation from "./CreateEstimation";
import PreviousEstimations from "./PreviousEstimations";
import RecentDashboard from "./RecentDashboard";
import { setdataSaved } from "@/features/resource/resourcePlanningSlice";
import { AppDispatch } from "@/features/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {setSubMenuOpen} from "@/features/budget/otherCostDiscountSlice"

export const InfoDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(setdataSaved(true))
        dispatch(setSubMenuOpen(true))
    }, []);

    return (
        <div className="flex flex-col w-full h-full gap-y-8">
            <div className="grid grid-cols-6 basis-1/2">
                <div className="col-span-3">
                    <CreateEstimation />
                </div>
                <div className="col-span-3">
                    <PreviousEstimations />
                </div>
            </div>
            <div className="basis-1/2">
                <RecentDashboard />
            </div>
        </div>
    )

}



