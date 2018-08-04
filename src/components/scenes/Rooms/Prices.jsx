import React, {Component} from "react"

import firebase from "firebase"

import Card from "material-ui/Card"
import TextField from "material-ui/TextField"
import {Tabs, Tab} from "material-ui/Tabs"
import RaisedButton from "material-ui/RaisedButton"
import Table, {TableBody, TableRow, TableRowColumn, TableHeaderColumn} from "material-ui/Table"

import IconButton from "material-ui/IconButton"
import Delete from "material-ui/svg-icons/action/delete"
import Done from "material-ui/svg-icons/action/done"
import Edit from "material-ui/svg-icons/image/edit"
import Close from "material-ui/svg-icons/navigation/close"
import Dialog from "material-ui/Dialog"

import {colors} from "../../../utils"
const {red, green} = colors

const priceTypeName = {
	breakfast: "Reggeli",
	halfBoard: "Félpanzió"
}

export default class Prices extends Component {
  state = {
  	prices: {},
  	value: "breakfast"
  }


  componentDidMount() {
  	firebase.database()
  		.ref(`rooms/${this.props.roomId-1}/prices/table`)
  		.on("value", snap => this.setState({prices: snap.val()}))
  }


  handleChange = value => this.setState({value})
  
  render() {
  	const {roomId} = this.props
  	const {prices} = this.state
    
  	return (
  		<Card className="room-edit-block">
  			<Tabs
  				inkBarStyle={{marginTop: -4, height: 4}}
  				value={this.state.value}
  				onChange={this.handleChange}
  			>
  				{prices && Object.keys(prices).map(priceType => (
  					<Tab 
  						key={priceType}
  						label={priceTypeName[priceType]}
  						value={priceType}
  					>
  						<PriceType prices={prices[priceType]} {...{priceType, roomId}}/>
  					</Tab>
  				))}

  			</Tabs>
  		</Card>
  	)
  }
}



class PriceType extends Component{ 

	render() {
		const {prices, priceType, roomId} = this.props
    
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column"
				}}
			>
				<Table>
					<TableBody displayRowCheckbox={false}>
						<TableRow>
							<TableHeaderColumn colSpan={4}>Név</TableHeaderColumn>
							<TableHeaderColumn colSpan={3}>Ár</TableHeaderColumn>
							<TableHeaderColumn style={{textAlign: "right"}} colSpan={2}>Módosítás</TableHeaderColumn>
						</TableRow>
						{Object.keys(prices).map(adultCount => (
							Object.keys(prices[adultCount]).map(childCount => {
								const {price, name} = prices[adultCount][childCount]
								return <Price
									key={adultCount + "_" + childCount}
									{...{priceType, roomId, price, name, adultCount, childCount}}
								/>
							})
						)
						)}
					</TableBody>
				</Table>
			</div>
		)
	}
}

class Price extends Component {

  state = {
  	isDialogOpen: false,
  	isEditing: false,
  	name: "",
  	price: null
  }

  componentDidMount() {
  	const {price, name} = this.props
  	this.setState({price, name})
  	document.addEventListener("keyup", this.toggleWithKeyBoard, false)
  }
  
  toggleWithKeyBoard = e => {
  	const key = e.keyCode
  	const {isEditing, isDialogOpen} = this.state
  	if (isEditing) {
  		switch (key) {
  		case 13: // Enter
  			isDialogOpen ?
  				this.handleDelete() :
  				this.handleSave()
  			break
  		case 27: // Esc
  			isDialogOpen ?
  				this.handleCloseDeleteDialog() :
  				this.handleCloseEdit()
  			break
  		case 68: // d
  			this.handleOpenDeleteDialog()
  			break
  		default:
  			break
  		}
  	}
  }

  componentWillUnmount() {
  	document.removeEventListener("keyup", this.toggleWithKeyBoard, false)
  }

  handleCloseEdit = () => {
  	this.setState({
  		isEditing: false
  	})
  }

  handleOpenEdit = () => {
  	this.setState({
  		isEditing: true
  	})
  }



  UNSAFE_componentWillReceiveProps({name, price}) {
  	this.setState({name, price})
  }

  handleSave = () => {
  	const {roomId, priceType, adultCount, childCount} = this.props
  	this.handleCloseEdit()
  	firebase.database()
  		.ref(`rooms/${roomId-1}/prices/table/${priceType}/${adultCount}/${childCount}/price`)
  		.set(parseInt(this.state.price, 10) || 0)
  		.catch(e => console.error(e)
  		)
  }

handleOpenDeleteDialog = () => this.setState({isDialogOpen: true})
handleCloseDeleteDialog = () => this.setState({isDialogOpen: false})

handleDelete = () => {
	const {roomId, priceType, adultCount, childCount} = this.props
	firebase.database()
		.ref(`rooms/${roomId-1}/prices/table/${priceType}/${adultCount}/${childCount}`).remove()
	this.handleCloseDeleteDialog()
	this.handleCloseEdit()
}



  handlePriceChange = ({target: {value: price}}) => {
  	this.setState({price: parseInt(price, 10) || 0})
  }

  render() {
  	const {isEditing, isDialogOpen, name, price} = this.state
  	return (
  		<TableRow>
  			<TableRowColumn colSpan={4}>
  				<p>{name}</p>
  			</TableRowColumn>
  			<TableRowColumn
  				colSpan={3}>
  				{isEditing ?
  					<TextField
  						autoFocus
  						fullWidth 
  						type="number"
  						value={price || ""}
  						onChange={this.handlePriceChange}
  						floatingLabelText="Forint"
  					/>:
  					<p

  						onClick={this.handleOpenEdit}
  						style={{fontWeight: "bold", cursor: "pointer"}}
  					>
  						{(price || 0).toLocaleString("hu-HU", {style: "currency", currency: "HUF", minimumFractionDigits: 0} )} 
  					</p>
  				}
  			</TableRowColumn>
  			<TableRowColumn colSpan={2} style={{textAlign: "right"}}>
  				<Dialog
  					title="Ár törlése"
  					modal
  					open={isDialogOpen}
  					actions={[
  						<RaisedButton style={{marginRight: 12}} onClick={this.handleCloseDeleteDialog} label="Mégse"/>,
  						<RaisedButton onClick={this.handleDelete} secondary label="Igen"/>
  					]}
  				>
            Biztos törölni szeretné ezt az árat az adatbázisból?
  				</Dialog>
  				{isEditing && 
          <IconButton onClick={this.handleCloseEdit}>
          	<Close/>
          </IconButton>
  				}
  				<IconButton iconStyle={{color: isEditing && green}} onClick={() => isEditing ? this.handleSave() : this.handleOpenEdit()}>
  					{isEditing ? <Done/> : <Edit/>}
  				</IconButton>
  				<IconButton iconStyle={{color: red}} onClick={this.handleOpenDeleteDialog}>
  					<Delete/>
  				</IconButton>
  			</TableRowColumn>
  		</TableRow>  
  	)
  }
}