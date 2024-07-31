import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../helper/constants/api/config";
import moment from 'moment'

export const getVerticals = createAsyncThunk<any[], void>(
    "vertical/getVerticals",
    async () => {
        try {
            const response = await instance.get("/projects/lookup/verticals");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            throw error.message
        }
    }
);

export const getEngagementType = createAsyncThunk<any[], void>(
    "engagementType/getEngagementType",
    async () => {
        try {
            const response = await instance.get("/projects/lookup/engagement-type");
            // console.log(`engagement : `, response.data);
            return response.data;
        } catch (error: any) {
            throw error.message
        }
    }
);

export const getProjectType = createAsyncThunk<any[], void>(
    "projectType/getProjectType",
    async () => {
        try {
            const response = await instance.get("/projects/lookup/project-type");
            return response.data;
        } catch (error: any) {
            throw error.message
        }
    }
);

export const getPractices = createAsyncThunk<any[], void>(
    "practices/getPractices",
    async () => {
        try {
            const response = await instance.get("/projects/lookup/practices");
            return response.data;
        } catch (error: any) {
            throw error.message
        }
    }
);

export const getProjectById = createAsyncThunk<any, number>(
    "project/getProjectById",
    async (id: any) => {
        try {
            const response = await instance.get(`/projects/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.message;
        }
    }
);
export const getNewProjectById = createAsyncThunk<any, number>(
    "project/getNewProjectById",
    async (id: any) => {
        try {
            const res = await instance.get(`/projects/${id}`);

            return res.data.practices;
        } catch (error: any) {
            throw error.message;
        }
    }
);

export const postNewProject = createAsyncThunk<any, any>(
    "project/postNewProject",
    async (projectData: any) => {
        try {
            const response = await instance.post(`/projects?userId=1`, projectData);
            return response.data;
        } catch (error: any) {
            // console.log('postNewProject', error)
            alert(error?.response?.data?.message)
            throw error.message;
        }
    }
);

export const getPreviousEstimation = createAsyncThunk<any[], number>(
    "project/getPreviousEstimation",
    async (id: any) => {
        try {
            const response = await instance.get(`/projects/user/recent/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.message
        }
    }
);

export const getRecentActivities = createAsyncThunk<any[],string[]>(
    "project/getRecentActivities",
    async (string :any) => {
        try {
            const response = await instance.get(`/projects/recentactivities?keywords=${string}`);
            return response.data;
        } catch (error: any) {
            throw error.message
        }
    }
);

const initialState: any = {
    verticalData: [],
    engagementType: [],
    selectedState: "",
    status: "idle",
    message: "",
    loading: false,
    isSuccess: false,
    hasError: false,
    project: {},
    practices: [],
    projectType: [],
    previousEstimation: {},
    recentActivities: []
};

const statesSlice = createSlice({
    name: "createProject",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getVerticals.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getVerticals.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.verticalData = action.payload;
        });
        builder.addCase(getVerticals.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getEngagementType.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getEngagementType.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.engagementType = action.payload;
        });
        builder.addCase(getEngagementType.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getProjectById.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getProjectById.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.project = action.payload;
        });
        builder.addCase(getProjectById.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getNewProjectById.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getNewProjectById.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.practices = action.payload;
        });
        builder.addCase(getNewProjectById.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(postNewProject.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(postNewProject.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.project = action.payload;
        });
        builder.addCase(postNewProject.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getPractices.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getPractices.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.practices = action.payload;
        });
        builder.addCase(getPractices.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getProjectType.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getProjectType.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.projectType = action.payload;
        });
        builder.addCase(getProjectType.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getPreviousEstimation.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getPreviousEstimation.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.previousEstimation = action.payload;
        });
        builder.addCase(getPreviousEstimation.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
        builder.addCase(getRecentActivities.pending, (state) => {
            state.loading = true;
            state.status = "Loading...";
        });
        builder.addCase(getRecentActivities.fulfilled, (state, action) => {
            state.loading = false;
            state.isSuccess = true;
            state.status = "Success";
            state.recentActivities = action.payload;
        });
        builder.addCase(getRecentActivities.rejected, (state, action) => {
            state.loading = false;
            state.hasError = true;
            state.status = "Error";
            state.message = action.payload; // action.error.message
        });
    }
});


