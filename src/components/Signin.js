import React from "react";
import { Link, Redirect } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import fire from "../fire";
import "../index.css";
// import Button from 'react-bootstrap/Button';
import styled from "styled-components";

const Button = styled.button`
  background: #ff7a5a;
  color: #fff;
  margin: 1em;
  padding: 7px;
  width: 370px;
  border-radius: 25px;
  border: none;
`;

export default class SignIn extends React.Component {
  // The component's Local state.
  constructor() {
    super();

    this.state = {
      isSignedIn: false, // Local signed-in state.
      email: "",
      password: "",
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();

    firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ email: "", password: "", error: null });
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  }

  render() {
    const { email, password, error } = this.state;

    return (
      <div>
        {this.state.isSignedIn ? (
          <Redirect to="/" />
        ) : (
          <div>
            <Link to="/">
              <h1>LogChimp</h1>
            </Link>
          {error && <p>Invalid e-mail or password</p>}
            <div className="signin">
              <h4>Please sign-in:</h4>

              <form onSubmit={this.handleSubmit}>
                <div>
                  {/* <label htmlFor="email">
              <small>Email</small>
            </label> */}
                  <input
                    name="email"
                    type="text"
                    value={email}
                    placeholder="E-mail"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  {/* <label htmlFor="password">
              <small>Password</small>
            </label> */}
                  <input
                    name="password"
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <Button variant="light" type="submit">
                    Sign In
                  </Button>
                </div>
              </form>
              <h4>Don't have an account?</h4>
              <Link to="/signup">Sign Up</Link>
            </div>
            <div>
              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={fire.auth()}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
