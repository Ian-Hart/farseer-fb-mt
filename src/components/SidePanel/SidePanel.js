import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Streams from "./Streams";
import DirectMessages from "./DirectMessages";

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
      <DirectMessages/>
    </Menu>
  );
};

export default SidePanel;
