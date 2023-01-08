import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  primary: "",
  secondary: "",
  colors: {}
};

export const colorSlices = createSlice({
  name: "color",
  initialState,
  reducers: {
    setPrimaryColor: (state, action) => {
      state.primary = action.payload;
    },
    setSecondaryColor: (state, action) => {
      state.secondary = action.payload;
    },
    setColors: (state, action) => {
      state.colors = action.payload;
    },
  },
});

//Generate the action creators
export const { setPrimaryColor, setSecondaryColor, setColors} = colorSlices.actions;

//Export reducers
export default colorSlices.reducer;
