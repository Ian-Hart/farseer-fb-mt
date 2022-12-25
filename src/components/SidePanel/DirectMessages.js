import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onChildAdded,
  onChildRemoved,
  onDisconnect,
  onValue,
  set,
} from "firebase/database";

import { Menu, Icon } from "semantic-ui-react";

import * as fb from "../../firebase";
import "../../App.css";

import { setCurrentStream } from "../../redux/slices/streamSlices";
import { setPrivateStream } from "../../redux/slices/streamSlices";

const DirectMessages = () => {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [otherUsers, setOtherUsers] = useState([]);
  let _otherUsers = [];

  const usersRef = fb.usersRef();
  const connectedRef = fb.connectedRef();
  const presenceRef = fb.presenceRef();

  useEffect(() => {
    let unsubscribeUserAddedListner = userAddedListener();
    let unsubscribeUserConnectedListner = userConnectedListener();
    let unsubscribeUserPresenceAddedListner = userPresenceAddedListner();
    let unsubscribeUserPresenceRemovedListner = userPresenceRemovedListner();
    return () => {
      unsubscribeUserAddedListner();
      unsubscribeUserConnectedListner();
      unsubscribeUserPresenceAddedListner();
      unsubscribeUserPresenceRemovedListner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const userAddedListener = () => {
    return onChildAdded(usersRef, (snap) => {
      if (user.id !== snap.key) {
        let otherUser = snap.val();
        otherUser["id"] = snap.key;
        otherUser["status"] = "offline";
        _otherUsers.push(otherUser);
      }
    });
  };

  const userConnectedListener = () => {
    return onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        const ref = fb.presenceUserRef(user.id);
        set(ref, true);
        onDisconnect(ref).remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
  };

  const userPresenceAddedListner = () => {
    return onChildAdded(presenceRef, (snap) => {
      if (user.id !== snap.key) {
        addStatusToUser(snap.key, true);
      }
    });
  };

  const userPresenceRemovedListner = () => {
    return onChildRemoved(presenceRef, (snap) => {
      if (user.id !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  };

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = _otherUsers.reduce((acc, otherUser) => {
      if (otherUser.id === userId) {
        otherUser["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(otherUser);
    }, []);
    setOtherUsers(updatedUsers);
  };

  const isUserOnline = (user) => user.status === "online";

  const changeStream = otherUser => {
    const streamId = getStreamId(otherUser.id);
    const streamData = {
      id: streamId,
      name: otherUser.name
    };
    dispatch(setCurrentStream(streamData));
    dispatch(setPrivateStream(true));
  };

  const getStreamId = otherUserId => {
    const currentUserId = user.id;
    return otherUserId < currentUserId
      ? `${otherUserId}/${currentUserId}`
      : `${currentUserId}/${otherUserId}`;
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({otherUsers.length})
      </Menu.Item>
      {otherUsers.map((otherUser) => (
        <Menu.Item
          key={otherUser.id}
          onClick={() => changeStream(otherUser)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
        >
          <Icon name="circle" color={isUserOnline(otherUser) ? "green" : "red"} />@{" "}
          {otherUser.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
