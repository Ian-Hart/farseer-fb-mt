import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onChildAdded, onChildRemoved } from "firebase/database";
import * as fb from "../../firebase";
import {
  setCurrentStream,
  setPrivateStream,
} from "../../redux/slices/streamSlices";
import { Menu, Icon } from "semantic-ui-react";

const Starred = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [ activeStream, setActiveStream ] = useState("");
  const [ starredStreams, setStarredStreams ] = useState();
  let _starredStreams = [];

  useEffect(() => {
    let unsubscribe = starredStreamAddedListener();
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const starredStreamAddedListener = () => {
    return onChildAdded(fb.userStarredRef(user.id), (snap) => {
      let starredStream = { id: snap.key, ...snap.val() };
      _starredStreams.push(starredStream);
      setStarredStreams([..._starredStreams]);
    });
  };

  useEffect(() => {
    let unsubscribe = starredStreamRemovedListener();
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const starredStreamRemovedListener = () => {
    return onChildRemoved(fb.userStarredRef(user.id), (snap) => {
      const streamToRemove = { id: snap.key, ...snap.val() };
      const filteredStreams = _starredStreams.filter((stream) => {
        return stream.id !== streamToRemove.id;
      });
      _starredStreams =[...filteredStreams];

      setStarredStreams([..._starredStreams]);
    });
  };

  const changeStream = (stream) => {
    _starredStreams = [];
    setActiveStream(stream.id);
    dispatch(setCurrentStream(stream));
    dispatch(setPrivateStream(false));
  };

  useEffect(() => {
    displayStreams();
  }, [starredStreams]);
  
  const displayStreams = () => {
    return (
      starredStreams?.length > 0 &&
      starredStreams?.map((stream) => (
        <Menu.Item
          key={stream.id}
          onClick={() => changeStream(stream)}
          name={stream.name}
          style={{ opacity: 0.7 }}
          active={stream.id === activeStream}
        >
          # {stream.name}
        </Menu.Item>
      ))
    );
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{" "}
        ({starredStreams ? starredStreams.length : 0})
      </Menu.Item>
      {displayStreams()}
    </Menu.Menu>
  );
};

export default Starred;
