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
    openedMenuItem: "calendar",
    openedMenuTitle: {
        welcome: "Admin kezelőfelület",
        rooms: "Szobák",
        reservations: "Foglalások",
        calendar: "Dátumok",
        stats: "Statisztikák",
        feedbacks: "Visszajelzések",
        settings: "Beállítások"
    },
    appBarRightIcon: "",
    appBarRightAction: null,
    message: "",
    isLoginAttempt: false
}

export const formatData = (user, data) => {
    const {admins, rooms, roomServices} = data
    const [reservations, unreadReservationCount] = fetchPosts(data.reservations)
    const [feedbacks, unreadFeedbackCount] = fetchPosts(data.feedbacks)
    const {name, src} = admins[user.uid]
    const handledReservations = {}
    Object.entries(reservations).forEach(reservation => {
      if (reservation[1].metadata.handled) {
        handledReservations[reservation[0]] = reservation[1]
      }
    })
    return {
        profile: {name, src},
        rooms, roomServices,
        reservations, unreadReservationCount, handledReservations,
        feedbacks, unreadFeedbackCount
    }
}

const fetchPosts = posts => {
    let unreadPostCount = 0
    let merged = {}
    const {metadata, details} = posts
    for (let post in metadata) {
        !metadata[post].handled && unreadPostCount++
        merged[post] = {
            metadata: metadata[post],
            details: details[post]
        }
    }
    return [merged, unreadPostCount]
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