import React, {Fragment} from "react"
import {Route} from "react-router-dom"
import Store from "../../App/Store"

import Room from "./Room"
import BigRoom from "./BigRoom"
import { ROOMS, EDIT } from "../../../utils/routes"



const Rooms = () => 
	<Store.Consumer>
		{({rooms}) =>
			<Fragment>
				<Route
					path={ROOMS+"/:roomId/"+EDIT}
					component={BigRoom}
				/>
				<Route exact path={ROOMS} render={() => 
					<ul className="rooms">
						{rooms.map(({available, name, isBooked, pictures}, index) => 
							<Room {...{available, name, isBooked, pictures}} key={index} roomId={index}/>
						)}
					</ul>}
				/>
			</Fragment>}
	</Store.Consumer>


export default Rooms