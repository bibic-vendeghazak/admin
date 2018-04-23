import React, {Component} from "react"
import {NavLink} from "react-router-dom"
import MyContext from "../Context"
import * as routes from "../../../utils/routes"
import moment from "moment"
import Badge from "material-ui/Badge"
import MenuItem from "material-ui/MenuItem"
import Divider from "material-ui/Divider"
import FontIcon from "material-ui/FontIcon"
import Drawer from "material-ui/Drawer"
import Avatar from "material-ui/Avatar"

import Logout from "../Auth/Logout"

const dividerStyle = {
	backgroundColor: "rgba(255,255,255,.5)"
}


export default class Sidebar extends Component {

	render() {
		const {profile, unHandledReservationCount,
			unreadFeedbackCount, handleLogout, isDrawerOpened, toggleSidebar} = this.props
			
		return (
			<aside onClick={() => window.innerWidth <= 768 && toggleSidebar()} id="sidebar">
				<Drawer  open={isDrawerOpened} containerStyle={{height: 'calc(100% - 64px)', top: 64}}>
				<Profile {...{profile}}/>
				<Divider style={dividerStyle}/>
					<MenuItem
						primaryText={
							<a
								style={{
									color: "white",
									textDecoration: "none",
									display: "flex"
								}} 
								href="https://bibic-vendeghazak-web.firebaseapp.com"
								target="_blank" rel="noopener noreferrer"
							>Irány a weblap</a>
						}
						leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">language</FontIcon>}
					/>
					<SidebarMenuItem
						to={routes.SETTINGS}
						primaryText="Beállítások"
						leftIcon="settings"
					/>
					<Divider style={dividerStyle}/>
					<SidebarMenuItem
						to={routes.ROOMS}
						primaryText="Szobák"
						leftIcon="business"
					/>
					<SidebarMenuItem
						to={routes.SPECIAL_OFFER}
						primaryText="Akciós ajánlatok"
						leftIcon="attach_money"
					/>	
					<SidebarMenuItem
						to={routes.RESERVATIONS+"/kezeletlen"}
						primaryText="Foglalások"
						leftIcon="bookmark_border"
						count={unHandledReservationCount}
					/>
					<SidebarMenuItem
						to={`${routes.CALENDAR}/${moment().format("YYYY")}/${moment().format("M")}`}
						primaryText="Naptár"
						leftIcon="date_range"
					/>	
					<SidebarMenuItem
						to={routes.FOODS}
						primaryText="Ételek"
						leftIcon="restaurant"
					/>	
					<SidebarMenuItem
						to={routes.EVENTS}
						primaryText="Rendezvények"
						leftIcon="event"
					/>	
					{/* <SidebarMenuItem
						to={routes.STATS}
						primaryText="Statisztikák"
						leftIcon="trending_up"
					/> */}
					<SidebarMenuItem
						to={routes.FEEDBACKS+"/olvasatlan"}
						primaryText="Visszajelzések"
						leftIcon="feedback"
						count={unreadFeedbackCount}
					/>
				<Logout {...{handleLogout}}/>
				</Drawer>
			</aside>
		)}
}


const Profile = ({profile}) => (
	<div className="profile">
		<h3>{profile ? profile.name : "Bíbic vendégházak"}</h3>
		<Avatar className="avatar"
			src={profile ?
				 `https://bibic-vendeghazak.github.io/web/assets/images/other/${profile.src}.jpg`:
				  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAOUlEQVR42u3OIQEAAAACIP1/2hkWWEBzVgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYF3YDicAEE8VTiYAAAAAElFTkSuQmCC"}
			size={64}
		/>
	</div>
)


const SidebarMenuItem = ({primaryText, leftIcon, count, to}) => (
	<Link 
		style={{textDecoration: "none"}}
		to={to}>
		<MenuItem
			style={{color: "white"}} 
			primaryText={primaryText}
			leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">{leftIcon}</FontIcon>}
			rightIcon={count ? <Badge primary badgeContent={count.toString()}/> : null}
			to={to}
		/>
	</Link>
)