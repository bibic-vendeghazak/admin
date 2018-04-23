export const colors = {
	orange: "#b35d41",
	lightOrange: "#cc8c78",
	lightBrown: "#482c29",
	darkBrown: "#1f1511",
	red: "#C62828",
	yellow: "#f9c554",
	green: "#388E3C"
}


const {darkBrown, lightBrown, orange, lightOrange} = colors
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
	timePicker: {
		headerColor: orange,
		selectColor: lightBrown
	},
	drawer: {
		color: lightBrown
	},
	toggle: {
		thumbOffColor: "#eee",
		thumbOnColor: orange,
		trackOffColor: "#ddd",
		trackOnColor: lightOrange
	}
}
  
  
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



// NOTE: Fix reservation validation
export const  isValidReservation = reservation => false