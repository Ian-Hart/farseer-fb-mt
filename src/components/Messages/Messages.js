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
  const stream = useSelector((state) => state.stream.currentStream);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (stream !== undefined) {
      setMessagesLoading(true);
      setMessages([]);
      console.log(stream.id);
      const unsubscribe = messageListener(stream.id);
      return () => unsubscribe();
    } 
  },[stream]);


  useEffect(()=>{
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

  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages">{displayMessages()}</Comment.Group>
      </Segment>
      <MessageForm />
    </>
  );
};

export default Messages;
