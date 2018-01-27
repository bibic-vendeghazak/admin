import React from 'react'
import Badge from 'material-ui/Badge'
import moment from 'moment'

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
        welcome: "Admin kezelőfelület",
        rooms: "Szobák",
        reservations: "Foglalások",
        calendar: "Dátumok",
        stats: "Statisztikák",
        feedbacks: "Visszajelzések",
        settings: "Beállítások"
    },
    gotError: false,
    dbMessage: "",
    message: "",
    isLoginAttempt: false
}


export const colors = {
    orange: "#fe4536",
    lightBrown: "#482c29",
    darkBrown: "#1f1511"
}

export const TabLabel = ({title, count}) => (
    <div style={{display:"flex", alignItems: "center"}}>
      <div>{title}</div>
      <Badge style={{marginLeft: 12, padding: 12}} primary badgeContent={count}/>
    </div>
)