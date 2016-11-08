import React, { Component } from 'react';
import { Match, Miss } from 'react-router'; 
import { db } from 'baqend';

import '../css/App.css';

import Header from './Header'
import GcodeList from './GcodeList'
import GcodeSingle from './GcodeSingle'
import NotFound from './NotFound';
import Footer from './Footer';
import About from './About';
import Account from './Account';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gcodes: {},
      user: {
        loggedIn: false,
        username: null
      }
    }
  }

  componentWillMount() {
    db.connect('lgd', true);

    const gcodes = {};
    const user = {...this.state.user};
    db.ready().then(() => {
      // Check if logged in and if so put that in state
      if(db.User.me) {
        user.loggedIn = true;
        user.username = db.User.username;
      }
      // Get gcode info
      db.Gcode
        .find()
        .resultList(result => {
          result.forEach(gcode => {
            const clean_id = gcode.id.replace('/db/Gcode/', '')
            gcodes[clean_id] = {
              name: gcode.name,
              image: gcode.image,
              info: gcode.info,
              upload_date: gcode.upload_date,
              verified: gcode.verified,
              print_time: gcode.print_time
            }
          })
        this.setState({ gcodes, user });
        })

    });
  }

  loginBaqend = (e, username, password, register) => {
    e.preventDefault();
    const user = {...this.state.user}
    // Check if not already logged in
    if (user.loggedIn) {
      console.log("Logging out")
      db.User.logout()
      user.loggedIn = false;
      user.username = null;
    } else if (register) {
      db.User.register(username, password)
        .then(() => {
          console.log("Registering user.");
          alert('An email has been send to you, please verify your email adress. The email might have landed in your spam folder.');
        })
        .catch(() => {
          alert('Registration failed. Only emails ending on @lpfrg.com are for now.');
        })
    } else {
      db.User.login(username, password)
      .then(() => {
        user.loggedIn = true;
        user.username = db.User.me.username;
        console.log(db.User.me.username);
        this.context.router.transitionTo('/');
      })
      .catch((e) => {
        alert('Failed to login!')
        console.log(e)
      });
    }
    this.setState({ user });
  }

  render() {
    return (
      <div className="App">
        <Header user={this.state.user} />
        <div className="App-content">
          <Match exactly pattern="/" render={(defaultProps) => <GcodeList gcodes={this.state.gcodes} {...defaultProps}/>} />
          <Match pattern="/gcode/:gcodeId" render={(defaultProps) => <GcodeSingle gcodes={this.state.gcodes} {...defaultProps}/>} />
          <Match pattern="/account" render={(defaultProps) => <Account user={this.state.user} loginBaqend={this.loginBaqend} {...defaultProps}/>} />
          <Match pattern="/about" component={ About } />
          <Miss component={ NotFound } />
        </div>
        <Footer />
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}
export default App;
