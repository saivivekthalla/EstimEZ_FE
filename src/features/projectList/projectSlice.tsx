import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit/dist";
import instance from "../../helper/constants/api/config";

interface stateProps {
    projects: [];
    status: boolean;
    error: string | null;
}

const initialState: stateProps = {
    projects: [],
    status: false, // 'idle | 'loading' | 'succeeded' | 'failed'
    error: null,
}

export const fetchProjectList = createAsyncThunk('projects/fetchProjectList', async () => {
    try {
        const response = await instance.get('/projects');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch projects');
    }
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProjectList.fulfilled, (state, action) => {
            state.status = true;
            state.projects = action.payload;
        });
    },
});

export const getAllProjectList = (state: any) => state?.projects?.projects;

export default projectsSlice.reducer;