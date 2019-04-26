import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import '../index.css'
// import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav'
import styled from 'styled-components'

const Button = styled.button`
  background: #8ED2C9;
  color: #FFF;
  margin: 1em;
  padding: 10px;
  width: 100px;
  border: none;
`

export default class Home extends React.Component {
  constructor() {
    super()

    this.state = {
      isSignedIn: false,
      goals: [],
      goal: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user})
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleChange (e) {
    this.setState({
      goal: e.target.value
    })

    console.log(this.state)
  }

  handleClick (e) {
    e.preventDefault()

    this.setState({
      goal: ''
    })
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
            <input type="text" placeholder="Goal" value={this.state.goal} onChange={this.handleChange} />
            <Button onClick={this.handleClick}>Add Goal</Button>
          </div>
        </div>
      }
      </div>
    )
  }
}
