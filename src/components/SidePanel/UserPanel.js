import React from "react";
import * as fb from "../../firebase";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

const UserPanel = () => {
  const dropdownOptions = () => {
    return [
      {
        key: "user",
        text: (
          <span>
            Signed in as <strong>User</strong>
          </span>
        ),
        disabled: true,
      },
      {
        key: "avatar",
        text: <span>Change Avatar</span>,
      },
      {
        key: "signout",
        text: <span onClick={handleSignout}>Sign Out</span>,
      },
    ];
  };

  const handleSignout = () => {
    fb.signUserOut().then(() => console.log("signed out!"));
  };

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="eye" />
            <Header.Content>Farseer</Header.Content>
          </Header>
        </Grid.Row>

        {/* User Dropdown  */}
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown trigger={<span>User</span>} options={dropdownOptions()} />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
