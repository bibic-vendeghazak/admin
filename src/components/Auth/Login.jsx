import React, {Component} from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import logo from '../../media/images/other/logo-brown.png'

const initialState = {
  email: "",
  password: ""
}

export default class Login extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  componentWillReceiveProps() {
    const {name} = this.props
    this.setState({name})
  }

  handleLogin() {
    if (this.state.email !== "" && this.state.password !== "") {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      // TODO: Notification toast for successful login.
      .catch(e => console.log(e.message))
    }
    this.setState(initialState)
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
            <button onClick={() => this.handleLogin()}>Bejelentkezés</button>
          </div>
        </header>
        )
  }
}
