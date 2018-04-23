import React, {Fragment} from "react"
import {Route} from "react-router-dom"
import MyContext from "../../App/Context"

import Room from "./Room"
import BigRoom from "./BigRoom"
import { ROOMS, EDIT } from "../../../utils/routes"



const Rooms = () => (
	<MyContext.Consumer>
		{({rooms}) =>
			<Fragment>
				<Route
					path={ROOMS+"/:roomId"+EDIT}
					component={BigRoom}
				/>
				<Route exact path={ROOMS} render={() => (
					<ul className="rooms">
						{rooms.map(({id, available, name}, index) => (
							<Room
								key={id}
								roomId={id}
								isBooked={true} 
								{...{available, name}}
							/>
						)
						)}
					</ul>)}
				/>
			</Fragment>}
	</MyContext.Consumer>
)

export default Rooms