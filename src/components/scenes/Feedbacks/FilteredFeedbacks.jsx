import React, {Component} from "react"
import {EmptyTableBody} from "../../shared"
import {withStore} from "../../App/Store"
import {translateService} from "./Stats/mutations"
import Feedback from "./Feedback"


const filterByQuery = query => ({
  roomId, content, ratings
}) => {
  if (query[0].includes(":")) {
    const [name, value] = query[0].split(":")
    return ratings[translateService(name)] === parseInt((value), 10)
  } else {
    const results = [roomId.toString(), content.toLowerCase()]
    return query[0]==="" ||
      query.some(word => results.join(" ").includes(word))
  }

}


const filterByRoom = rooms => ({roomId}) =>
  rooms.length ? rooms[roomId-1] : true


class FilteredFeedbacks extends Component {


  renderFeedbacks = feedbacks => {
    const {
      query, filteredRooms
    } = this.props
    return (feedbacks
      .filter(filterByQuery(query))
      .filter(filterByRoom(filteredRooms))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(feedback => <Feedback key={feedback.id} {...feedback}/>)
    )
  }

  render() {
    let {
      handledFeedbacks, unhandledFeedbacks
    } = this.props
    handledFeedbacks = this.renderFeedbacks(handledFeedbacks)
    unhandledFeedbacks = this.renderFeedbacks(unhandledFeedbacks)
    return (
      handledFeedbacks.length + unhandledFeedbacks.length ?
        [unhandledFeedbacks, handledFeedbacks] :
        <EmptyTableBody/>

    )
  }
}
export default withStore(FilteredFeedbacks)