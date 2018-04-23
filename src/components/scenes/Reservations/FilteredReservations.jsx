import React, {Component} from "react"
import {withRouter} from "react-router-dom"
import QueryString from "query-string"
import {List} from "material-ui/List"

import Reservation from "./Reservation"

import {PlaceholderText} from "../../shared"
import moment from "moment"


class FilteredReservations extends Component {
  
  state = {
  	elrejt: [],
  	keres: "",
  	tol: moment().subtract(1, "months").toDate(),
  	ig: moment().add(3, "months").toDate()
  }

  componentDidMount() {this.updateFromURL(this.props.location.search)}

  componentWillReceiveProps({location: {search}}) {this.updateFromURL(search)}
  
  updateFromURL = search => {
  	const query = QueryString.parse(search)
  	Object.keys(query).forEach(key => {
  		this.setState({[key]: query[key]})
  	})
  	if (!query.elrejt) {
  		this.setState({elrejt: []})
  	}
  }

  shouldFilterByRoom = (roomId, rooms) =>  
  	!rooms.includes(roomId.toString())
  

  shouldFilterByDate = (reservationFrom, reservationTo, filterFrom, filterTo) => (
  	moment.range(moment(filterFrom), moment(filterTo))
  		.overlaps(moment.range(moment(reservationFrom), moment(reservationTo)))
  )

  shouldFilterBySearch = (name, message, query) => (
  	message.toLowerCase().includes(query.toLowerCase()) || 
    name.toLowerCase().includes(query.toLowerCase())
  )

  
  
  render() {
  	const {keres, elrejt, tol, ig} = this.state
  	const {reservations} = this.props
  	const filtered = reservations ? reservations
  		.filter(({name, message, from, to, roomId}) => 
  			this.shouldFilterBySearch(name, message, keres) &&
      this.shouldFilterByDate(from, to, tol, ig) &&
      this.shouldFilterByRoom(roomId, elrejt)
  		).map(reservation => 
  			<Reservation 
  				key={reservation.id}
  				{...{reservation}}
  			/>
  		).reverse() : []
      
  	return (
  		<div>
  			{filtered.length !== 0 ?
  				<List style={{padding: 0, margin: "0 0 calc(10vmin + 56px)"}}>{filtered}</List> :
  				<PlaceholderText>Nincs egyezés</PlaceholderText>
  			}
  		</div>
  	)
  }
}

export default withRouter(FilteredReservations)
