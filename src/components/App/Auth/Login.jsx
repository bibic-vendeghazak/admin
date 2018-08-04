import React, {Component} from 'react'

import {Divider, RaisedButton} from 'material-ui'
import {AUTH} from '../../../utils/firebase'

const initialState = {
  email: "",
  password: ""
}


export default class Login extends Component {
  state = initialState

  handleLogin = () => {
    const {
      email, password
    } = this.state
    if (email !== "" && password !== "") {
      AUTH.signInWithEmailAndPassword(email, password)
        .then(() => {
          this.handleNotification("Sikeres bejelentkezés.", "success")
          this.setState(initialState)
        })
        .catch(({
          message, code
        }) => this.props.handleNotification(message, "error", code))
    }
  }

  handleEnterPress = ({key}) => key === 'Enter' && this.handleLogin()

  handleInputChange = ({target: {
    name, value
  }}) => this.setState({[name]: value})

  render() {
    return (
      <header>
        <div id="login-wrapper">
          <div id="login-title">
            <a
              href="https://balazsorban44.github.io/bibic-vendeghazak"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="Bíbic vendégházak logo"
                src={"https://bibic-vendeghazak.github.io/web/assets/images/other/logo-brown.png"}
              />
            </a>
          </div>
          <div id="login-form">
            <input
              name="email"
              onChange={this.handleInputChange}
              onKeyPress={this.handleEnterPress}
              placeholder="E-mail cím"
              type="email"
            />
            <Divider/>
            <input
              name="password"
              onChange={this.handleInputChange}
              onKeyPress={this.handleEnterPress}
              placeholder="Jelszó"
              type="password"
            />
          </div>
          <RaisedButton
            label="Bejelentkezés"
            onClick={this.handleLogin}
            secondary
          />
        </div>
      </header>
    )
  }
}
