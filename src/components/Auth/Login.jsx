import React, {Component} from "react"
import PropTypes from "prop-types"

import {
  Button, CardHeader, Card, CardActions, CardContent, Divider, TextField, Grid, Typography, Tooltip
} from "@material-ui/core"

import {AUTH} from "../../lib/firebase"
import {withStore} from "../../db"
import logo from "../../assets/bibic.png"


const initialState = {email: "",
  password: ""}


class Login extends Component {

  static propTypes = {sendNotification: PropTypes.func.isRequired}

  state = initialState

  handleLogin = () => {
    const {email, password} = this.state
    if (email !== "" && password !== "") {
      AUTH.signInWithEmailAndPassword(email, password)
        .then(() => this.setState(initialState))
        .catch(this.props.sendNotification)
    }
  }

  handleEnterPress = ({key}) => key === "Enter" && this.handleLogin()

  handleInputChange = ({target: {name, value}}) => this.setState({[name]: value})


  handleResetPassword = async () => {
    const {email} = this.state

    if (email !== "") {
      try {
        await AUTH.sendPasswordResetEmail(email)
        this.props.sendNotification({code: "success", message: "Ön új jelszót igényelt. Kérjük ellenőrizze e-mail fiókját."})
      } catch (error) {
        switch (error.code) {
        case "auth/user-not-found":
          error.message = "Nem található felhasználó ezzel az e-mail címmel."
          break
        default:
          break
        }
        this.props.sendNotification(error, 15000)
      }
    } else {
      this.props.sendNotification({code: "error", message: "Kérjük, hogy adja meg az e-mail címet."}, 8000)
    }
  }


  render() {
    return (
      <Grid
        alignItems="center"
        container
        direction="column"
        justify="center"
        style={{height: "100vh"}}
      >
        <Card
          raised
          style={{width: 340, padding: 8}}
        >
          <CardHeader
            subheader="🔒 • ADMIN KEZELŐFELÜLET"
            title={
              <div
                style={{display: "flex",
                  justifyContent: "space-between"}}
              >
              Bíbic vendégházak
                <a href={process.env.REACT_APP_ADMIN_DASHBOARD_URL}>
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
          <Divider/>
          <CardContent>
            <TextField
              autoFocus
              fullWidth
              label="e-mail"
              name="email"
              onChange={this.handleInputChange}
              onKeyPress={this.handleEnterPress}
              style={{marginBottom: 12}}
              type="email"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="jelszó"
              name="password"
              onChange={this.handleInputChange}
              onKeyPress={this.handleEnterPress}
              type="password"
              variant="outlined"
            />
            <Tooltip title="Erre a linkre kattintva új jelszót igényelhet.">
              <Typography
                color="secondary"
                onClick={this.handleResetPassword}
                style={{
                  paddingTop: 8,
                  cursor: "pointer",
                  textDecoration:"underline",
                  fontStyle: "italic"
                }}
              >
                Elfelejtett jelszó?
              </Typography>
            </Tooltip>
          </CardContent>
          <Divider/>
          <CardActions>
            <Grid container justify="flex-end">
              <Button
                color="secondary"
                onClick={this.handleLogin}
                size="large"
                variant="contained"
              >
              Bejelentkezés
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    )
  }
}


export default withStore(Login)