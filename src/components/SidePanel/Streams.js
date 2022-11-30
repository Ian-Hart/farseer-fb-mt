import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStream } from "../../redux/slices/streamSlices";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import * as fb from "../../firebase";
import {onChildAdded } from "firebase/database";


const Streams = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [activeStreamKey, setActiveStreamKey] = useState("");
  const [streams, setStreams] = useState([]);
  const [streamName, setStreamName] = useState("");
  const [streamDetails, setStreamDetails] = useState("");
  const [modal, setModal] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const streamRef = fb.streamRef();

  useEffect(() => {
    let unsubscribe = streamAddedListener();
    return () => streamRef.off(unsubscribe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

  const streamAddedListener = () => {
    let loadedStreams = [];
    return onChildAdded(streamRef, (data) => {
      loadedStreams.push(data.val());
      setStreams(loadedStreams);
      setInitialStream(loadedStreams);
    });
  };



  const setInitialStream = (loadedStreams) => {
    const initialStream = loadedStreams[0]
    if (initialLoad && loadedStreams.length > 0) {
      dispatch(setCurrentStream(initialStream));
      setActiveStreamKey(initialStream.key);
    }
    setInitialLoad(false);
  };

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
      fb.addStream(streamName, streamDetails, user.username, user.photoURL)
        .then((signedInUser) => {
          setStreamName("");
          setStreamDetails("");
          closeModal();
          console.log("Stream Added");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const changeStream = (stream) => {
    dispatch(setCurrentStream(stream));
    setActiveStreamKey(stream.key);
  };

  const displayStreams = () =>
    streams.length > 0 &&
    streams.map((stream) => (
      <Menu.Item
        key={stream.key}
        onClick={() => changeStream(stream)}
        name={stream.name}
        style={{ opacity: 0.7 }}
        active={stream.key === activeStreamKey}
      >
        # {stream.name}
      </Menu.Item>
    ));

  return (
    <>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> STREAMS </span>{" "} ({streams.length})<Icon name="add" onClick={openModal} />
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
