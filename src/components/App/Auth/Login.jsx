import React, {Component} from "react"
import PropTypes from "prop-types"

import {Button, CardHeader, Card, CardActions, CardContent, Divider, TextField} from "@material-ui/core"

import {AUTH} from "../../../utils/firebase"
import {withStore} from "../Store"
import logo from "../../../assets/bibic.png"


const initialState = {
  email: "",
  password: ""
}


class Login extends Component {

  static propTypes = {sendNotification: PropTypes.func.isRequired}

  state = initialState

  handleLogin = () => {
    const {
      email, password
    } = this.state
    if (email !== "" && password !== "") {
      AUTH.signInWithEmailAndPassword(email, password)
        .then(() => this.setState(initialState))
        .catch(this.props.sendNotification)
    }
  }

  handleEnterPress = ({key}) => key === "Enter" && this.handleLogin()

  handleInputChange = ({target: {
    name, value
  }}) => this.setState({[name]: value})

  render() {
    return (
      <Card
        raised
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 340
        }}
      >
        <CardHeader
          subheader="🔒 • ADMIN KEZELŐFELÜLET"
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              Bíbic vendégházak
              <a href="https://bibic-vendeghazak-api.firebaseapp.com">
                <img
                  alt="Bíbic vendégházak logo"
                  src={logo}
                  style={{marginBottom: -24}}
                  width={48}
                />
              </a>
            </div>
          }
        />
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TextField
            fullWidth
            label="e-mail"
            name="email"
            onChange={this.handleInputChange}
            onKeyPress={this.handleEnterPress}
            style={{marginBottom: 12}}
            type="email"
          />
          <TextField
            fullWidth
            label="jelszó"
            name="password"
            onChange={this.handleInputChange}
            onKeyPress={this.handleEnterPress}
            type="password"
          />
        </CardContent>
        <Divider/>
        <CardActions>
          <Button
            color="secondary"
            onClick={this.handleLogin}
            variant="contained"
          >
            Bejelentkezés
          </Button>
        </CardActions>
      </Card>
    )
  }
}


export default withStore(Login)