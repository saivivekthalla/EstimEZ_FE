import axiosConfig from "@/helper/constants/api/axiosConfig";
import instance from "@/helper/constants/api/config";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit/dist";
 
const initialState: any = {
    status: false,
    error: "",
    wbsEstimationDetails: [{}],
    masterTemplate: [{}],
    currentTemplate: {}

}
 
export const createWbsStrategy = createAsyncThunk("wbs/createWbsStrategy", async(data: any) =>{
    try{
        const response = await instance.post('/projects/estimation/wbs', data)
        return response.data;
    } catch(err: any){
        return err.message;
    }
});
 
export const updateWbsStrategy = createAsyncThunk('wbs/updateWbsStrategy', async (receiveddata: any) => {
    const { data, wbsStrategyId } = receiveddata
    try {
        const response = await instance.put(`projects/estimation/wbs/${wbsStrategyId}`, data);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})
 
export const deleteWbsStrategy = createAsyncThunk('wbs/deleteWbsStrategy', async (data: any) => {
    try {
        const response = await instance.post('projects/estimation/wbs/delete', data);
        return response.data;
    } catch (err: any) {
        return err;
    }
})

export const getMasterWbsTemplate = createAsyncThunk('wbs/masterTemplate', async (practiceIds: any) => {
    try {
        const response = await instance.get(`/estimation/masterTemplate/${practiceIds}`);
        return response.data;
    } catch (err: any) {
        return err;
    }
});
 

export const createTemplate = createAsyncThunk('wbs/createTemplate', async (data: any) => {
    try {
        const response = await instance.post('/projects/estimation/template', data);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})

export const updateTemplate = createAsyncThunk('wbs/updateTemplate', async (receiveddata: any) => {
    const { putData, id } = receiveddata;
    try {
        const response = await instance.put(`/projects/estimation/template/${id}`, putData);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})

export const getCurrentWbsTemplate = createAsyncThunk('wbs/currentTemplate', async ({ templateId, strategyId }: { templateId: number; strategyId: number }) => {
    try {
        const response = await instance.get(`/projects/estimation/template/${templateId}/${strategyId}`);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})

const wbsSlice: any = createSlice({
    name: 'wbs',
    initialState,
    reducers: {
        setWbsEstimationDetails: (state, action) => {
            state.wbsEstimationDetails = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createWbsStrategy.pending, (state, action) => {
            state.status = false;
        })
        builder.addCase(createWbsStrategy.fulfilled, (state, action) => {
            state.status = true;
        })
        builder.addCase(createWbsStrategy.rejected, (state, action) =>{
            state.status = false;
            state.error = action.error.message ? action.error.message : null
        })
        builder.addCase(updateWbsStrategy.pending, (state, action) => {
            state.status = false;
        })
        builder.addCase(updateWbsStrategy.fulfilled, (state, action) => {
            state.status = true;
        })
        builder.addCase(updateWbsStrategy.rejected, (state, action) =>{
            state.status = false;
            state.error = action.error.message ? action.error.message : null
        })
        builder.addCase(deleteWbsStrategy.pending, (state, action) => {
            state.status = false;
        })
        builder.addCase(deleteWbsStrategy.fulfilled, (state, action) => {
            state.status = true;
        })
        builder.addCase(deleteWbsStrategy.rejected, (state, action) =>{
            state.status = false;
            state.error = action.error.message ? action.error.message : null
        })
        builder.addCase(getMasterWbsTemplate.pending, (state, action) => {
            state.status = false;
        })
        builder.addCase(getMasterWbsTemplate.fulfilled, (state, action) => {
            state.status = true;
            state.masterTemplate = action.payload;
        })
        builder.addCase(getMasterWbsTemplate.rejected, (state, action) =>{
            state.status = false;
            state.error = action.error.message ? action.error.message : null
        })

        builder.addCase(getCurrentWbsTemplate.pending, (state, action) => {
            state.status = false;
        })
        builder.addCase(getCurrentWbsTemplate.fulfilled, (state, action) => {
            state.status = true;
            state.currentTemplate = action.payload;
        })
        builder.addCase(getCurrentWbsTemplate.rejected, (state, action) =>{
            state.status = false;
            state.error = action.error.message ? action.error.message : null
        })
        .addCase(updateTemplate.pending, (state, action) => {
            state.status = false;
        })
        .addCase(updateTemplate.fulfilled, (state, action) => {
            state.status = true;
        })
        .addCase(updateTemplate.rejected, (state, action) => {
            state.status = false;
            state.error = action.error.message ? action.error.message : null
        })
    }
})


export const {setWbsEstimationDetails,setCurrentTemplate} = wbsSlice.actions;
 
export const getWbsEstimationDetails = (state: any) => state?.wbs?.wbsEstimationDetails

export const fetchMasterTemplate = (state: any) => state?.wbs?.masterTemplate

export const fetchCurrentTemplate = (state: any) => state?.wbs?.currentTemplate

export default wbsSlice.reducer