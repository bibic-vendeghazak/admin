import React, {Component} from 'react'
import Logout from './Auth/Logout'
import Badge from 'material-ui/Badge'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import FontIcon from 'material-ui/FontIcon'
import Drawer from 'material-ui/Drawer'
import Avatar from 'material-ui/Avatar'

const menuItemStyle = {
	color: "white"
}

const dividerStyle = {
	backgroundColor: "rgba(255,255,255,.5)"
}

export default class Sidebar extends Component {
	constructor() {
		super()
		this.state = {
			isSidebarHidden: false
		}
	}
	toggleSidebar() {
		this.setState(prevState => (
			{isSidebarHidden: !prevState.isSidebarHidden}
		))
	}

	changeOpenedMenuItem(openedMenuItem) {
		this.props.changeOpenedMenuItem(openedMenuItem)
	}

	render() {
		const {profile, unreadReservationCount,
			unreadFeedbackCount, reset} = this.props
		let {isSidebarHidden} = this.state
		return (
			<div id="menu" >
				{profile &&
					<aside id="sidebar" className={isSidebarHidden ? "sidebar-hidden" : ""} onClick={() => this.toggleSidebar()}>
						<Drawer  containerStyle={{height: 'calc(100% - 64px)', top: 64}}>
						<Profile {...{profile}}/>
						<Divider style={dividerStyle}/>
							<MenuItem
								style={menuItemStyle}
								onClick={() => this.changeOpenedMenuItem("welcome")}
								primaryText="Kezdőlap"
								leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">home</FontIcon>}
							/>
							<MenuItem
							style={menuItemStyle} 
							href="https://bibic-vendeghazak.github.io/bibic-vendeghazak-web/"
							target="_blank"
							rel="noopener noreferrer"
							primaryText="Irány a weblap"
							leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">language</FontIcon>}
						/>
							<Divider style={dividerStyle}/>
							<MenuItem
								style={menuItemStyle}
								onClick={() => this.changeOpenedMenuItem("rooms")}
								primaryText="Szobák"
								leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">business</FontIcon>}
								/>
							<MenuItem
								style={menuItemStyle} 
								onClick={() => this.changeOpenedMenuItem("reservations")}
								primaryText="Foglalások"
								leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">bookmark_border</FontIcon>}
								rightIcon={<Badge primary badgeContent={unreadReservationCount}/>}
								/>
							<MenuItem
								style={menuItemStyle} 
								onClick={() => this.changeOpenedMenuItem("calendar")}
								primaryText="Dátumok"
								leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">event</FontIcon>}
								/>
							<MenuItem
								style={menuItemStyle} 
								onClick={() => this.changeOpenedMenuItem("stats")}
								primaryText="Statisztikák"
								leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">trending_up</FontIcon>}
								/>
							<MenuItem
								style={menuItemStyle} 
								onClick={() => this.changeOpenedMenuItem("feedbacks")}
								primaryText="Visszajelzések"
								leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">feedback</FontIcon>}
								rightIcon={<Badge primary badgeContent={unreadFeedbackCount}/>}
								/>
						<Divider style={dividerStyle}/>
						<MenuItem
							style={menuItemStyle} 
							onClick={() => this.changeOpenedMenuItem("settings")}
							primaryText="Beállítások"
							leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">settings</FontIcon>}
						/>
						
						<Logout reset={reset}/>
						</Drawer>
					</aside>}
			</div>
		)}
}


const Profile = ({profile}) => (
	<div className="profile">
	<div>
		<h3>{profile.name}</h3>
		<h4>{profile.role}admin</h4>
	</div>
		<Avatar className="avatar"
			src={`https://bibic-vendeghazak.github.io/bibic-vendeghazak-web/assets/images/other/${profile.src}.jpg`}
			size={64}
		/>
	</div>
)