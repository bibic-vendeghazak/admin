import React from "react"

import RaisedButton from "material-ui/RaisedButton"


const Logout = ({handleLogout}) => (
	<div style={{display: "flex", justifyContent: "flex-end", margin: "1em"}}>
		<RaisedButton secondary 
			label="Kijelentkezés"
			onClick={handleLogout}
		/>
	</div>
)

export default Logout
