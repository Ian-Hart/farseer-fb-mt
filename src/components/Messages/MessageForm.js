import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Segment, Button, Input } from "semantic-ui-react";
import * as fb from "../../firebase";
import { serverTimestamp } from "firebase/database";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { uuidv4 as uuid } from "@firebase/util";
import _ from "lodash";

import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

const MessageForm = () => {

  const user = useSelector((state) => state.auth.user);
  const stream = useSelector((state) => state.stream.currentStream);
  const privateStream = useSelector((state) => state.stream.isPrivateStream);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState("");
  const [percentUploaded, setPercentageUploaded] = useState(0);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "message":
        setMessage(e.target.value);
        break;
      default:
        break;
    }
  };

  const createMessage = (fileUrl = null) => {
    const msg = {
      timestamp: serverTimestamp(),
      user,
    };

    if (fileUrl !== null) {
      msg["image"] = fileUrl;
    } else {
      msg["content"] = message;
    }
    return msg;
  };

  const sendTextMessage = () => {
    if (message && !_.isEmpty(stream)) {
      sendMessage();
    } else {
      setError("Select a stream and add a message");
    }
  };

  const sendImageMessage = (fileUrl) => {
    if (fileUrl !== null && !_.isEmpty(stream)) {
      sendMessage(fileUrl);
    } else {
      setError("Select a stream and add a file");
    }
  };

  const sendMessage = (fileUrl = null) => {
    setLoading(true);
    fb.addMessage(fb.getMessagesRef(privateStream, stream.id),createMessage(fileUrl))
      .then(() => {
        setLoading(false);
        setMessage("");
        setError("");
        setUploadState("done");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError(err);
        setUploadState("Error");
      });
  };

  const handleInputError = (error, inputName) => {
    return error.toLowerCase().includes(inputName) ? "error" : "";
  };

  const getPath = () => {
    if (privateStream) {
      return `chat/private-${stream.id}`;
    } else {
      return "chat/public";
    }
  };

  const uploadFile = (file, metadata) => {
    const filePath = `${getPath()}/${uuid()}.jpg`;
    const storageRef = ref(fb.storage, filePath);

    let uploadTask = uploadBytesResumable(storageRef, file);
    setUploadState("uploading");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercentageUploaded(progress);
      },
      (error) => {
        console.error(error);
        setUploadState("error");
        uploadTask = null;
        setError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            sendImageMessage(downloadURL);
          })
          .catch((error) => {
            console.error(error);
            setUploadState("error");
            uploadTask = null;
            setError(error);
          });
      }
    );
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
          onClick={sendTextMessage}
          disabled={loading}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
        />
        <Button
          color="teal"
          onClick={openModal}
          disabled={uploadState === "uploading"}
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

export default MessageForm;
