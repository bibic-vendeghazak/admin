import moment from "moment"
import {getMuiTheme} from "material-ui/styles"
import {createMuiTheme} from '@material-ui/core/styles'

export const colors = {
  orange: "#b35d41",
  lightOrange: "#cc8c78",
  lightBrown: "#482c29",
  darkBrown: "#1f1511",
  red: "#C62828",
  yellow: "#f9c554",
  green: "#388E3C"
}

export const mui2Theme = createMuiTheme({palette: {
  primary: {main: "#482c29"},
  secondary: {main: "#b35d41"}
}})

const {
  darkBrown, lightBrown, orange, lightOrange
} = colors

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: darkBrown,
    primary2Color: lightBrown,
    accent1Color: orange
  },
  badge: {primaryColor: orange},
  datePicker: {
    headerColor: orange,
    selectColor: lightBrown
  },
  timePicker: {
    headerColor: orange,
    selectColor: lightBrown
  },
  drawer: {color: lightBrown},
  toggle: {
    thumbOffColor: "#eee",
    thumbOnColor: orange,
    trackOffColor: "#ddd",
    trackOnColor: lightOrange
  }
})


export const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const validateName = name => name.length < 140
export const validateTel = tel => typeof tel === Number

export const parseValue = (value, type) => {
  switch (type) {
  case "number":
    return parseInt(value, 10)
  default:
    return value
  }
}


const nameRe = new RegExp(/[\s.áéíóöőúüűÁÉÍÓÖŐÚÜŰa-zA-Z-]/)
const emailRe = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
const telRe = new RegExp(/[0-9-+\s]/)


export const valid = {
  roomId: (roomId=0, roomsLength) => (0 < roomId) && (roomId <= roomsLength),
  name: name => nameRe.test(name),
  email: email => emailRe.test(email),
  tel: tel => telRe.test(tel),
  address: address => typeof address === "string" && address.length > 0,
  message: message => typeof message === "string",
  period: (from, to) => moment(to).startOf("day").diff(moment(from).startOf("day"), "days") >= 1,
  adults: adults => typeof adults === "number" || adults >= 1,
  children: children => Array.isArray(children)
}


export const isValidReservation = ({
  roomId, name, email, tel, address, from, to, message, adults, children
}) =>
  //NOTE: roomsLength is hardcoded!!!!
  valid.roomId(roomId, 6) &&
	valid.name(name) &&
	valid.email(email) &&
	valid.tel(tel) &&
	valid.address(address) &&
	valid.period(from, to) &&
	valid.message(message) &&
	valid.adults(adults) &&
	valid.children(children)