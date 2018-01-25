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
    openedMenuItem: "rooms",
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
    message: "",
    isLoginAttempt: false
}

export const formatData = (user, data) => {
    const {admins, rooms} = data
    const [reservations, unreadReservationCount] = fetchPosts(data.reservations)
    const [feedbacks, unreadFeedbackCount] = fetchPosts(data.feedbacks)
    const {name, src} = admins[user.uid]
    const handledReservations = {}
    const roomsBooked = Array(Object.keys(data.rooms).length)

    const todayInterval = moment.range(moment().startOf("day"), moment().endOf("day"))
    

    Object.entries(reservations).forEach(reservation => {
        const {from, to, handled, roomId} = reservation[1].metadata


        // Check if the room is available today
        if (todayInterval.overlaps(moment.range(moment(from), moment(to)))) {
            roomsBooked[roomId-1] = true
        }
        
        if (handled) {
            handledReservations[reservation[0]] = reservation[1]
        }
    })
    
    return {
        profile: {name, src},
        roomsBooked, rooms,
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