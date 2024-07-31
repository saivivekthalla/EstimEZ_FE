import instance from "@/helper/constants/api/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState :any = {
    statusline: false,
    statusdonut: false,
    statusmonthly: false,
    lineChartData: [],
    donutChartData: [],
    rrrrData: [],
    monthlyInvoiceData: {},
    error: null
};

export const getRRRRAnalysis = createAsyncThunk("deal-desk/getRRRRAnalysis", async (projectId :any) =>{
    try{
        const res = await instance.get(`projects/deal-desk/resource/custom-cost/${projectId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.message);
    }
})

export const getLinechart = createAsyncThunk("deal-desk/getLinechart", async (projectId :any) =>{
    try{
        const res = await instance.get(`projects/deal-desk/resource/${projectId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.message);
    }
})

export const getDonutchart = createAsyncThunk("deal-desk/getDonutchart", async (projectId :any) =>{
    try{
        const res = await instance.get(`projects/deal-desk/resource/region/${projectId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.message);
    }
})

export const postMonthlyInvoice = createAsyncThunk("deal-desk/getMonthlyInvoice", async(data: any) => {
    const {date, projectId} = data;
    try {
        const res = await instance.post(`projects/deal-desk/monthly-invoice/${projectId}`,date);
        return res.data;        
    } catch (error: any) {
        throw new Error (error.message)
    }
})

const linechartSlice = createSlice({
    name:'lineChart',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getLinechart.pending, (state, action) =>{
            state.statusline = false;
        })
        .addCase(getLinechart.fulfilled, (state, action) =>{
            state.statusline = true;
            state.lineChartData = action.payload;            
        })
        .addCase(getLinechart.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(getDonutchart.pending, (state, action) =>{
            state.statusdonut = false;
        })
        .addCase(getDonutchart.fulfilled, (state, action) =>{
            state.statusdonut = true;
            state.donutChartData = action.payload;            
        })
        .addCase(getDonutchart.rejected, (state, action) =>{
            state.statusdonut = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(getRRRRAnalysis.pending, (state, action) =>{
            state.status = false;
        })
        .addCase(getRRRRAnalysis.fulfilled, (state, action) =>{
            state.status = true;        
            state.rrrrData = action.payload;  
        })
        .addCase(getRRRRAnalysis.rejected, (state, action) =>{
            state.status = false;
        })
        .addCase(postMonthlyInvoice.pending, (state, action)=>{
            state.statusmonthly = false;
        })
        .addCase(postMonthlyInvoice.fulfilled, (state, action)=>{
            state.statusmonthly = true;
            state.monthlyInvoiceData = action.payload;
        })
        .addCase(postMonthlyInvoice.rejected, (state, action)=>{
            state.statusmonthly = false;
            state.error = action.error.message ? action.error.message : null;
        })
    },
});

export const fetchLinechartData = (state: any) => state?.dealDesk?.lineChartData;
export const fetchDonutchartData = (state: any) => state?.dealDesk?.donutChartData;
export const fetchRRRRAnalysisData = (state: any) => state?.dealDesk?.rrrrData;
export const fetchMonthlyInvoice = (state: any) => state?.dealDesk?.monthlyInvoiceData;
export const fetchLinechartStatus = (state: any) => state?.dealDesk?.statusline
export const fetchDonutchartStatus = (state: any) => state?.dealDesk?.statusdonut

export default linechartSlice.reducer;