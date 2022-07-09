import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ReservationState {
    value: string[]
}

let initialState: ReservationState = {
    value: []
}
export const reservationsSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {
        addReservation: (state, action:PayloadAction<string>) => {
            state.value.push(action.payload)
        },
        removeReservation: (state, action: PayloadAction<number>) => {
            console.log('remove attempt');
            
            state.value.splice(action.payload, 1)
        }
    }
});

export default reservationsSlice.reducer
export const { addReservation, removeReservation } = reservationsSlice.actions