import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import 'semantic-ui-css/semantic.min.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
      <Routes>
        <Route path="/" exact element={<App />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
);
