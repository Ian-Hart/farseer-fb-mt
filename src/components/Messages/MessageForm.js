import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Segment, Button, Input } from "semantic-ui-react";
import * as fb from "../../firebase";
import { serverTimestamp } from "firebase/database";
import _ from "lodash";


const MessageForm = () => {
  const user = useSelector((state) => state.auth.user);
  const currentStream = useSelector((state) => state.stream.currentStream);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "message":
        setMessage(e.target.value);
        break;
      default:
        break;
    }
  };

  const createMessage = () => {
    const msg = {
      timestamp: serverTimestamp(),
      user,
      content: message,
    };
    return msg;
  };

  const sendMessage = () => {
    if (message && !_.isEmpty(currentStream)) {
      setLoading(true);
      fb.addMessage(currentStream, createMessage())
      .then(()=>{
        setLoading(false);
        setMessage("");
        setError("");
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError(err);
      });
    } else {
      setError("Select a stream and add a message");
    }
  };

  const handleInputError = (error, inputName) => {
    return error.toLowerCase().includes(inputName) ? "error" : "";
  };
      
  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        onChange={handleChange}
        value={message}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        className={handleInputError(error, "message")}
        placeholder="Write your message"
      />
      <Button.Group icon widths="2">
        <Button
          onClick={sendMessage}
          disabled={loading}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
