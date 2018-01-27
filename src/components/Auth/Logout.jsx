import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import RaisedButton from 'material-ui/RaisedButton'

const Logout = ({reset, loginAttempt}) => {
  const logout = () => {
    reset()
    firebase.auth().signOut().then(() => {
      loginAttempt("Sikeres kijelentkezés.")
    })
  }
  return (
    <RaisedButton 
      style={{position: "absolute", bottom: 0}}
      fullWidth secondary 
      label="Kijelentkezés"
      onClick={() => logout()}
   />
  )
}

export default Logout
