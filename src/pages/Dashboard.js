import { Navigate } from "react-router-dom";
import {useSelector } from "react-redux";

const Dashboard = () => {
  const auth = useSelector(state => state?.auth);
  const isSignedIn = auth.user?.isSignedIn;
  return (
    !isSignedIn ? <Navigate to="/" replace /> :
    <div>Dashboard</div>
  );
}

export default Dashboard;
