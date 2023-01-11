import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    avatar: "",
  },
};

export const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isSignedIn = action.payload.isSignedIn;
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
      state.user.avatar = action.payload.avatar;
    },
    clearUser: (state, action) => {
      state.isSignedIn = false;
      state.user = initialState.user;  
    },
    setAvatar: (state, action) => {
      state.user.avatar = action.payload.avatar;
    },
  },
});

//Generate the action creators
export const { setUser, clearUser, setAvatar } = authSlices.actions;

//Export reducers
export default authSlices.reducer;
