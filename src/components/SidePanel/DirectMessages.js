import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

const DirectMessages = () => {
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);

  let _users = [];

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
        _users.push(otherUser);
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
    const updatedUsers = _users.reduce((acc, otherUser) => {
      if (otherUser.id === userId) {
        otherUser["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(otherUser);
    }, []);
    setUsers(updatedUsers);
  };

  const isUserOnline = (user) => user.status === "online";

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {users.map((user) => (
        <Menu.Item
          key={user.id}
          onClick={() => console.log(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} />@{" "}
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
