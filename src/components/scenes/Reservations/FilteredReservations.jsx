import React, {Component} from "react"
import {withRouter} from "react-router-dom"
import QueryString from "query-string"
import {List} from "material-ui/List"

import Reservation from "./Reservation"

import {PlaceholderText} from "../../shared"
import moment from "moment"


class FilteredReservations extends Component {
  
  state =  {
  	elrejt: [],
  	keres: "",
  	tol: null,
  	ig: null
  }
	
	
  static getDerivedStateFromProps(props, state){
  	let {keres, elrejt, tol, ig} = QueryString.parse(props.location.search)
  	return {
  		...state,
  		keres: keres || "",
  		elrejt: elrejt || [],
  		tol: tol || moment().subtract(1, "months").toDate(),
  		ig: ig || moment().add(3, "months").toDate()
  	}
  }

  shouldFilterByRoom = (roomId, rooms) =>  
  	!rooms.includes(roomId.toString())
  

	// REVIEW: Firebase new Timestamp
  shouldFilterByDate = (reservationFrom, reservationTo, filterFrom, filterTo) => (
  	moment.range(moment(filterFrom), moment(filterTo))
  		.overlaps(
  			moment.range(
  				moment(reservationFrom.seconds*1000 || reservationFrom),
  				moment(reservationTo.seconds*1000 || reservationTo)
  			)
  		)
  )

  shouldFilterBySearch = (reservationId, name, message, query) => (
  	reservationId === query ||
  	message.toLowerCase().includes(query.toLowerCase()) || 
		name.toLowerCase().includes(query.toLowerCase())
  )

  
  
  render() {
  	const {keres, elrejt, tol, ig} = this.state
  	const {reservations} = this.props
  	const filtered = reservations ? reservations
  		.filter(({id, name, message, from, to, roomId}) => 
  			this.shouldFilterBySearch(id, name, message, keres) &&
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
