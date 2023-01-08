import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
} from "semantic-ui-react";
import { HuePicker } from "react-color";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPrimaryColor,
  setSecondaryColor,
  setColors
} from "../../redux/slices/colorSlices";
import * as fb from "../../firebase";
import { onChildAdded, update } from "firebase/database";
import {cloneDeep} from 'lodash';


const ColorPanel = () => {
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  let primaryColor = useSelector((state) => state?.color.primary);
  let secondaryColor = useSelector((state) => state?.color.secondary);
  let colors = useSelector((state) => state?.color.colors);

  let _primary = "";
  let _secondary = "";
  let _colors = [];

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    let unsubscribe = colorAddedListener();
    return () => unsubscribe();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const colorAddedListener = () => {
    return onChildAdded(fb.userColorsListRef(user.id), (snap) => {
      _colors.unshift(snap.val());
      const clonedColors = cloneDeep(_colors);
      dispatch(setColors(clonedColors));
    });
  };

  const handleChangePrimary = (color) => (_primary = color.hex);
  const handleChangeSecondary = (color) => (_secondary = color.hex);

  const handleSaveColors = () => {
    console.log("handle save colors");
    if (_primary && _secondary) {
      saveColors(_primary, _secondary);
    }
  };

  const saveColors = (primary, secondary) => {
    update(fb.userColorsRef(user.id), {
      primary,
      secondary,
    })
      .then(() => {
        console.log("Colors added");
        dispatch(setPrimaryColor(primary));
        dispatch(setSecondaryColor(secondary));
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const setPrimarySecondaryColors = (primary, secondary) => {
    dispatch(setPrimaryColor(primary));
    dispatch(setSecondaryColor(secondary));
  }

  const displayUserColors = () =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() => setPrimarySecondaryColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            />
          </div>
        </div>
      </React.Fragment>
    ));

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <Sidebar
      as={Menu}
      icon="labeled"
      inverted
      vertical
      visible
      width="very thin"
      style={{ background: "white", fontSize: "1.2rem" }}
    >
      <Divider />
      <Button icon="add" size="small" color="blue" onClick={openModal} />
      {displayUserColors()}

      {/* Color Picker Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Label content="Primary Color" />
          <HuePicker
            color={_primary}
            onChange={(color) => handleChangePrimary(color)}
          />
          <Label content="Secondary Color" />
          <HuePicker
            color={_secondary}
            onChange={(color) => handleChangeSecondary(color)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSaveColors}>
            <Icon name="checkmark" /> Save Colors
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

export default ColorPanel;
