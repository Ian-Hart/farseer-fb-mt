import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentStream,
  setPrivateStream,
} from "../../redux/slices/streamSlices";
import { Menu, Icon, Modal, Form, Input, Button, Label } from "semantic-ui-react";
import * as fb from "../../firebase";
import { onChildAdded, onValue } from "firebase/database";
import { uuidv4 as uuid } from "@firebase/util";

const Streams = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const currentStream = useSelector((state) => state.stream.currentStream);
  const [currentStreamId, setCurrentStreamId] = useState("");
  const [streams, setStreams] = useState([]);
  const [streamName, setStreamName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [streamDetails, setStreamDetails] = useState("");
  const [modal, setModal] = useState(false);

  let _notifications = [];

  const streamRef = fb.streamsRef();

  useEffect(() => {
    let unsubscribe = streamAddedListener();
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const streamAddedListener = () => {
    let loadedFirebaseStreams = [];
    return onChildAdded(streamRef, (snap) => {
      let firebaseStream = snap.val();
      loadedFirebaseStreams.push(firebaseStream);

      setStreams(loadedFirebaseStreams);
      changeStream(firebaseStream);
      notificationListener(snap.key);
    });
  };

  const notificationListener = (streamId) => {
    onValue(fb.messagesRef(streamId), (snap) => {
        handleNotifications(streamId, snap);
    });
  };

  const handleNotifications = (streamId, snap) => {
    let index = _notifications.findIndex(
      (notification) => notification.id === streamId
    );

    console.log(index);
    if (index !== -1) {
      _notifications[index].count = snap.size      

    } else{
      _notifications.push({
        id: streamId,
        count: snap.size,
      });
    
    }

    setNotifications([..._notifications]);
  }

  useEffect(() => {
    displayStreams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);


  useEffect(() => {
    setCurrentStreamId(currentStream.id);
  }, [currentStream]);

  const changeStream = (stream) => {
    dispatch(setCurrentStream(stream));
    dispatch(setPrivateStream(false));
  };

  const getNotificationCount = (streamId) => {
    let count = 0;
    notifications.forEach(notification => {
      if (notification.id === streamId) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
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
         {getNotificationCount(stream.id) && (
          <Label color="red">{getNotificationCount(stream.id)}</Label>
        )}
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
