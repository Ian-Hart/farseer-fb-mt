import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as fb from "../../firebase";
import { onChildAdded } from "firebase/database";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messageCnt, setMessageCnt] = useState(0);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const stream = useSelector((state) => state.stream.currentStream);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (stream !== undefined) {
      setMessagesLoading(true);
      setMessages([]);
      setMessageCnt(0);
      console.log(stream.id);
      const unsubscribe = messageListener(stream.id);
      return () => unsubscribe();
    } 
  },[stream]);

  useEffect(()=>{
    console.log("count");
    countUniqueUsers();
    displayMessages();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[messageCnt]);

  const messageListener = (streamId) => { 
    let loadedMessages = [];
    return onChildAdded(fb.messagesRef(streamId), (data) => {
      loadedMessages.push(data.val());
      setMessages(loadedMessages);
      setMessageCnt(loadedMessages.length)
      setMessagesLoading(false);
    });
    
  };

  const displayMessages = () =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message key={message.timestamp} message={message} user={user} />
    ));

  const displayStreamName = stream => (stream ? `#${stream.name}` : "");

  const countUniqueUsers = () => {
    let uniqueUsers = [];
    setNumUniqueUsers("");
    uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    console.log(uniqueUsers);
    console.log(uniqueUsers.length);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    console.log(`${uniqueUsers.length} user${plural ? "s" : ""}`);
    setNumUniqueUsers(`${uniqueUsers.length} user${plural ? "s" : ""}`);
  };

  return (
    <>
      <MessagesHeader
          streamName={displayStreamName(stream)}
          numUniqueUsers={numUniqueUsers}
        />
      <Segment>
        <Comment.Group className="messages">{displayMessages()}</Comment.Group>
      </Segment>
      <MessageForm />
    </>
  );
};

export default Messages;
