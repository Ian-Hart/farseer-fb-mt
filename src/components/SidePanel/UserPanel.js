import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../redux/slices/authSlices";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import * as fb from "../../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import AvatarEditor from "react-avatar-editor";

const UserPanel = ({ primaryColor }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [blob, setBlob] = useState(null);
  const [uploadedCroppedImageUrl, setUploadedCroppedImageUrl] = useState("");

  let avatarEditor = null;

  const metadata = {
    contentType: "image/png",
  };

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setPreviewImage(reader.result);
      });
    }
  };

  const handleCropImage = () => {
    if (avatarEditor) {
      avatarEditor.getImageScaledToCanvas().toBlob((_blob) => {
        let imageUrl = URL.createObjectURL(_blob);
        setCroppedImage(imageUrl);
        setBlob(_blob);
      });
    }
  };

  const setEditorRef = (node) => {
    avatarEditor = node;
  };

  const uploadCroppedImage = () => {
    closeModal();
    const avatarStoragePath = `avatars/user-${user.id}`;
    const storageRef = ref(fb.storage, avatarStoragePath);

    uploadBytes(storageRef, blob).then((snap) => {
      getDownloadURL(snap.ref)
        .then((downloadURL) => {
          setUploadedCroppedImageUrl(downloadURL);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  useEffect(() => {
    if (user && uploadedCroppedImageUrl) {
      changeAvatar();
    }
  }, [uploadedCroppedImageUrl]);

  const changeAvatar = () => {
    fb.updateUserProfile(fb.currentUser(), user.name, uploadedCroppedImageUrl)
      .then(() => {
        const updatedUser = fb.currentUser();
        fb.saveUser(updatedUser)
          .then(() => {
            dispatch(setAvatar({ avatar: uploadedCroppedImageUrl }));
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
      });
  };

  const dropdownOptions = () => {
    return [
      {
        key: "user",
        text: (
          <span>
            Signed in as <strong>{user?.name}</strong>
          </span>
        ),
        disabled: true,
      },
      {
        key: "avatar",
        text: <span onClick={openModal}>Change Avatar</span>,
      },
      {
        key: "signout",
        text: <span onClick={handleSignout}>Sign Out</span>,
      },
    ];
  };

  const handleSignout = () => {
    fb.signUserOut().then(() => console.log("signed out!"));
  };

  const displayHeader = () => {
    return (
      <Header style={{ padding: "0.25em" }} as="h4" inverted>
        <Dropdown
          trigger={
            <span>
              <Image src={user?.avatar} spaced="right" avatar />
              {user?.name}
            </span>
          }
          options={dropdownOptions()}
        />
      </Header>
    );
  };

  useEffect(() => {
    displayHeader();
  }, [user]);

  return (
    <Grid style={{ background: primaryColor }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="random" />
            <Header.Content>Farseer</Header.Content>
          </Header>
          {/* User Dropdown  */}
          {displayHeader()}
        </Grid.Row>
        {/* Change User Avatar Modal   */}
        <Modal basic open={modal} onClose={closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              onChange={handleChange}
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={(node) => setEditorRef(node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: "3.5em auto" }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button color="green" inverted onClick={uploadCroppedImage}>
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button color="green" inverted onClick={handleCropImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
