import { createSlice } from '@reduxjs/toolkit';

const initialState = [{
    id: 0,
    inputValue: '',
    selectedOption: '',
}];

const resetState = [{
    id: 0,
    inputValue: '',
    selectedOption: '',
}];

const estimationFormSlice = createSlice({
    name: 'estimationForm',
    initialState,
    reducers: {
        setInputValues: (state, action) => {
            const { index, inputValue, id } = action.payload;
            if (state[index]) {
                state[index].inputValue = inputValue;
                state[index].id = id;
            } else {
                state[index] = {
                    id: 0,
                    inputValue: state[index]?.inputValue || "",
                    selectedOption: state[index]?.selectedOption || "",
                }
                state[index].inputValue = inputValue;
                state[index].id = id;
            }
        },
        setSelectedValues: (state, action) => {
            const { index, selectedOption, id } = action.payload;

            if (state[index]) {
                state[index].selectedOption = selectedOption;
                state[index].id = id;
            } else {
                state[index] = {
                    id: 0,
                    inputValue: state[index]?.inputValue || "",
                    selectedOption: '',
                }
                state[index].selectedOption = selectedOption;
                state[index].id = id;
            }
        },
        resetInitialState: () => resetState
    },
});


export const estimationForm = (state: any) => state?.estimationForm;

export const { setInputValues, setSelectedValues, resetInitialState } = estimationFormSlice.actions;
export default estimationFormSlice.reducer;