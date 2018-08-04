import React, {Component} from "react"

import {PlaceholderText} from "../../shared"


export default class Welcome extends Component {

	UNSAFE_componentWillReceiveProps({appBarRightAction}) {
		appBarRightAction === "welcome" && window.open("mailto:info@balazsorban.com?&subject=Hiba jelentése", "_blank")
	}

	render() {
		return (
			<PlaceholderText>
        Admin kezelőfelület
			</PlaceholderText>
		)
	}
}