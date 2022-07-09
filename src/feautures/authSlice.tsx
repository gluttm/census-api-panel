import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "src/types/User";



const initialState: Auth = { 
  isLogged: false, 
  accessToken: '',
  authorities: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogged: (state, action: PayloadAction<Auth>) => {
      state.isLogged = action.payload.isLogged;
      state.accessToken = action.payload.accessToken
      state.authorities = [...action.payload.authorities]
    },
  },
});

export default authSlice.reducer;
export const sliceAuth = authSlice;
export const { setIsLogged } = authSlice.actions;
