import instance from "@/helper/constants/api/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    projectId: 0,
    statusrole: false,
    fractionalAllocationData: [],
    error: null,
};

export const getFractionalAllocation = createAsyncThunk( "/deal-desk/getFractionalAllocation", async (projectId: any) => {
    try {
        const res = await instance.get(`projects/deal-desk/resource/fractionalallocation/${projectId}`)
        return res.data
    } catch (error: any) {
        throw new Error(error.message) 
    }
  }
);

const fractionalAllocationSlice = createSlice({
    name: 'fractionalAllocation',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getFractionalAllocation.pending, (state, action) => {
                state.statusrole = false;
            })
            .addCase(getFractionalAllocation.fulfilled, (state, action) => {
                state.statusrole = true;
                state.fractionalAllocationData=action.payload
            })
            .addCase(getFractionalAllocation.rejected, (state, action) => {
                state.statusrole = false;
                state.fractionalAllocationData=initialState;
                state.error = action.error.message ? action.error.message : null;
            })
    }

})

export const fetchFractioanlAllocationData = (state: any) => state?.dealDeskFractional?.fractionalAllocationData;

export default fractionalAllocationSlice.reducer;