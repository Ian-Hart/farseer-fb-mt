import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as fb from "../../firebase";
import { get, onChildAdded, remove, update } from "firebase/database";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messageCnt, setMessageCnt] = useState(0);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [streamStarred, setStreamStarred] = useState(false);

  const stream = useSelector((state) => state.stream.currentStream);
  const privateStream = useSelector((state) => state.stream.isPrivateStream);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (stream !== undefined) {
      setMessagesLoading(true);
      setMessages([]);
      setMessageCnt(0);
      setSearchLoading(false);
      setSearchResults([]);
      setSearchTerm("");
      userStarsListener(stream.id, user.id);
      const unsubscribe = messageListener(stream.id);
      return () => unsubscribe();
    }
  }, [stream]);

  useEffect(() => {
    countUniqueUsers();
    displayMessages();
    displayHeader();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageCnt]);

  const messageListener = (streamId) => {
    let loadedMessages = [];
    return onChildAdded(fb.getMessagesRef(privateStream, streamId), (data) => {
      loadedMessages.push(data.val());
      setMessages(loadedMessages);
      setMessageCnt(loadedMessages.length);
      setMessagesLoading(false);
    });
  };

  const userStarsListener = (streamId, userId) => {
    get(fb.userStarredRef(userId)).then((data) => {
      if (data.exists()) {
        if (data.val() !== null) {
          const streamIds = Object.keys(data.val());
          const prevStarred = streamIds.includes(streamId);
          setStreamStarred(prevStarred);
        }
      }
    });
  };

  const handleStar = (starred) => {
    setStreamStarred(!starred);
  };

  useEffect(()=>{
    displayHeader();
    starStream();
  },[streamStarred])

  const starStream = () => {
    if (streamStarred) {
      update(fb.userStarredRefStreamId(user.id, stream.id), {
        name: stream.name,
        details: stream.details,
        createdBy: {
          name: stream.createdBy.name,
          avatar: stream.createdBy.avatar,
        },
      });
    } else {
      remove(fb.userStarredRefStreamId(user.id, stream.id));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
    handleSearchMessages();
  };

  const handleSearchMessages = () => {
    const streamMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const results = streamMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(results);
    setTimeout(() => setSearchLoading(false), 1000);
  };

  const displayMessages = (_messages) => {
    if (_messages !== undefined) {
      return (
        _messages.length > 0 &&
        _messages.map((message) => (
          <Message key={message.timestamp} message={message} user={user} />
        ))
      );
    }
  };

  const displayStreamName = (stream) => {
    return stream ? `${privateStream ? "@" : "#"}${stream.name} ` : "";
  };

  const countUniqueUsers = () => {
    let uniqueUsers = [];
    setNumUniqueUsers("");
    uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    setNumUniqueUsers(`${uniqueUsers.length} user${plural ? "s" : ""}`);
  };

  const displayHeader = () => {
    return (
      <MessagesHeader
        streamName={displayStreamName(stream)}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        searchTerm={searchTerm}
        privateStream={privateStream}
        handleStar={handleStar}
        streamStarred={streamStarred}
      />
    );
  };

  return (
    <>
      {displayHeader()}
      <Segment>
        <Comment.Group className="messages">
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </Comment.Group>
      </Segment>
      <MessageForm />
    </>
  );
};

export default Messages;
