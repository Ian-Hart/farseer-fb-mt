import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlices";
import streamReducer from "../slices/streamSlices";
import usersReducer from "../slices/usersSlices";
import colorReducer from "../slices/colorSlices";

const store = configureStore({
  reducer: { 
    auth: authReducer,
    stream: streamReducer,
    users: usersReducer,
    color: colorReducer
  },
});

export default store;
