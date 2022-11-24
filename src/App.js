import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Loading from "./components/Loading";

import * as fb from "./firebase";

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fb.checkAuth((user) => {
      setLoading(false);
      setUser(user);
    });
  },[]);

  return loading ? (
    <Loading />
  ) : (
    <Router>
      <Routes>
        <Route index="/" element={<Home />} />
        <Route path="/" exact element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
