import React, {Component} from 'react'

import firebase from 'firebase'

import Card from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs'
import RaisedButton from 'material-ui/RaisedButton'
import Table, {TableBody, TableRow, TableRowColumn, TableHeaderColumn} from 'material-ui/Table'

import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import Done from 'material-ui/svg-icons/action/done'
import Edit from 'material-ui/svg-icons/image/edit'
import Close from 'material-ui/svg-icons/navigation/close'
import Dialog from "material-ui/Dialog"

import {colors} from '../../utils'

const {red, green} = colors

const priceTypeName = {
  allInclusive: "All inclusive",
  breakfast: "Reggelivel",
  fullBoard: "Teljes ellátás",
  halfBoard: "Félpanzió"
}

export default class Prices extends Component {
  state = {
    prices: {},
    value: 'allInclusive'
  }


  componentDidMount() {
    firebase.database()
    .ref(`rooms/${this.props.roomId-1}/prices`)
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
          {Object.keys(prices).map(priceType => (
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


  addNewPrice = () => {
    const {roomId, priceType} = this.props
    firebase.database().ref(`rooms/${roomId-1}/prices/${priceType}`).push().set({
      name: "",
      price: 0
    })
  }


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
              <TableHeaderColumn colSpan={2}>Név</TableHeaderColumn>
              <TableHeaderColumn>Ár</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "right"}} colSpan={3}>Módosítás</TableHeaderColumn>
            </TableRow>
            {Object.keys(prices).map(priceId => (
              priceId !== "preventDeleteKey" &&
              <Price
                key={priceId}
                price={prices[priceId].price}
                name={prices[priceId].name}
                {...{priceType, roomId, priceId}}
              />
            ))}
          </TableBody>
        </Table>
        <RaisedButton onClick={() => this.addNewPrice()} style={{margin: 12}} primary label="Új ár felvétele"/>
      </div>
    )
  }
}

class Price extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isDialogOpen: false,
      isEditing: false,
      name: props.name,
      price: props.price
    }
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

  componentWillReceiveProps({name, price}) {
    this.setState({name, price})
  }

  handleSave = () => {
    const {roomId, priceType, priceId} = this.props
    const {name, price} = this.state
    this.handleCloseEdit()
    firebase.database().ref(`rooms/${roomId-1}/prices/${priceType}/${priceId}`).set({
      name, price: parseInt(price, 10) || 0
    })
  }

  handleOpenDeleteDialog = () => this.setState({isDialogOpen: true})
  handleCloseDeleteDialog = () => this.setState({isDialogOpen: false})

  handleDelete = () => {
    const {roomId, priceType, priceId} = this.props
    this.handleCloseEdit()
    firebase.database().ref(`rooms/${roomId-1}/prices/${priceType}/${priceId}`).remove()
    this.handleCloseDeleteDialog()
  }



  handlePriceChange = ({target: {value: price}}) => this.setState({price})
  handleNameChange = ({target: {value: name}}) => this.setState({name})

  render() {
    const {isEditing, isDialogOpen, name, price} = this.state
    return (
    <TableRow>
      <TableRowColumn colSpan={2}>
        {isEditing ?
          <TextField
            fullWidth 
            value={name}
            onChange={this.handleNameChange}
            floatingLabelText="Személyek"
            />:
            <p>{name}</p>
        }
      </TableRowColumn>
      <TableRowColumn >
        {isEditing ?
          <TextField
            fullWidth 
            min={0}
            type="number"
            value={price}
            onChange={this.handlePriceChange}
            floatingLabelText="Forint"
            />:
            <p style={{fontWeight: "bold"}}>{price.toLocaleString("hu-HU", {style: "currency", currency: "HUF", minimumFractionDigits: 0} )} </p>
        }
      </TableRowColumn>
      <TableRowColumn colSpan={3} style={{textAlign: "right"}}>
          <Dialog
            title="Ár törlése"
            modal
            open={isDialogOpen}
            actions={[
              <RaisedButton style={{marginRight: 12}} onClick={() => this.handleCloseDeleteDialog()} label="Mégse"/>,
              <RaisedButton onClick={() => this.handleDelete()} secondary label="Igen"/>
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
        <IconButton iconStyle={{color: red}} onClick={() => this.handleOpenDeleteDialog()}>
          <Delete/>
        </IconButton>
      </TableRowColumn>
    </TableRow>  
  )
  }
}