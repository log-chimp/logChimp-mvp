import React from 'react'
import firebase from 'firebase'
import fire from '../fire'
import '../index.css'
import Nav from 'react-bootstrap/Nav'
import styled from 'styled-components'
import { HeatMap } from './Heatmap'

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
      goal: '',
      email: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.addGoal = this.addGoal.bind(this)
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user})
    );

    // this.setState({email : firebase.auth().currentUser.email})
    /* Create reference to goals in Firebase Database */
    let goalsRef = fire.database().ref('goals').orderByKey().limitToLast(100);
    goalsRef.on('child_added', snapshot => {
    /* Update React state when goal is added at Firebase Database */
    let goal = { text: snapshot.val(), id: snapshot.key };
    this.setState({ goals: [goal].concat(this.state.goals) });
     })


    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ email: user.email, id: user.uid})
        console.log(user.uid, 'user');

        firebase.database().ref('users/' + this.state.id).set({
          email: this.state.email,
        });
      }
    });
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

  addGoal (e) {
    e.preventDefault()

     /* Send the goal to Firebase */
     fire.database().ref('goals').push(this.inputEl.value);

     firebase.database().ref('users/' + this.state.id + '/goals').push({
      goal: this.inputEl.value,
    });

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
          <HeatMap />
          <div className="goals">
            <h2>Goals</h2>
            <input type="text" placeholder="Start typing..." value={this.state.goal} onChange={this.handleChange} ref={el => this.inputEl = el} />
            <Button onClick={this.addGoal}>Add Goal</Button>
            {
              this.state.goals.map(goal => <li key={goal.id}>{goal.text}</li>)
            }
          </div>
        </div>
      }
      </div>
    )
  }
}
