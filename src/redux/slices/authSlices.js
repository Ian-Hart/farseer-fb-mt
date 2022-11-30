import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSignedIn: false,
  user: {
    username: "",
    photoURL: "",
  },
};

export const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isSignedIn = action.payload.isSignedIn;
      state.user.username = action.payload.username;
      state.user.photoURL = action.payload.photoURL;
    },
    clearUser: (state, action) => {
      state.isSignedIn = false;
      state.user = initialState.user;  
    },
  },
});

//Generate the action creators
export const { setUser, clearUser } = authSlices.actions;

//Export reducers
export default authSlices.reducer;
