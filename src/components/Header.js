import React from 'react';
import { Link } from 'react-router';
import logo from '../css/images/leapfrog-logo.png';

class Header extends React.Component {
  render() {
    return (
        <div className="App-header">
            <div className="App-logo">
                <Link to='/'>
                    <img src={logo} className="App-logo" alt="logo" />
                </Link>
            </div>
            <div className="App-nav">
                <ul className="nav">
                    <li><Link to="/">DATABASE</Link></li>
                    <li><Link to="/about">ABOUT</Link></li>
                    <li><Link to="/account">{!this.props.user.loggedIn ? 'LOGIN' : 'ACCOUNT'}</Link></li>
                </ul>
            </div>
        </div>
    )
  }
}

export default Header;