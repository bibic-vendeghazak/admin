import React, {Component} from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import logo from '../../media/images/other/logo-brown.png'
import RaisedButton from 'material-ui/RaisedButton'

const initialState = {
  email: "",
  password: ""
}

export default class Login extends Component {
  state = initialState
  handleLogin = () => {
    const {email, password} = this.state
    if (email !== "" && password !== "") {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.loginAttempt("Sikeres bejelentkezés.")
        this.setState(initialState)
      })
      .catch(({message}) => this.props.loginAttempt(message))
    }
  }

  handleEnterPress(e) {
    e.key === 'Enter' && this.handleLogin()
  }

  handleInput(e, type) {
    this.setState({[type]: e.target.value})
  }

  render() {
    return (
        <header>
          <div id="login-wrapper">
            <div id="login-title">
              <a href="https://balazsorban44.github.io/bibic-vendeghazak" target="_blank" rel="noopener noreferrer"><img src={logo} alt="Bíbic vendégházak logo"/></a>
              <h2>Admin kezelőfelület</h2>
            </div>
            <div id="login-form">
              <input
                id="email"
                onKeyPress={e => this.handleEnterPress(e)}
                onChange={e => this.handleInput(e,"email")}
                type="email"
                placeholder="E-mail cím"
              />
              <input
                id="password"
                onKeyPress={e => this.handleEnterPress(e)}
                onChange={e => this.handleInput(e,"password")}
                type="password"
                placeholder="Jelszó"
              />
            </div>
            <RaisedButton secondary label="Bejelentkezés" onClick={this.handleLogin}/> 
          </div>
        </header>
        )
  }
}
