import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Grid } from "semantic-ui-react";
import "../App.css";

import ColorPanel from "../components/ColorPanel/ColorPanel";
import SidePanel from "../components/SidePanel/SidePanel";
import Messages from "../components/Messages/Messages";
import MetaPanel from "../components/MetaPanel/MetaPanel";

const Dashboard = () => {
  const auth = useSelector((state) => state?.auth);
  const isSignedIn = auth?.isSignedIn;
  return !isSignedIn ? (
    <Navigate to="/login" replace />
  ) : (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

export default Dashboard;
