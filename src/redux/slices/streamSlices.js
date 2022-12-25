import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStream: {},
    isPrivateStream : false
};

export const streamSlices = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setCurrentStream: (state, action) => {
      state.currentStream = action.payload;
    },
    setPrivateStream : (state, action) => {
      state.isPrivateStream = action.payload;
    },
  },
});

//Generate the action creators
export const { setCurrentStream, setPrivateStream } = streamSlices.actions;

//Export reducers
export default streamSlices.reducer;
