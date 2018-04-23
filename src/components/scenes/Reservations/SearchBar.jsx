import React, { Component } from "react"
import {withRouter} from "react-router-dom"
import QueryString from "query-string"

import {Chip, DatePicker} from "material-ui"
import SearchIcon from "material-ui/svg-icons/action/search"
import FilterIcon from "material-ui/svg-icons/content/filter-list"

import { RESERVATIONS } from "../../../utils/routes"
import moment from "moment"
moment.locale("hu-HU")
class SearchBar extends Component {
  
  state = {
  	keres: "",
  	elrejt: [],
  	showFilters: true,
  	tol: moment().subtract(1, "months").toDate(),
  	ig: moment().add(3, "months").toDate()
  }

  toggleFilters = () => {
  	this.setState(({showFilters}) => ({showFilters: !showFilters}))
  }


  componentDidMount() {
  	this.updateFromURL(this.props.location.search)
  	window.addEventListener("keyup", this.handleKeyUp, false)
  }
  
  componentWillUnmount() {
  	window.removeEventListener("keyup", this.handleKeyUp, false)
  }

  componentWillReceiveProps = ({location: {search}}) => {
  	this.updateFromURL(search)
  }

  updateFromURL = search => {
  	const {keres, tol, ig, elrejt} = QueryString.parse(search) 
  	keres && this.setState({keres})
  	tol && this.setState({tol: moment(tol).toDate()})
  	ig && this.setState({ig: moment(ig).toDate()})
  	elrejt ? this.setState({elrejt}) : this.setState({elrejt: []})
  }

  handleSearchBar = ({target: {name, value}}) => this.setState({[name]: value})

  
  handleSearchClick = () => {
  	let query = QueryString.parse(this.props.location.search)
  	query.keres = this.state.keres
  	query = QueryString.stringify(query)
  	this.props.history.push(`${RESERVATIONS}?${query}`)
  }

  handleKeyUp = ({keyCode}) => {
  	switch(keyCode) {
  	case 13:
  		this.handleSearchClick()
  		break
  	case 49:
  	case 50:
  	case 51:
  	case 52:
  	case 53:
  	case 54:
  		this.handleRoomToggle((keyCode-48).toString())
  		break
  	default:
  		break
  	}
  }


  handleRoomToggle = id => {
  	let query = QueryString.parse(this.props.location.search)
  	let {elrejt} = query
    
  	if (elrejt) {
  		if (typeof elrejt === "string") {
  			query.elrejt = [query.elrejt]
  		}
  		if (elrejt.includes(id)) {
  			query.elrejt = query.elrejt.filter(item => item !== id)
  		} else {
  			query.elrejt.push(id)
  		}
  	} else {
  		query.elrejt = id
  	}
  	query = QueryString.stringify(query)

  	this.props.history.push(`${RESERVATIONS}?${query}`)
  }

  handleDateChange = (name, value) => {
  	this.setState({[name]: value})
  	let query = QueryString.parse(this.props.location.search)
  	query[name] = moment(value).format("YYYY-MM-DD")
  	query = QueryString.stringify(query)
  	this.props.history.push(`${RESERVATIONS}?${query}`)
  }

  render() {
  	const {showFilters, keres, elrejt, tol, ig} = this.state
  	const {rooms} = this.props
  	return(
  		<div id="reservations-search" className="search-bar">
  			<div className="omnibar">
  				<input
  					placeholder="Keresés a foglalások között"
  					onInput={this.handleSearchBar}
  					name="keres"
  					value={keres}
  				/>
  				<SearchIcon
  					style={{cursor: "pointer"}}
  					onClick={this.handleSearchClick} 
  					color="#fff"
  				/>
  				<FilterIcon
  					title="Szűrők mutatása"
  					style={{marginLeft: "2em", cursor: "pointer"}}
  					onClick={this.toggleFilters} 
  					color="#fff"
  				/>
  			</div>
  			<div className={`filters ${!showFilters ? "filters-hidden" : ""}`}>
  				<div className="filter">
  					<h4>Szűrés szobák szerint</h4>
  					<ul>
  						{rooms.map((room, key) => {
  							const title = `Szoba ${key+1}`
  							key = (key+1).toString()
  							const handleRoomToggle = () => this.handleRoomToggle(key)
  							return <li {...{key}} className="room-filter">
  								{elrejt.includes(key) ?
  									<a onClick={handleRoomToggle}>{title}</a> :
  									<Chip onRequestDelete={handleRoomToggle}>{title}</Chip>}
  							</li>
  						})
  						}
  					</ul>
  				</div>
  				<div className="filter">
  					<h4>Szűrés dátum szerint</h4>
  					<DatePicker autoOk
  						cancelLabel="Mégse"
  						DateTimeFormat={Intl.DateTimeFormat}
  						locale="hu-HU"
  						value={tol}
  						onChange={(e, date) => this.handleDateChange("tol", date)}
  						textFieldStyle={{maxWidth: 110}}
  						inputStyle={{color: "white"}}
  						name="tol"
  						className="date-picker"
  					/>
  					<DatePicker autoOk
  						cancelLabel="Mégse"
  						DateTimeFormat={Intl.DateTimeFormat}
  						locale="hu-HU"
  						value={ig}
  						onChange={(e, date) => this.handleDateChange("ig", date)}
  						textFieldStyle={{maxWidth: 110}}
  						inputStyle={{color: "white"}}
  						name="ig"
  						className="date-picker"
  					/>
  				</div>
  			</div>
  		</div>
  	)

  }
}

export default withRouter(SearchBar)