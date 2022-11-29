import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStream: {},
};

export const streamSlices = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setCurrentStream: (state, action) => {
      state.currentStream = action.payload;
    },
  },
});

//Generate the action creators
export const { setCurrentStream } = streamSlices.actions;

//Export reducers
export default streamSlices.reducer;
