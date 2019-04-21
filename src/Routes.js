import ReactDOM from 'react-dom'
import './index.css'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import App from './components/App'
import SignIn from './Signin'


const routing = (
  <Router>
  <div>
    <Route exact path="/" component={App} />
    <Route path="/signin" component={SignIn} />
  </div>
</Router>
)
