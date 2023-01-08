import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Grid } from "semantic-ui-react";
import "../App.css";

import ColorPanel from "../components/ColorPanel/ColorPanel";
import SidePanel from "../components/SidePanel/SidePanel";
import Messages from "../components/Messages/Messages";
import MetaPanel from "../components/MetaPanel/MetaPanel";

import { uniqueId } from "lodash";

const Dashboard = () => {
  const auth = useSelector((state) => state?.auth);
  const isSignedIn = auth?.isSignedIn;

  let primaryColor = useSelector(state => state?.color.primary);  
  let secondaryColor = useSelector(state => state?.color.secondary);

  return !isSignedIn ? (
    <Navigate to="/login" replace={true} />
  ) : (
    <Grid columns="equal" className="app" style={{ background: secondaryColor }}>
      <ColorPanel key={uniqueId()}/>
      <SidePanel  key={uniqueId()} primaryColor={primaryColor}/>

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages key={uniqueId()}/>
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel key={uniqueId()}/>
      </Grid.Column>
    </Grid>
  );
};

export default Dashboard;
