import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import fire from '../fire'
import '../index.css'
// import Button from 'react-bootstrap/Button';
import styled from 'styled-components'

const Button = styled.button`
  background: #FF7A5A;
  color: #FFF;
  margin: 1em;
  padding: 7px;
  width: 370px;
  border-radius: 25px;
  border: none;
`

export default class SignIn extends React.Component {
  // The component's Local state.
  constructor () {
    super()

    this.state = {
      isSignedIn: false, // Local signed-in state.
      email: '',
      password: '',
      error: null
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

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
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
      const { email, password, error} = this.state
      return (
        <div>
        { this.state.isSignedIn ? <Redirect to='/' /> :
        <div>
        <Link to="/"><h1>LogChimp</h1></Link>
        <div className="signin">
        {error && <p>Account already exists</p>}
        <h4>Create An Account</h4>

        <form onSubmit={this.handleSubmit}>
          <div>
            {/* <label htmlFor="email">
              <small>Email</small>
            </label> */}
            <input name="email" type="text" value={email} placeholder="E-mail" onChange={this.handleChange} />
          </div>
          <div>
            {/* <label htmlFor="password">
              <small>Password</small>
            </label> */}
            <input name="password" type="password" value={password} placeholder="Password" onChange={this.handleChange} />
          </div>
          <div>
            <Button variant="light" type="submit">Sign Up</Button>
          </div>
        </form>
        <h4>Already have an account?</h4>
        <Link to="/signin">Sign In</Link>
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