export const fetchVertical = (state: any) => state?.createProject?.verticalData;

export const fetchPractices = (state: any) => state.createProject?.practices;

export const fetchProjectType = (state: any) => state.createProject?.projectType;

export const fetchEngagementType = (state: any) => state?.createProject?.engagementType;

export const fetchCurrentProject = (state: any) => state.createProject?.project;

export const fetchCurrentPractices = (state: any) => state.createProject?.project?.practiceIds;

export const fetchChartInfo = (state: any) => state.createProject?.project?.estimation;

export const fetchResourceApproachesList = (state: any) => state.createProject?.project?.resourcePlanning;

export const fetchWBSStrategiesList = (state: any) => state.createProject?.project?.wbsStrategies;

export const fetchOtherCost = (state: any) => state?.createProject?.project?.totalOtherCost;

export const fetchDiscount = (state: any) => state?.createProject?.project?.totalDiscount;

// export const fetchAllPracticesList = (state: any) => state.createProject?.project?.wbsStrategies;

export const fetchResourceApproacheById = (state: any, approachId: any) => {
    try {
        return state.createProject?.project?.resourcePlanning?.find((approach: any) => approach?.approachId === approachId);
    } catch (error) {
        console.error("Error occurred while fetching resource approach by ID:", error);
        return null; // or provide a default value
    }
};
export const getWBSStrategyNameById = (state: any, wbsStrategyId: any) => {

    const matchingStrategy = state.createProject?.project?.wbsStrategies?.find((strategy: any) => strategy?.id === wbsStrategyId);
    return matchingStrategy ? matchingStrategy?.strategyName : '';

};
export const fetchWBSStrategYById = (state: any, practiceId: any) => {
    try {
        const result = state.createProject?.project?.wbsStrategies?.find((practice: any) => practice?.id == practiceId);
        return result;
    } catch (error) {
        console.error("Error occurred while fetching resource approach by ID:", error);
        return null; // or provide a default value
    }
};

export const getPracticesById = (state: any, practiceId: any) => {
    try {
        return state.createProject?.project?.practices?.find((practice: any) => practice.id === practiceId);
    } catch (error) {
        console.error("Error occurred while fetching practices by ID:", error);
        return null; // or provide a default value
    }
};

export const getPracticesByWBSId = (state: any, WBSId: any) => {
    try {
        return state.createProject?.project?.wbsStrategies?.find((wbsStrategies: any) => wbsStrategies.id === WBSId);
    } catch (error) {
        console.error("Error occurred while fetching practices by ID:", error);
        return null; // or provide a default value
    }
};

export const fetchEstimationApproachesListByName = (state: any, estimationName: any) => {
    try {
        return state.createProject?.project?.estimation?.find((estimationItem: any) => estimationItem.estimationName === estimationName);
    } catch (error) {
        console.error("Error occurred while fetching estimation approaches by name:", error);
        return null; // or provide a default value
    }
};

export const getEstimationApproacheById = (state: any, estimationName: any) => {
    try {
        return state.createProject?.project?.estimation?.find((estimationItem: any) => estimationItem.estimationName === estimationName);
    } catch (error) {
        console.error("Error occurred while fetching estimation approach by ID:", error);
        return null; // or provide a default value
    }
};

export const fetchEstimationResource = (state: any) => state.createProject?.project?.resourcePlanning;

export const fetchEstimationResourceById = (state: any, id: any) => {
    try {
        return state.createProject?.project?.resourcePlanning?.find((item: any) => item.approachId === id);
    } catch (error) {
        console.error("Error occurred while fetching estimation resource by ID:", error);
        return null; // or provide a default value
    }
};

export const fetchPreviousEstimation = (state: any) => state.createProject?.previousEstimation;
export const fetchRecentActivities = (state: any) => state.createProject?.recentActivities;
export default statesSlice.reducer;
