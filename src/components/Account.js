import React from 'react';

class Account extends React.Component {
  constructor() {
    super();

    this.register = false;
    this.state = { loginText: 'LOGIN' };
  }

  changeToRegister = (e) => {
    e.preventDefault();
    this.register = true;
    this.setState({loginText: 'REGISTER'});
  }
    
  render() {
    if (this.props.user.loggedIn) {
      return (
          <div className="App-login">
            <form onSubmit={(e) => this.props.loginBaqend(e)}>
              <button type="submit">LOGOUT</button>
            </form>
          </div>
      )
    } else {
      return (
          <div className="App-login">
            <form className="login-form" onSubmit={(e) => this.props.loginBaqend(e, this.username.value, this.password.value, this.register)}>
              <input type="text" required placeholder="Username" ref={(input) => { this.username = input}} />
              <input type="password" required placeholder="Password" ref={(input) => { this.password = input}} /> 
              <button type="submit">{this.state.loginText}</button>
              <span className="login-register" onClick={(e) => this.changeToRegister(e)}> Not yet a member, click here to register. Only lpfrg employees can register at this moment.</span>
            </form>
          </div>
      )
    }
  }
}

export default Account;