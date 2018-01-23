import React, {Component} from 'react'
import {Card, CardHeader} from 'material-ui/Card'
import {
  Table,
  TableBody,
  TableHeader,
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
    const {date: {month, day}} = this.props
    let {reservations} = this.props
    reservations = Object.entries(reservations).sort((a,b) => a[1].metadata.roomId - b[1].metadata.roomId)
    
    return (
      <Card className="day-big">
        <CardHeader style={{margin: 16, textTransform: "capitalize"}} title={`${month} ${day}.`}/>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Szoba</TableHeaderColumn>
              <TableHeaderColumn>Foglaló neve</TableHeaderColumn>
              <TableHeaderColumn>E-mail</TableHeaderColumn>
              <TableHeaderColumn>Telefon</TableHeaderColumn>
              <TableHeaderColumn>Érkezés</TableHeaderColumn>
              <TableHeaderColumn>Távozás</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody showRowHover displayRowCheckbox={false}>
            {reservations.map(([key, {
              metadata: {roomId, from, to},
              details: {name, email, tel}
            }]) => (
              <TableRow {...{key}}>
                <TableRowColumn className={`room-day-big room-${roomId}`}>Szoba {roomId}</TableRowColumn>
                <TableRowColumn>{name}</TableRowColumn>
                <TableRowColumn><a href={`mailto:${email}`}>{email}</a></TableRowColumn>
                <TableRowColumn><a href={`tel:${tel}`}>{tel}</a></TableRowColumn>
                <TableRowColumn>{moment(from).format('MMM. DD')}</TableRowColumn>
                <TableRowColumn>{moment(to).format('MMM. DD')}</TableRowColumn>
              </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    )
  }
}

