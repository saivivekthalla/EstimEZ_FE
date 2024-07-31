import instance from "@/helper/constants/api/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  projectId: 0,
  statusrole: false,
  roleRedundantData: [],
  error: null,
};

export const getRoleredundant = createAsyncThunk( "/deal-desk/getRoleRedundant", async (projectId: any) => {
    try {
        const res = await instance.get(`projects/deal-desk/role-redundancy/${projectId}`)
        return res.data
    } catch (error: any) {
        throw new Error(error.message) 
    }
  }
);

const roleredundantSlice = createSlice({
    name: 'roleRedundant',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getRoleredundant.pending, (state, action) => {
                state.statusrole = false;
            })
            .addCase(getRoleredundant.fulfilled, (state, action) => {
                state.statusrole = true;
                state.roleRedundantData=action.payload
            })
            .addCase(getRoleredundant.rejected, (state, action) => {
                state.statusrole = false;
                state.error = action.error.message ? action.error.message : null;
            })
    }

})

export const fetchRoleredundantData = (state: any) => state?.dealDeskRole?.roleRedundantData;

export default roleredundantSlice.reducer;
