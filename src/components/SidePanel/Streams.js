import { useState } from "react";
import { Menu, Icon } from "semantic-ui-react";

const Streams = () => {

  const [streams, setStreams] = useState([]);

  return (
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> STREAMS
          </span>{" "}
          ({streams.length}) <Icon name="add" />
        </Menu.Item>
        {/* Streams */}
      </Menu.Menu>
    );
}

export default Streams;
