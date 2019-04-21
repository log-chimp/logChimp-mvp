import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import '../index.css'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav'



export default class Home extends React.Component {
  constructor() {
    super()

    this.state = {
      isSignedIn: false
    }
  }
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user})
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {

    return (
      <div>
      { !this.state.isSignedIn ?
        <div>
        <Nav className="justify-content-end" variant="pills">
        <Nav.Item>
        <Nav.Link href="/signin">Sign In</Nav.Link>
        </Nav.Item>
        <Nav.Item>
        <Nav.Link href="/signup">Create an account</Nav.Link>
        </Nav.Item>
        </Nav>
        <h1>Welcome to LogChimp</h1>
        </div> :
        <div>
        <Button onClick={() => firebase.auth().signOut()}>Sign out</Button>
        <h1>Welcome back {firebase.auth().currentUser.email}</h1>
        </div>
      }

      </div>
    )
  }
}
