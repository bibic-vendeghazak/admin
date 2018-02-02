import React from 'react'

import RaisedButton from 'material-ui/RaisedButton'


const Logout = ({handleLogout}) => (
  <RaisedButton fullWidth secondary 
    style={{
      position: "absolute",
      bottom: 0
    }}
    label="Kijelentkezés"
    onClick={handleLogout}
  />
)

export default Logout
