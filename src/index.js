import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import "semantic-ui-css/semantic.min.css";

import Dashboard from "./components/Dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Loading from "./components/Loading";

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

function App() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <AuthApp /> : <UnAuthApp />;
}

function AuthApp() {
  return (
    <Router>
      <Routes>
        <Route index="/" element={<Dashboard />} />
        <Route path="/" exact element={<Dashboard />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

function UnAuthApp() {
  return (
    <Router>
      <Routes>
        <Route index="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <App />
);
