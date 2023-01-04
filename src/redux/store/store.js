import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlices";
import streamReducer from "../slices/streamSlices";
import usersReducer from "../slices/usersSlices";

const store = configureStore({
  reducer: { 
    auth: authReducer,
    stream: streamReducer,
    users: usersReducer
  },
});

export default store;
