import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStream } from "../../redux/slices/streamSlices";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import * as fb from "../../firebase";
import { onChildAdded } from "firebase/database";
import { uuidv4 as uuid } from "@firebase/util";

const Streams = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const currentStream = useSelector((state) => state.stream.currentStream);

  const [currentStreamId, setCurrentStreamId] = useState("");
  const [streams, setStreams] = useState([]);
  const [streamName, setStreamName] = useState("");
  const [streamDetails, setStreamDetails] = useState("");
  const [modal, setModal] = useState(false);

  const streamRef = fb.streamsRef();

  useEffect(() => {
    let unsubscribe = streamAddedListener();
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const streamAddedListener = () => {
    let loadedFirebaseStreams = [];
    return onChildAdded(streamRef, (data) => {
      let firebaseStream = data.val();
      loadedFirebaseStreams.push(firebaseStream);
      setStreams(loadedFirebaseStreams);
      changeStream(firebaseStream)
    });
  };

  useEffect(() => {
      setCurrentStreamId(currentStream.id);
  }, [currentStream]);

  const changeStream = (stream) => {
    dispatch(setCurrentStream(stream));
  };

  const displayStreams = () =>
    streams.length > 0 &&
    streams.map((stream) => (
      <Menu.Item
        key={stream.id}
        onClick={() => changeStream(stream)}
        name={stream.name}
        style={{ opacity: 0.7 }}
        active={stream.id === currentStreamId}
      >
        # {stream.name}
      </Menu.Item>
    ));

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

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

  const isFormValid = () => streamName && streamDetails;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const id = uuid();
      let stream = {
        id,
        streamName,
        streamDetails,
        user,
      };

      fb.addStream(stream)
        .then(() => {
          setStreamName("");
          setStreamDetails("");
          changeStream(stream);
          closeModal();

          console.log("Stream Added");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> STREAMS{" "}
          </span>{" "}
          ({streams.length})<Icon name="add" onClick={openModal} />
        </Menu.Item>
        {displayStreams()}
      </Menu.Menu>
      {/* Add Channel Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Stream</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
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
          <Button color="green" inverted onClick={handleSubmit}>
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
