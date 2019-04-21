import React from 'react'
import { Redirect } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import fire from '../fire'
import Button from 'react-bootstrap/Button'


export default class SignUp extends React.Component {
  // The component's Local state.
  constructor () {
    super()

    this.state = {
      email: '',
      password: '',
      isSignedIn: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
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
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user})
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })

    console.log(this.state)
  }

  handleSubmit (e) {
    e.preventDefault()

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

    this.setState({
      isSignedIn: true
    })
  }

  render() {
      return (
        <div>
      {this.state.isSignedIn ?
        <Redirect to='/' /> :
        <div>
        <h1>LogChimp</h1>
        <p>Create an account with your email and password</p>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
          </div>
          <div>
            <Button type="submit">Sign Up</Button>
          </div>
        </form>
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={fire.auth()}/>
        </div>
      }
        </div>
      );
  }
}
