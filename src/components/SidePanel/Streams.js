import { useState } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

const Streams = () => {
  const [streams, setStreams] = useState([]);
  const [streamName, setStreamName] = useState("");
  const [streamDetails, setStreamDetails] = useState("");
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "streamName":
        setStreamName(e.target.value);
        break;
      case "streamDetails":
        setStreamDetails(e.target.value);
        break;
      default:
        break;
    }
  };

  const openModal = () => setModal(true);

  const closeModal = () => setModal(false);

  return (
    <>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> STREAMS
          </span>{" "}
          ({streams.length}) <Icon name="add" onClick={openModal} />
        </Menu.Item>
        {/* Streams */}
      </Menu.Menu>
      {/* Add Channel Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Stream</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                fluid
                label="Name of Stream"
                name="streamName"
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the Stream"
                name="streamDetails"
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Streams;
