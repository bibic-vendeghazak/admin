import {routes} from "../../utils"

/**
 * Search
 * @param {*} name
 * @param {*} value
 */
export function search(name, value) {
  this.setState(prevState => ({
    [name]: {
      ...prevState[name],
      query: value.toLowerCase().split(" ")
    }
  }))
}

export function changeRoom(type, filteredRooms) {
  this.setState(prevState => ({
    [type]: {
      ...prevState[type],
      filteredRooms
    }
  }))
}


export function getQueryType(path) {
  return path.includes(routes.RESERVATIONS) ?
    "reservationsFilters" :
    path.includes(routes.FEEDBACKS) ?
      "feedbacksFilters" :
      path.includes(routes.MESSAGES) ?
        "messagesFilters" : ""
}