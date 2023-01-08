import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Streams from "./Streams";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

const SidePanel = ({primaryColor}) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: primaryColor, fontSize: "1.2rem" }}
    >
      <UserPanel primaryColor={primaryColor}/>
      <Starred />
      <Streams />
      <DirectMessages/>
    </Menu>
  );
};

export default SidePanel;
