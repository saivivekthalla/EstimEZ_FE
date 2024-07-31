import instance from "@/helper/constants/api/config";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit/dist";
import axios from "axios";
 
interface stateProps {
    estimationTask: [];
    estimationSubTask: [];
    summaryCalculation: [];
    showSubTasks: boolean;
    showEstimatedHours: boolean;
    estimationCalc: any;
    status: boolean;
    error: string | null;
    currentTaskId: number;
    currenSubTaskId: number;
    currentTemplateId: number,
    currentComponent: {},
    enableTextBox: boolean;
    currentWBS: {};
    currentPractice: {};
}
 
const initialState: stateProps = {
    estimationTask: [],
    estimationSubTask: [],
    summaryCalculation: [],
    showSubTasks: false,
    showEstimatedHours: false,
    estimationCalc: [],
    status: false, // 'idle | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentTaskId: 1,
    currenSubTaskId: 1,
    currentTemplateId: 0,
    currentComponent: {},
    enableTextBox: true,
    currentWBS: {},
    currentPractice: {},
}
 
export const fetchEstimationTask = createAsyncThunk('estimationSummary/fetchEstimationTask', async (practiceIds: any) => {
    try {
        const response = await instance.get(`/estimation/masterTemplate/${practiceIds}`);
        return response.data[0];
    } catch (err: any) {
        return err.message;
    }
})
 
export const createEstimationSummary = createAsyncThunk('estimationSummary/createEstimationSummary', async (data: any) => {
    try {
        const response = await instance.post('/projects/estimation/template', data);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})
 
export const updateEstimationSummary = createAsyncThunk('estimationSummary/updateEstimationSummary', async (receiveddata: any) => {
    const { data, id } = receiveddata;
    try {
        const response = await instance.put(`/projects/estimation/template/${id}`, data);
        return response.data;
    } catch (err: any) {
        return err.message;
    }
})
 
const estimateSlice = createSlice({
    name: 'estimationSummary',
    initialState,
    reducers: {
        showSubTasks: (state, action) => {
            state.showSubTasks = action.payload;
        },
        showEstimatedHours: (state, action) => {
            state.showEstimatedHours = action.payload;
        },
        setCurrentTaskId: (state, action) => {
            state.currentTaskId = action.payload
        },
        setCurrentSubTaskId: (state, action) => {
            state.currenSubTaskId = action.payload
        },
        updateOrCreateTaskHours: (state, action) => {
            const { mainTaskId, subTaskId, Simple, Medium, Complex } = action.payload;
        },
        setCurrentTemplateId: (state, action) => {
            state.currentTemplateId = action.payload
        },
        setCurrentComponent: (state, action) => {
            state.currentComponent = {};
            state.currentComponent = action.payload
        },
        setTextBoxEnable: (state, action) => {
            state.enableTextBox = action.payload
        },
        setCurrentWBS: (state, action) => {
            state.currentWBS = action.payload
        },
        setCurrentPractice: (state, action) => {
            state.currentPractice = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchEstimationTask.pending, (state, action) => {
                state.status = false;
            })
            .addCase(fetchEstimationTask.fulfilled, (state, action) => {
                state.status = true;
                state.estimationTask = action.payload;
            })
            .addCase(fetchEstimationTask.rejected, (state, action) => {
                state.status = false;
                state.error = action.error.message ? action.error.message : null
            })
            .addCase(updateEstimationSummary.pending, (state, action) => {
                state.status = false;
            })
            .addCase(updateEstimationSummary.fulfilled, (state, action) => {
                state.status = true;
                // state.summaryCalculation = action.payload
            })
            .addCase(updateEstimationSummary.rejected, (state, action) => {
                state.status = false;
                state.error = action.error.message ? action.error.message : null
            })
 
    }
})
 
export const selectAllTasks = (state: any) => state.estimationSummary?.estimationTask?.content?.taskDetails;
 
export const getMasterTemplateId = (state: any) => state.estimationSummary?.estimationTask?.id;
 
export const getPostsStatus = (state: any) => state.estimationSummary?.status;
 
export const selectAllSubTasks = (state: any) => state.estimationSummary?.estimationSubTask;
 
export const selectAllSummaryCalc = (state: any) => state.estimationSummary?.summaryCalculation;
 
export const fetchCurrentTaskId = (state: any) => state.estimationSummary?.currentTaskId;
 
export const fetchCurrentSubTaskId = (state: any) => state.estimationSummary?.currenSubTaskId;
 
export const fetchEstimationCalc = (state: any) => state.estimationSummary?.estimationCalc;
 
export const fetchLengthEstimationCalc = (state: any) => state.estimationSummary?.estimationCalc?.length;
 
export const getCurrentTemplateId = (state: any) => state.estimationSummary?.currentTemplateId;
 
export const getCurrentComponent = (state: any) => state.estimationSummary?.currentComponent;
 
export const getTextboxEnabler = (state: any) => state.estimationSummary?.enableTextBox;
 
export const getCurrentWBS = (state: any) => state.estimationSummary?.currentWBS;
 
export const getCurrentPractice = (state: any) => state.estimationSummary?.currentPractice;
 
export const { showSubTasks, showEstimatedHours, setCurrentTaskId,
    setCurrentSubTaskId, updateOrCreateTaskHours, setCurrentTemplateId, setCurrentComponent,
    setTextBoxEnable, setCurrentWBS, setCurrentPractice } = estimateSlice.actions
 
export default estimateSlice.reducer