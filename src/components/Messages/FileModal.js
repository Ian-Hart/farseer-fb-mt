import React, { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const FileModal = ({modal, uploadFile, closeModal}) => {

  const [file, setFile] = useState(null);
  const authorized = ["image/jpeg", "image/jpg", "image/png"];

  const addFile = e => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorized()) {
        const metadata = { contentType: file.type};
        uploadFile(file, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  const isAuthorized = () =>
  {
      return (authorized.includes(file.type));
  }

  const clearFile = () => setFile({ file: null });

   return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input onChange={addFile} fluid label="File types:jpeg, jpg, png" name="file" type="file" />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={sendFile} color="green" inverted>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
}

export default FileModal;

