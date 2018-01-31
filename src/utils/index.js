import React from 'react'
import Badge from 'material-ui/Badge'

export const initialAppState = {
    isDrawerOpened: true,
    isLoggedIn: false,
    rooms: {},
    calendar: {},
    stats: {},
    feedbacks: {},
    reservations: {},
    roomServices: {},
    unreadReservationCount: 0,
    unreadFeedbackCount: 0,
    openedMenuItem: "reservations",
    appBarRightIcon: [null, null],
    openedMenuTitle: {
        welcome: "Kezdőlap",
        rooms: "Szobák",
        reservations: "Foglalások",
        calendar: "Dátumok",
        stats: "Statisztikák",
        feedbacks: "Visszajelzések",
        settings: "Beállítások"
    },
    gotServerMessage: false,
    serverMessage: "",
    isLoginAttempt: false,
    message: ""
}


export const colors = {
    orange: "#b35d41",
    lightOrange: "#cc8c78",
    lightBrown: "#482c29",
    darkBrown: "#1f1511",
    red: "#C62828",
    yellow: "#f9c554",
    green: "#388E3C"
}

export const TabLabel = ({title, count}) => (
    <div style={{display:"flex", alignItems: "center"}}>
      <div>{title}</div>
      <Badge style={{marginLeft: 12, padding: 12}} primary badgeContent={count}/>
    </div>
)