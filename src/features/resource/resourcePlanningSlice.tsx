import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit/dist";
import instance from "../../helper/constants/api/axiosConfig";
interface stateProps {
  roles: [];
  regions: [];
  rateCards: [];
  discoverDurationType: string;
  conceiveDurationType: string;
  buildDurationType: string;
  status: boolean;
  error: string | null;
  currentPhase: string;
  currentYear: number;
  dataSaved: boolean;
}

const initialState: stateProps = {
  roles: [],
  regions: [],
  rateCards: [],
  discoverDurationType: "",
  conceiveDurationType: "",
  buildDurationType: "",
  status: false, // 'idle | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentPhase: "discover",
  currentYear: new Date().getFullYear(),
  dataSaved: true,
};

export const fetchRoles = createAsyncThunk("resource/fetchRoles", async () => {
  try {
    const response = await instance.get("projects/lookup/roles");
    return response.data;
  } catch (err: any) {
    return err.message;
  }
});

export const fetchRegions = createAsyncThunk(
  "resource/fetchRegions",
  async () => {
    try {
      const response = await instance.get("projects/lookup/regions");
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
);
export const fetchRateCards = createAsyncThunk(
  "resource/fetchRateCards",
  async () => {
    try {
      const response = await instance.get("projects/lookup/ratecards");
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
);

export const createResourceApproach = createAsyncThunk(
  "resource/createResourceApproach",
  async (data: any) => {
    try {
      const response = await instance.post(
        "projects/resource-plan/approach",
        data
      );
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
);

export const deleteResourceApproach = createAsyncThunk(
  "resource/deleteResourceApproach",
  async (data: any) => {
    try {
      const response = await instance.post(
        "projects/resource-plan/approaches/delete",
        data
      );
      return response;
    } catch (err: any) {
      return err.response;
    }
  }
);

export const updateResourceApproach = createAsyncThunk(
  "resource/updateResourceApproach",
  async (receiveddata: any) => {
    const { data, approachId } = receiveddata;
    try {
      const response = await instance.put(
        `projects/resource-plan/approach/${approachId}`,
        data
      );
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
);
///api/projects/resource-plan/approach/{id}/resource
export const deleteTimeRanges = createAsyncThunk(
  "resource/deleteTimeRanges",
  async (data: any) => {
    try {
      const response = await instance.post(
        `projects/resource-plan/deleteTimeRanges`,
        data
      );
      return response;
    } catch (err: any) {
      return err.message;
    }
  }
);



export const createRolesAndTimeRanges = createAsyncThunk(
  "resource/createRolesAndTimeRanges",
  async (data: any) => {
    try {
      const response = await instance.post(
        `projects/resource-plan/createRolesAndTimeRanges`,
        data
      );
      return response;
    } catch (err: any) {
      return err.message;
    }
  }
);

export const updateRolesAndTimeRanges = createAsyncThunk(
  "resource/updateRolesAndTimeRanges",
  async (data: any) => {
    try {
      const response = await instance.put(
        `projects/resource-plan/updateRolesAndTimeRanges`,
        data
      );
      return response;
    } catch (err: any) {
      return err.message;
    }
  }
);

export const deleteRoles = createAsyncThunk(
  "resource/deleteRoles",
  async (data: any) => {
    try {
      const response = await instance.post(
        `projects/resource-plan/deleteRoles`,
        data
      );
      return response;
    } catch (err: any) {
      return err.message;
    }
  }
);



const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setCurrentPhase: (state, action) => {
      state.currentPhase = action.payload;
    },
    settingCurrentYear: (state, action) => {
      state.currentYear = action.payload;
    },
    setDiscoverDurationType: (state, action) => {
      state.discoverDurationType = action.payload;
    },
    setBuildDurationType: (state, action) => {
      state.buildDurationType = action.payload;
    },
    setConceiveDurationType: (state, action) => {
      state.conceiveDurationType = action.payload;
    },
    setdataSaved: (state, action) => {
      state.dataSaved = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createResourceApproach.pending, (state, action) => {
        state.status = false;
      })
      .addCase(createResourceApproach.fulfilled, (state, action) => {
        state.status = true;
      })
      .addCase(createResourceApproach.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(deleteResourceApproach.pending, (state, action) => {
        state.status = false;
      })
      .addCase(deleteResourceApproach.fulfilled, (state, action) => {
        state.status = true;
      })
      .addCase(deleteResourceApproach.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(updateResourceApproach.pending, (state, action) => {
        state.status = false;
      })
      .addCase(updateResourceApproach.fulfilled, (state, action) => {
        state.status = true;
      })
      .addCase(updateResourceApproach.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(fetchRoles.pending, (state, action) => {
        state.status = false;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = true;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(fetchRegions.pending, (state, action) => {
        state.status = false;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.status = true;
        state.regions = action.payload;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(fetchRateCards.pending, (state, action) => {
        state.status = false;
      })
      .addCase(fetchRateCards.fulfilled, (state, action) => {
        state.status = true;
        state.rateCards = action.payload;
      })
      .addCase(fetchRateCards.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(createRolesAndTimeRanges.pending, (state, action) => {
        state.status = false;
      })
      .addCase(createRolesAndTimeRanges.fulfilled, (state, action) => {
        state.status = true;
      })
      .addCase(createRolesAndTimeRanges.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(updateRolesAndTimeRanges.pending, (state, action) => {
        state.status = false;
      })
      .addCase(updateRolesAndTimeRanges.fulfilled, (state, action) => {
        state.status = true;
      })
      .addCase(updateRolesAndTimeRanges.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      })
      .addCase(deleteTimeRanges.pending, (state, action) => {
        state.status = false;
      })
      .addCase(deleteTimeRanges.fulfilled, (state, action) => {
        state.status = true;
      })
      .addCase(deleteTimeRanges.rejected, (state, action) => {
        state.status = false;
        state.error = action.error.message ? action.error.message : null;
      });
  },
});

export const getAllRoles = (state: any) => state?.resource?.roles;

export const getAllRegions = (state: any) => state?.resource?.regions;

export const getAllRatecards = (state: any) => state?.resource?.rateCards;

export const getCurrentPhase = (state: any) => state?.resource?.currentPhase;

export const getCurrentYear = (state: any) => state?.resource?.currentYear;

export const getdiscoverDurationType = (state: any) =>
  state?.resource?.discoverDurationType;

export const getconceiveDurationType = (state: any) =>
  state?.resource?.conceiveDurationType;

export const getbuildDurationType = (state: any) =>
  state?.resource?.buildDurationType;

export const getdataSaved = (state: any) => state?.resource?.dataSaved;

// // Example usage of useSelector with error handling
// const roles = useSelector((state: any) => {
//   try {
//     return getAllRoles(state);
//   } catch (error) {
//     console.error("Error occurred while using getAllRoles selector:", error);
//     return []; // or provide a default value
//   }
// });

export const {
  setCurrentPhase,
  settingCurrentYear,
  setDiscoverDurationType,
  setBuildDurationType,
  setConceiveDurationType,
  setdataSaved,
} = resourceSlice.actions;

export default resourceSlice.reducer;
