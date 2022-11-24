import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const isSignedIn = true;
  return (
    !isSignedIn ? <Navigate to="/" replace /> :
    <div>Dashboard</div>
  );
}

export default Dashboard;
