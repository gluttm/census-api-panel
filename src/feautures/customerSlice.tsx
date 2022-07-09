import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
    value: string[],
    index: number
}

let initialState : CustomerState = {
    value: [],
    index: 0
}

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        addFood: (state, action: PayloadAction<string>) => {
            state.value.push(action.payload)
        }
    }
})

export default customerSlice.reducer
export const { addFood } = customerSlice.actions 