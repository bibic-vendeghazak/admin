import React, {Component} from 'react'



import {Card, CardHeader} from 'material-ui/Card'
import {
  Table,
  TableBody,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import moment from 'moment'

export default class DayBig extends Component {

  constructor(props){
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleClick = () => this.props.closeBigDay()


  handleKeyUp = ({keyCode}) => {
    keyCode === 27 && this.handleClick()
  }

  componentDidMount(){
    window.addEventListener("keyup", this.handleKeyUp, false)
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp, false)
  }
  
  render() {
    const {date} = this.props
    let {reservations} = this.props
    reservations = Object.entries(reservations).sort((a,b) => a[1].metadata.roomId - b[1].metadata.roomId)
    
    return (
      <Card className="day-big">
        <CardHeader style={{margin: 16, textTransform: "capitalize"}} title={date.format('MMMM DD, dddd')}/>
        <Table style={{tableLayout: "auto"}}>
          <TableBody showRowHover displayRowCheckbox={false}>
          <TableRow>
            <TableHeaderColumn colSpan={1} style={{textAlign: "center"}}>Szoba</TableHeaderColumn>
            <TableHeaderColumn colSpan={4} style={{textAlign: "center"}}>Foglaló neve</TableHeaderColumn>
            <TableHeaderColumn colSpan={3} style={{textAlign: "center"}}>E-mail</TableHeaderColumn>
            <TableHeaderColumn colSpan={2} style={{textAlign: "center"}}>Telefon</TableHeaderColumn>
            <TableHeaderColumn colSpan={2} style={{textAlign: "center"}}>Érkezés</TableHeaderColumn>
            <TableHeaderColumn colSpan={2} style={{textAlign: "center"}}>Távozás</TableHeaderColumn>
          </TableRow>
            {reservations.map(([key, {
              metadata: {roomId, from, to},
              details: {name, email, tel}
            }]) => (
              <TableRow {...{key}}>
                <TableRowColumn colSpan={1} style={{textAlign: "center"}} className={`room-day-big room-${roomId}`}>{roomId}</TableRowColumn>
                <TableRowColumn colSpan={4} style={{textAlign: "center"}}>{name}</TableRowColumn>
                <TableRowColumn colSpan={3} style={{textAlign: "center"}}><a href={`mailto:${email}`}>{email}</a></TableRowColumn>
                <TableRowColumn colSpan={2} style={{textAlign: "center"}}><a href={`tel:${tel}`}>{tel}</a></TableRowColumn>
                <TableRowColumn colSpan={2} style={{textAlign: "center", textTransform: "capitalize"}}>{moment(from).format('MMMM D.')}</TableRowColumn>
                <TableRowColumn colSpan={2} style={{textAlign: "center", textTransform: "capitalize"}}>{moment(to).format('MMMM D.')}</TableRowColumn>

              </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    )
  }
}

