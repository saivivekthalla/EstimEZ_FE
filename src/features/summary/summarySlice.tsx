import instance from "@/helper/constants/api/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

interface FinalizeApproachData {
  approachId: string; 
  projectId: string; 
} 


interface stateProps {
  activeApproachIndex: number,
  selectedWbsStrategy: {},
  finalised: boolean,
  clicked: boolean,
  projectId: number,
  finalizedApproach: {
    previousSelectedApproaches: [{}],
    selectedApproach: {}
  },
  wbsStrategies: [{}],
  status: boolean,
}

const initialState: stateProps = {
  activeApproachIndex: -1,
  selectedWbsStrategy: {
    "id": 0,
    "strategyName": "string",
    "description": "string",
    "estimations": [
      {
        "templateId": 0,
        "practiceRecord": {
          "id": 0,
          "name": "string"
        },
        "taskDetails": {},
        "totalEstimationHours": 0,
        "components": {
          "simple": 0,
          "medium": 0,
          "complex": 0
        }
      }
    ],
    "totalStrategyHours": 0
  },
  finalised: false,
  clicked: false,
  projectId: 0,
  finalizedApproach: {
    previousSelectedApproaches: [{
      "approachId": 0,
      "userName": "string",
      "dateTime": moment()
    },],
    selectedApproach: {
      "approachId": 0,
      "userName": "string",
      "dateTime": moment(),
      "differenceHours": 0,
    }
  },wbsStrategies: [
    {
      "id": 0,
      "strategyName": "string",
      "description": "string",
      "estimations": [
        {
          "templateId": 0,
          "practiceRecord": {
            "id": 0,
            "name": "string"
          },
          "taskDetails": {},
          "totalEstimationHours": 0,
          "components": {
            "simple": 0,
            "medium": 0,
            "complex": 0
          }
        }
      ],
      "totalStrategyHours": 0
    }
  ],
  status: false, 
};

export const postFinalizeApproach = createAsyncThunk(
  "summary/finalizeApproach",
  async (data: FinalizeApproachData) => {
    try {
      const body = {
        "approachId": data.approachId,
        "userName": "admin"
      }
      const response = await instance.post(
        `/projects/summary/finalize-approach/${data.projectId}`,body
      );
      return response.data;
    } catch (error) {
      const typedError = error as Error;
      throw (typedError.message);
    }
  }
);

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    setActiveApproachIndex: (state, action) => {
      state.activeApproachIndex = action.payload;
    },
    setSelectedWbsStrategy: (state, action) => {
      state.selectedWbsStrategy = action.payload;
    },
    setFinalised: (state, action) => {
      state.finalised = action.payload;
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    setClicked: (state,action) => {
      state.clicked = action.payload
    },
    setFinalisedApproach: (state,action) => {
      state.finalizedApproach = action.payload;
    },
    setWbsStrategies: (state,action) => {
      state.wbsStrategies = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postFinalizeApproach.pending, (state) => {
        state.status = false;
      })
      .addCase(postFinalizeApproach.fulfilled, (state, action) => {
        state.status = true;
        state.finalizedApproach = action.payload.finalizedApproach;
      })
      .addCase(postFinalizeApproach.rejected, (state, action) => {
        state.status = false;
        // state.error = action.error.message;
      });
  },
});

export const { setActiveApproachIndex, setFinalised, setProjectId, setClicked, setFinalisedApproach, setWbsStrategies, setSelectedWbsStrategy } = summarySlice.actions;

export const getFinalzedApproach = (state: any) => state.summary.finalizedApproach;
export const getActiveApproachIndex = (state: any) => state.summary.activeApproachIndex;
export const getSelectedWbsStrategy = (state: any) => state.summary.selectedWbsStrategy;
export const getFinalised = (state: any) => state.summary.finalised;
export const getClicked = (state: any) => state.summary.clicked;
export const getWbsStrategies = (state: any) => state.summary.wbsStrategies;

export default summarySlice.reducer;
