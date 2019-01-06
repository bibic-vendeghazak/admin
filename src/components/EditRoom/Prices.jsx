import React, {Component} from "react"


import {
  Card,
  TextField,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  AppBar,
  Typography
} from "@material-ui/core"

import Delete from "@material-ui/icons/DeleteRounded"
import Done from "@material-ui/icons/DoneRounded"
import Edit from "@material-ui/icons/EditRounded"
import Close from "@material-ui/icons/CloseRounded"
import Breakfast from "@material-ui/icons/FreeBreakfastRounded"

import Store from "../../db/Store"
import {ROOMS_DB} from "../../lib/firebase"


export default class Prices extends Component {
  state = {
    prices: {},
    value: 0
  }


  componentDidMount() {
    ROOMS_DB.child(`${this.props.roomId}/prices/table`)
      .on("value", snap => this.setState({prices: snap.val()}))
  }


  handleChange = (_e, value) => this.setState({value})

  render() {
    const {roomId} = this.props
    const {
      prices, value
    } = this.state

    return (
      <Card>
        <AppBar
          color="default"
          position="static"
        >
          <Tabs
            fullWidth
            indicatorColor="secondary"
            onChange={this.handleChange}
            textColor="secondary"
            value={value}
          >
            <Tab
              icon={<Breakfast width={12}/>}
              label="Reggeli"
            />
            <Tab
              icon={<Breakfast width={12}/>}
              label="Félpanzió"
            />
          </Tabs>
        </AppBar>
        {prices && Object.keys(prices).map((priceType, index) =>
          (value===index &&
            <PriceType
              key={index}
              prices={prices[priceType]}
              {...{
                priceType,
                roomId
              }}
            />)
        )
        }
      </Card>
    )
  }
}


class PriceType extends Component{

  render() {
    const {
      prices, priceType, roomId
    } = this.props

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Név</TableCell>
            <TableCell>Ár</TableCell>
            <TableCell align="center">Módosítás</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Store.Consumer>
            {({
              sendNotification, openDialog
            }) =>
              Object.keys(prices).map(adultCount =>
                Object.keys(prices[adultCount]).map(childCount => {
                  const {
                    price, name
                  } = prices[adultCount][childCount]
                  return (
                    <Price
                      key={`${adultCount }_${ childCount}`}
                      {...{
                        sendNotification,
                        openDialog,
                        priceType,
                        roomId,
                        price,
                        name,
                        adultCount,
                        childCount
                      }}
                    />
                  )
                })
              )}
          </Store.Consumer>
        </TableBody>
      </Table>
    )
  }
}

class Price extends Component {

  state = {
    isEditing: false,
    name: "",
    price: null
  }

  componentDidMount() {
    const {
      price, name
    } = this.props
    this.setState({
      price,
      name
    })
    document.addEventListener("keyup", this.toggleWithKeyBoard, false)
  }


  UNSAFE_componentWillReceiveProps({
    name, price
  }) {
    this.setState({
      name,
      price
    })
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.toggleWithKeyBoard, false)
  }

  toggleWithKeyBoard = ({keyCode}) => {
    const {
      isEditing, isDialogOpen
    } = this.state
    if (isEditing) {
      switch (keyCode) {
      case 13: // Enter
        isDialogOpen ?
          this.handleDelete() :
          this.handleSave()
        break
      case 27: // Esc
        this.handleCloseEdit()
        break
      case 68: // d
        this.handleDelete()
        break
      default:
        break
      }
    }
  }


  handleCloseEdit = () => this.setState({isEditing: false})

  handleOpenEdit = () => this.setState({isEditing: true})


  handleSave = async () => {
    const {
      roomId, priceType, adultCount, childCount
    } = this.props

    try {
      await ROOMS_DB.child(`${roomId}/prices/table/${priceType}/${adultCount}/${childCount}/price`)
        .set(parseInt(this.state.price, 10) || 0)

      this.props.sendNotification({
        code: "success",
        message: "Ár frissítve."
      })
      this.handleCloseEdit()
    } catch (error) {
      this.props.sendNotification(error)
    }
  }

  handleDelete = () => {
    const {
      roomId, priceType, adultCount, childCount
    } = this.props

    this.props.openDialog({
      title: "Ár törlése",
      content: "Biztosan törli ezt az árat az adatbázisból?",
      submitLabel: "Törlés"
    },
    () => ROOMS_DB
      .child(`${roomId}/prices/table/${priceType}/${adultCount}/${childCount}`)
      .remove(),
    "Az ár törölve lett.", this.handleCloseEdit
    )
  }


  handlePriceChange = ({target: {value: price}}) => {
    this.setState({price: parseInt(price, 10) || 0})
  }

  render() {
    const {
      isEditing, name, price
    } = this.state
    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Typography >{name}</Typography>
        </TableCell>
        <TableCell padding="none">
          {isEditing ?
            <TextField
              autoFocus
              onChange={this.handlePriceChange}
              type="number"
              value={price || ""}
            /> :
            <p
              onClick={this.handleOpenEdit}
              style={{
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {(price || 0).toLocaleString("hu-HU", {
                style: "currency",
                currency: "HUF",
                minimumFractionDigits: 0
              } )}
            </p>
          }
        </TableCell>
        <TableCell
          align="center"
          padding="none"
        >
          {isEditing ?
            <IconButton onClick={this.handleCloseEdit}><Close/></IconButton> :
            <IconButton
              color="secondary"
              onClick={this.handleDelete}
            >
              <Delete/>
            </IconButton>
          }
          <IconButton
            color={isEditing ? "primary" : "default"}
            onClick={() => isEditing ? this.handleSave() : this.handleOpenEdit()}
          >
            {isEditing ? <Done/> : <Edit/>}
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }
}