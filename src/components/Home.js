import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import '../index.css'
// import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav'
import styled from 'styled-components'

const Button = styled.button`
  background: rgb(228,211,176);
  color: rgb(117,117,117);
  margin: 1em;
  padding: 10px;
  width: 100px;
  border: none;
`

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
          <Nav className="justify-content-end">
            <Nav.Item>
              <Nav.Link href="/signin">Sign In</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/signup">Create An Account</Nav.Link>
            </Nav.Item>
          </Nav>
          <h1>Welcome to LogChimp!</h1>
        </div> :
        <div>
          <div>
            <Button onClick={() => firebase.auth().signOut()}>Sign out</Button>
            <h3>Welcome back {firebase.auth().currentUser.email}!</h3>
          </div>
          <div className="goals">
            <h2>Goals</h2>
            <input type="text" placeholder="Goal" />
            <Button>Add Goal</Button>
          </div>
        </div>
      }
      </div>
    )
  }
}
