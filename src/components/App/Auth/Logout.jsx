import React from 'react'

import RaisedButton from 'material-ui/RaisedButton'


const Logout = ({handleLogout}) => (
  <RaisedButton fullWidth secondary 
    label="Kijelentkezés"
    onClick={handleLogout}
  />
)

export default Logout
