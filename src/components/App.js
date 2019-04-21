import React, { Component } from 'react'
import '../index.css'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import SignIn from './Signin'
import SignUp from './Signup'

export default class App extends Component {
  render () {
    return (
      <div>
      <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    </Switch>
  </div>
    )

  }
}

// export default App;
