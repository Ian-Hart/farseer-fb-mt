import React, { useState } from "react";
import {Link, useNavigate, Navigate } from "react-router-dom";
import {useSelector } from "react-redux";
import * as fb from "../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const auth = useSelector(state => state?.auth);
  const isSignedIn = auth.user?.isSignedIn;

  const isFormValid = () => email && password;

  const displayErrors = () => <p>{error}</p>;

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
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
      fb.signIn(email, password)
        .then((signedInUser) => {
          navigate("/");
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
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="eye" color="orange" />
          Login to Farseer
        </Header>
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
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
            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="orange"
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
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
