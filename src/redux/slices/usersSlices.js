import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts:{}
};

export const usersSlices = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserPosts: (state, action) => {
      state.posts = action.payload;
    }
  },
});

//Generate the action creators
export const { setUserPosts } = usersSlices.actions;

//Export reducers
export default usersSlices.reducer;
