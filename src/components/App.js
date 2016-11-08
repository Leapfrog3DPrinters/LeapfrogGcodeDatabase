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
import Login from './Login';


class App extends Component {
  constructor() {
    super();
    this.state = {
      gcodes: {}
    }
  }

  componentWillMount() {
    db.connect('lgd', true);

    const gcodes = {};
    db.ready().then(() => {
      db.Gcode
        .find()
        .resultList(result => {
          result.forEach(gcode => {
            const clean_id = gcode.id.replace('/db/Gcode/', '')
            gcodes[clean_id] = {
              name: gcode.name,
              image: gcode.image,
              desc: gcode.info,
              upload_date: gcode.upload_date
            }
          })
        this.setState({ gcodes });
        console.log("Setting initial State")
        })
    });

  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-content">
          <Match exactly pattern="/" render={(defaultProps) => <GcodeList gcodes={this.state.gcodes} {...defaultProps}/>} />
          <Match pattern="/gcode/:gcodeId" render={(defaultProps) => <GcodeSingle gcodes={this.state.gcodes} {...defaultProps}/>} />
          <Match pattern="/about" component={ About } />
          <Match pattern="/login" component={ Login } />
          <Miss component={NotFound} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
