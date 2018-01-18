import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

const Logout = ({reset}) => {
  const logout = () => {
    reset()
    firebase.auth().signOut()
    localStorage.removeItem("profile")
    // TODO: Notification toast for successful logout.
    console.log('Kijelentkezve.')
  }
  return (
    <button
      id="logout-btn"
      onClick={() => logout()}
    >
      Kijelentkezés
    </button>
  )
}

export default Logout
