import { useSelector } from "react-redux";

import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import * as fb from "../../firebase";

const UserPanel = ({primaryColor}) => {
  const user = useSelector(state => state.auth.user);

  const dropdownOptions = () => {
    return [
      {
        key: "user",
        text: (
          <span>
            Signed in as <strong>{user?.name}</strong>
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
    <Grid style={{ background: primaryColor }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="random" />
            <Header.Content>Farseer</Header.Content>
          </Header>
        </Grid.Row>

        {/* User Dropdown  */}
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown trigger={
              <span>
                <Image src={user?.avatar} spaced="right" avatar/>
                {user?.name}
              </span>
          } options={dropdownOptions()} />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
