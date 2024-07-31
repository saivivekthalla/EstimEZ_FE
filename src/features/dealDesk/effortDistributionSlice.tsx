import instance from "@/helper/constants/api/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    effortDistributionData : [
        {
          category: "Executives",
          count: 0,
          percentage: 0,
          totalCost: 0,
          totalTime: 0,
        },
        {
          category: "Leads",
          count: 0,
          percentage: 0,
          totalCost: 0,
          totalTime: 0,
        },
        {
          category: "Seniors",
          count: 0,
          percentage: 0,
          totalCost: 0,
          totalTime: 0,
        },
        {
          category: "Associates",
          count: 0,
          percentage: 0,
          totalCost: 0,
          totalTime: 0,
        },
      ]
};

export const getEffortDistribution = createAsyncThunk("deal-desk/getEffortDistribution", async (projectId :any) =>{
    try{
        const res = await instance.get(`projects/deal-desk/effort-distribution/${projectId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.message);
    }
});

const effortDistributionSlice = createSlice({
    name:'effortDistribution',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getEffortDistribution.pending, (state, action) =>{
            state.statusline = false;
        })
        .addCase(getEffortDistribution.fulfilled, (state, action) =>{
            state.statusline = true;
            state.effortDistributionData = action.payload;            
        })
        .addCase(getEffortDistribution.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
    },
});

export const fetchEffortDistributionData = (state: any) => state?.effortDistribution?.effortDistributionData;

export default effortDistributionSlice.reducer;