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
    roomsBooked: {},
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


const {darkBrown, lightBrown, orange} = colors
export const muiTheme = {
    palette: {
        primary1Color: darkBrown,
        primary2Color: lightBrown,
        accent1Color: orange
    },
    badge: {
        primaryColor: orange
    },
    datePicker: {
        headerColor: orange,
        selectColor: lightBrown
    },
    drawer: {
        color: lightBrown
    }
}
  
  