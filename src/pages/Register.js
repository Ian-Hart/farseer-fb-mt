import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import * as fb from "../firebase";
import md5 from "md5";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link} from "react-router-dom";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isSignedIn = false;

  const isFormValid = () => {
    if (isFormEmpty()) {
      setError("All fields are required");
      return false;
    } else if (!isPasswordValid()) {
      setError("Password is invalid - Minimum of 6 characters required");
      return false;
    } else if (!isPasswordConfirmed()) {
      setError("Password and confirmation password are different");
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = () => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = () => {
    if (password.length < 6) {
      return false;
    } else {
      return true;
    }
  };

  const isPasswordConfirmed = () => {
    if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const displayErrors = () => <p>{error}</p>;

  const handleChange = (e) => {
    switch (e.target.name) {
      case "username":
        setUserName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "passwordConfirmation":
        setPasswordConfirmation(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setError("");
      setLoading(true);
      fb.createUser(email, password)
        .then((createdUser) => {
          
          let profilePhotoUrl = `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`;

          fb.updateUserProfile(createdUser.user, username, profilePhotoUrl)
            .then(() => {
              fb.saveUser(createdUser.user).then(() => {
                navigate("/");
              });
            })
            .catch((err) => {
              setError(err.code);
            });
        })
        .catch((err) => {
          setError(err.code);
        })
        .finally(()=>{
          setLoading(false);
        })
    }
  };

  const handleInputError = (error, inputName) => {
    return error.toLowerCase().includes(inputName) ? "error" : "";
  };

  return (
    isSignedIn ? <Navigate to="/" replace /> :
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="blue" textAlign="center">
          <Icon name="eye" color="blue" />
          Register for Farseer
        </Header>
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
              value={username}
              type="text"
            />

            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleChange}
              value={email}
              className={handleInputError(error, "email")}
              type="email"
            />

            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
              value={password}
              className={handleInputError(error, "password")}
              type="password"
            />

            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={handleChange}
              value={passwordConfirmation}
              className={handleInputError(error, "password")}
              type="password"
            />
            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="blue"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {error.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors()}
          </Message>
        )}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
