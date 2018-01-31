import React, {Component} from 'react'

export default class Welcome extends Component {

  componentWillReceiveProps({appBarRightAction}) {
    appBarRightAction === "welcome" && window.open("mailto:info@balazsorban.com?&subject=Hiba jelentése", '_blank')
  }
  render() {
    return (
      <h2 style={{paddingTop: "30%", textAlign: "center"}}>Admin kezelőfelület</h2>
    )
  }
}