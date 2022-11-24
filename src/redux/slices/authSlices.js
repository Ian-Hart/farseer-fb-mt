import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
  };

export const authSlices = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    }
});

//Generate the action creators
export const {setUser} = authSlices.actions;

//Export reducers
export default authSlices.reducer;
