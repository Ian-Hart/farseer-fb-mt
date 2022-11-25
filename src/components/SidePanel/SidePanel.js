import React from "react";
import UserPanel from "./UserPanel";
import Streams from "./Streams";
import { Menu } from "semantic-ui-react";

const SidePanel = () => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel />
      <Streams />
    </Menu>
  );
};

export default SidePanel;
