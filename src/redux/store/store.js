import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlices";
import streamReducer from "../slices/streamSlices";

const store = configureStore({
  reducer: { 
    auth: authReducer,
    stream: streamReducer
  },
});

export default store;
