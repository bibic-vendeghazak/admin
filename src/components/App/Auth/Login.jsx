import React, {Component} from 'react'
import firebase from 'firebase'

import {Divider, RaisedButton} from 'material-ui'

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
        this.handleNotification("Sikeres bejelentkezés.", "success")
        this.setState(initialState)
      })
      .catch(({message, code}) => this.props.handleNotification(message, "error", code))
    }
  }

  handleEnterPress = ({key}) => key === 'Enter' && this.handleLogin()

  handleInputChange = ({target: {name, value}}) => this.setState({[name]: value})

  render() {
    return (
        <header>
          <div id="login-wrapper">
            <div id="login-title">
              <a href="https://balazsorban44.github.io/bibic-vendeghazak" target="_blank" rel="noopener noreferrer"><img src={"https://bibic-vendeghazak.github.io/web/assets/images/other/logo-brown.png"} alt="Bíbic vendégházak logo"/></a>
            </div>
            <div id="login-form">
              <input
                name="email"
                onKeyPress={this.handleEnterPress}
                onChange={this.handleInputChange}
                type="email"
                placeholder="E-mail cím"
              />
              <Divider/>
              <input
                name="password"
                onKeyPress={this.handleEnterPress}
                onChange={this.handleInputChange}
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
