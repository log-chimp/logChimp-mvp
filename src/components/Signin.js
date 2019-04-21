import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import fire from '../fire'
import '../index.css'
import Button from 'react-bootstrap/Button';



export default class SignIn extends React.Component {
  // The component's Local state.
  constructor () {
    super()

    this.state = {
      isSignedIn: false, // Local signed-in state.
      email: '',
      password: ''
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

    firebase.auth().onAuthStateChanged(
      (user) => this.setState({isSignedIn: !!user}))

    this.setState({
      email: '',
      password: ''
    })

  }

  render() {
      return (
        <div>
        { this.state.isSignedIn ? <Redirect to='/' /> :
        <div>
        <h1>LogChimp</h1>
        <div>
        <p>Please sign-in:</p>

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
            <Button type="submit">Sign In</Button>
          </div>
        </form>
        <h2>Don't have an account yet?</h2>
        <Link to="/signup">Sign Up</Link>
        </div>
      <div>
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={fire.auth()}/>
      </div>
      </div>
      }
        </div>
      );
  }
}
