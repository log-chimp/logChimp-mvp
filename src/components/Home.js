import React from "react";
import firebase from "firebase";
import fire from "../fire";
import dateFormat from "dateformat";
import "../index.css";
import Nav from "react-bootstrap/Nav";
import styled from "styled-components";
import StarRatingComponent from "react-star-rating-component";
import { HeatMap } from "./Heatmap";
import SignIn from "./Signin";

const Button = styled.button`
  background: #8ed2c9;
  color: #fff;
  margin: 1em;
  padding: 10px;
  width: 100px;
  border: none;
`;

export default class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      isSignedIn: false,
      goals: [],
      goal: "",
      email: "",
      rating: 1,
      showSignUp: false,
      sickDays: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.addGoal = this.addGoal.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
    this.heatMapClick = this.heatMapClick.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));

    // this.setState({email : firebase.auth().currentUser.email})
    /* Create reference to goals in Firebase Database */
    let goalsRef = fire
      .database()
      .ref("goals")
      .orderByKey()
      .limitToLast(100);
    goalsRef.on("child_added", snapshot => {
      /* Update React state when goal is added at Firebase Database */
      let goal = { text: snapshot.val(), id: snapshot.key };
      this.setState({ goals: [goal].concat(this.state.goals) });
    });

    let sickDaysRef = fire
      .database()
      .ref("sickDays")
      .orderByKey()
      .limitToLast(100);
    sickDaysRef.on("child_added", snapshot => {
      /* Update React state when goal is added at Firebase Database */
      let sickDay = { text: snapshot.val(), id: snapshot.key };
      this.setState({ sickDays: [sickDay].concat(this.state.sickDays) });
    });

    //   let indiv = fire
    //   .database()
    //   .ref("users/" + this.state.id + "/goals")
    //   .orderByKey()
    //   .limitToLast(100);
    // indiv.on("child_added", snapshot => {
    //   /* Update React state when goal is added at Firebase Database */
    //   let goal = { text: snapshot.val(), id: snapshot.key };
    //   this.setState({ indiv: [goal].concat(this.state.indiv) });
    // });

    let starReport = fire
      .database()
      .ref("stars")
      .orderByKey()
      .limitToLast(100);
    starReport.on("child_added", snapshot => {
      /* Update React state when goal is added at Firebase Database */
      let starRep = { text: snapshot.val(), id: snapshot.key };
      this.setState({ rating: starRep });
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ email: user.email, id: user.uid });

        firebase
          .database()
          .ref("users/" + this.state.id)
          .set({
            email: this.state.email
          });
      }
    });

    console.log(dateFormat(new Date(), "isoDateTime"));
    // "date": "2016-01-01 12:30:45",
    //2019-04-27T18:18:34-0400,
    let rawDate = dateFormat(new Date(), "isoDateTime");
    let date = rawDate.split("T");
    let finalDate = date[0];
    let time = date[1].split("-")[0];

    console.log(finalDate, time);
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleChange(e) {
    this.setState({
      goal: e.target.value
    });
  }

  heatMapClick() {
    let rawDate = dateFormat(new Date(), "isoDateTime");
    let date = rawDate.split("T");
    let finalDate = date[0];
    let time = date[1].split("-")[0];

    let data = {
      date: finalDate,
      total: 17164,
      details: [
        {
          name: "Project 1",
          date: `${finalDate} ${time}`,
          value: 9192
        },
        {
          name: "Project 2",
          date: `${finalDate} ${time}`,
          value: 6753
        },
        {
          name: "Project N",
          date: `${finalDate} ${time}`,
          value: 1219
        }
      ]
    };

    // fire
    // .database()
    // .ref("sickDays")
    // .push(data)

    console.log("SICK DAYS", this.state);
  }

  addGoal(e) {
    e.preventDefault();

    let rawDate = dateFormat(new Date(), "isoDateTime");
    let date = rawDate.split("T");
    let finalDate = date[0];
    let time = date[1].split("-")[0];

    let data = {
      date: finalDate,
      total: 17164,
      details: [
        {
          name: this.inputEl.value,
          date: `${finalDate} ${time}`,
          value: 9192
        }
      ]
    };

    /* Send the goal to Firebase */
    fire
      .database()
      .ref("goals")
      .push({
        goal: this.inputEl.value,
        userId: this.state.id
      });

    firebase
      .database()
      .ref("users/" + this.state.id + "/goals")
      .push({
        goal: this.inputEl.value,
        id: this.state.id
      });

    fire
      .database()
      .ref("sickDays")
      .push(data);

    this.setState({
      goal: ""
    });

    console.log(this.state);
  }

  onStarClick(nextValue, prevValue, name) {
    // this.setState({ rating: nextValue });

    fire
      .database()
      .ref("stars")
      .set(nextValue);

    this.setState({ rating: nextValue, showSignUp: true });
  }

  render() {
    const individualGoals = this.state.goals.filter(
      goal => goal.text.userId === this.state.id
    );
    const sickDays = this.state.sickDays.length > 0 && [
      this.state.sickDays[0].text
    ];
    const { rating } = this.state;

    console.log("WHAT AM I", sickDays);
    return (
      <div>
        {!this.state.isSignedIn ? (
          <div>
            <Nav className="justify-content-end">
              <Nav.Item>
                <Nav.Link href="/signin">Sign In</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/signup">Create An Account</Nav.Link>
              </Nav.Item>
            </Nav>
            {this.state.showSignUp ? (
              <SignIn rating={this.state.rating} />
            ) : (
              <div>
                <h1>Welcome to LogChimp!</h1>
                <div>
                  {/* <Link to="/signin"> */}
                  <h4 className="starcomp">How are you feeling today?</h4>
                  <div className="reviewratingstar">
                    <StarRatingComponent
                      name="rating"
                      starCount={3}
                      starColor="#590546"
                      emptyStarColor="#16105136"
                      value={rating}
                      onStarClick={this.onStarClick.bind(this)}
                      className="reviewratingstar"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div>
              <Button onClick={() => firebase.auth().signOut()}>
                Sign out
              </Button>
              <h3>Welcome back {firebase.auth().currentUser.email}!</h3>
            </div>
            <HeatMap data={sickDays} heatMapClick={this.heatMapClick} />
            <div className="goals-container">
              <h2>Symptoms</h2>
              <input
                type="text"
                placeholder="Start typing..."
                value={this.state.goal}
                onChange={this.handleChange}
                ref={el => (this.inputEl = el)}
              />
              <Button onClick={this.addGoal}>Add Symptom</Button>
            </div>
            {individualGoals.length && (
              <div className="goals">
                {individualGoals.map(goal => (
                  <li key={goal.id}>{goal.text.goal}</li>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
