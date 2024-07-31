import instance from "@/helper/constants/api/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState :any = {
    travelRow: [{travelExpenseId: 0,cost:0}],
    slRow: [{hardwareSoftwareLicenseFee: 0, softwareLicenseModelId: 0, unitCost: 0, noOfUnits:0, totalCost:0}],
    plRow: [{productName: '', productLicenseModelId: 0, unitCost: 0, noOfUnits:0, totalCost:0}],
    otherCostTotal: 0,
    travelExpensesTotal:0,
    softwareLicenseTotal:0,
    customerChargeBackTotal:0,
    productLicenseTotal:0,
    subMenuOpen:false,
    discounts: [
        {
          discountId: 0,
          categoryId: 0,
          description: "",
          percentage: 0,
        },
    ],
    discountCategories: [],
    otherCostTravel: [],
    otherCostSoftware: [],
    otherCostProduct: []
}
// Discount APIs
export const createDiscounts = createAsyncThunk("budget/createDiscounts", async(data: any) =>{
    try{
        const response = await instance.post('/projects/discounts', data)
        return response.data;
    } catch(err: any){
        return err.message;
    }
});

export const updateDiscounts = createAsyncThunk("budget/updateDiscounts", async(data: any) => {
    try{
        const response = await instance.put('/projects/discounts', data)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const deleteDiscounts = createAsyncThunk("budget/deleteDiscounts",async ({ discountId, projectId }: { discountId: any; projectId: any }) => {
      try {
        const response = await instance.delete(`/projects/discounts/${projectId}/${discountId}`);
        return response.data;
      } catch (err: any) {
        return err.response ? err.response.data : err.message;
      }
    }
  );

export const getDiscounts = createAsyncThunk("budget/getDiscounts", async(projectId: any) => {
    try{
        const response = await instance.get(`/projects/discounts/${projectId}`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const lookupDiscounts = createAsyncThunk("budget/lookupDiscounts", async() => {
    try{
        const response = await instance.get(`/discount/lookup/discount-category`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

// OtherCost APIs
export const lookupTravel = createAsyncThunk("budget/lookupTravel", async() => {
    try{
        const response = await instance.get(`/other-costs/lookup/travel-expense-type`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const lookupSoftware = createAsyncThunk("budget/lookupSoftware", async() => {
    try{
        const response = await instance.get(`/other-costs/lookup/software-license-model`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const lookupProduct = createAsyncThunk("budget/lookupProduct", async() => {
    try{
        const response = await instance.get(`/other-costs/lookup/product-license-model`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const getOtherCost = createAsyncThunk("budget/getOtherCost", async(projectId: any) => {
    try{
        const response = await instance.get(`/projects/other-costs/${projectId}`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const postOtherCost = createAsyncThunk("budget/postOtherCost", async(body:any) => {
    try{
        const response = await instance.post(`/projects/other-costs`,body)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const putOtherCost = createAsyncThunk("budget/putOtherCost", async(body :any) => {
    try{
        const response = await instance.put(`/projects/other-costs`,body)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

export const deleteOtherCost = createAsyncThunk("budget/deleteOtherCost", async(body:any) => {
    const {projectId, otherCostId} = body
    try{
        const response = await instance.delete(`/projects/other-costs/${projectId}/${otherCostId}`)
        return response.data
    } catch(err: any){
        return err.message;
    }
})

const budgetSlice: any = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setDiscounts: (state, action) => {
            state.discounts = action.payload;
        },
        // make sure you need this after integration of otherCost page
        setTravelRow: (state, action) => {
            state.travelRow = action.payload
        },
        setSubMenuOpen: (state, action) => {
            state.subMenuOpen = action.payload;
        },
        setslRow: (state, action) => {
            state.slRow = action.payload
        },
        setplRow: (state, action) => {
            state.plRow = action.payload
        },
        setOtherCostTotal: (state, action) => {
            state.otherCostTotal = action.payload
        },
        setTravelExpensesTotal: (state,action) => {
            state.travelExpensesTotal = action.payload
        },
        setSoftwareLicenseTotal: (state,action) => {
            state.softwareLicenseTotal = action.payload
        },
        setCustomerChargeBackTotal: (state,action) => {
            state.customerChargeBackTotal = action.payload
        },
        setProductLicenseTotal: (state,action) => {
            state.productLicenseTotal = action.payload
        },
    },
    extraReducers(builder) {
        builder
        .addCase(getDiscounts.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(getDiscounts.fulfilled, (state, action) =>{
            state.statusline = true;
            state.discounts = action.payload;            
        })
        .addCase(getDiscounts.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(createDiscounts.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(createDiscounts.fulfilled, (state, action) =>{
            state.statusline = true;
        })
        .addCase(createDiscounts.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(updateDiscounts.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(updateDiscounts.fulfilled, (state, action) =>{
            state.statusline = true;
        })
        .addCase(updateDiscounts.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(deleteDiscounts.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(deleteDiscounts.fulfilled, (state, action) =>{
            state.statusline = true;           
        })
        .addCase(deleteDiscounts.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(lookupDiscounts.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(lookupDiscounts.fulfilled, (state, action) =>{
            state.statusline = true;
            state.discountCategories = action.payload;       
        })
        .addCase(lookupDiscounts.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(lookupTravel.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(lookupTravel.fulfilled, (state, action) =>{
            state.statusline = true;
            state.otherCostTravel = action.payload;       
        })
        .addCase(lookupTravel.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(lookupSoftware.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(lookupSoftware.fulfilled, (state, action) =>{
            state.statusline = true;
            state.otherCostSoftware = action.payload;       
        })
        .addCase(lookupSoftware.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
        .addCase(lookupProduct.pending, (state, action) =>{
            state.discounts = false;
        })
        .addCase(lookupProduct.fulfilled, (state, action) =>{
            state.statusline = true;
            state.otherCostProduct = action.payload;       
        })
        .addCase(lookupProduct.rejected, (state, action) =>{
            state.statusline = false;
            state.error = action.error.message ? action.error.message : null;
        })
    }
})

export const {setTravelRow, setplRow, setslRow, setOtherCostTotal, setSubMenuOpen, setDiscounts, setTravelExpensesTotal, setSoftwareLicenseTotal, setCustomerChargeBackTotal, setProductLicenseTotal} = budgetSlice.actions

export const getTravelRow = (state: any) => state?.budget?.travelRow

export const getslRow = (state: any) => state?.budget?.slRow

export const getplRow = (state: any) => state?.budget?.plRow

export const getOhterCostTotal = (state: any) => state?.budget?.otherCostTotal

export const getTravelExpensesTotal = (state: any) => state?.budget?.travelExpensesTotal

export const getSoftwareLicenseTotal = (state: any) => state?.budget?.softwareLicenseTotal

export const getCustomerChargeBackTotal = (state: any) => state?.budget?.customerChargeBackTotal

export const getProductLicenseTotal = (state: any) => state?.budget?.productLicenseTotal

export const getDiscountsData = (state: any) => state?.budget?.discounts

export const getSubMenuOpen = (state: any) => state?.budget?.subMenuOpen

export const fetchDiscountCategories = (state: any) => state?.budget?.discountCategories

export const fetchTravelCategories = (state: any) => state?.budget?.otherCostTravel

export const fetchSoftwareCategories = (state: any) => state?.budget?.otherCostSoftware

export const fetchProductCategories = (state: any) => state?.budget?.otherCostProduct

export default budgetSlice.reducer