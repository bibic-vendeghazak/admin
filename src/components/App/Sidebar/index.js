import React, {Component, Fragment} from "react"
import {NavLink} from "react-router-dom"
import Store from "../Store"
import * as routes from "../../../utils/routes"
import moment from "moment"
import Badge from "material-ui/Badge"
import MenuItem from "material-ui/MenuItem"
import Divider from "material-ui/Divider"
import FontIcon from "material-ui/FontIcon"
import Drawer from "material-ui/Drawer"
import Avatar from "material-ui/Avatar"

import Logout from "../Auth/Logout"
import Subheader from "material-ui/Subheader"

const dividerStyle = {
	backgroundColor: "rgba(255,255,255,.5)"
}


export default class Sidebar extends Component {

	render() {
		const {handleLogout, isDrawerOpened, toggleSidebar} = this.props
			
		return (
			<aside onClick={() => window.innerWidth <= 768 && toggleSidebar()} id="sidebar">
				<Drawer  open={isDrawerOpened} containerStyle={{height: "calc(100% - 64px)", top: 64, paddingBottom: "5em"}}>
					<Profile {...{handleLogout}}/>
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
							>Weblap megtekintése</a>
						}
						leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">language</FontIcon>}
					/>
					<Divider style={dividerStyle}/>
					<Subheader style={{color: "white"}}>Foglalás</Subheader>
					<Store.Consumer>
						{({unHandledReservationCount}) =>
							<SidebarMenuItem
								to={routes.RESERVATIONS}
								primaryText="Foglalások"
								leftIcon="bookmark_border"
								count={unHandledReservationCount}
							/>
						}
					</Store.Consumer>
					<SidebarMenuItem
						to={`${routes.CALENDAR}/${moment().format("YYYY/MM")}`}
						primaryText="Naptár"
						leftIcon="date_range"
					/>	
					{/* <SidebarMenuItem
						to={routes.SPECIAL_OFFER}
						primaryText="Kedvezmények"
						leftIcon="trending_down"
					/>	 */}



					<Divider style={dividerStyle}/>
					<Subheader style={{color: "white"}}>Szekciók</Subheader>
					<SidebarMenuItem
						to={routes.INTRO}
						primaryText="Bemutatkozás"
						leftIcon="person"
					/>
					<SidebarMenuItem
						to={routes.CERTIFICATES}
						primaryText="Tanúsítványok"
						leftIcon="verified_user"
					/>
					<SidebarMenuItem
						to={routes.ROOMS}
						primaryText="Szobák"
						leftIcon="business"
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
					<Divider style={dividerStyle}/>
					<Subheader style={{color: "white"}}>Közösségi média</Subheader>
					<MenuItem
						primaryText={
							<a
								style={{
									color: "white",
									textDecoration: "none",
									display: "flex"
								}} 
								href="https://www.messenger.com/t/200199203718517"
								target="_blank" rel="noopener noreferrer"
							>Messenger</a>
						}
						leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">message</FontIcon>}
					/>
					<MenuItem
						primaryText={
							<a
								style={{
									color: "white",
									textDecoration: "none",
									display: "flex"
								}} 
								href="https://www.facebook.com/B%C3%ADbic-Vendegh%C3%A1zak-%C3%89s-S%C3%B6r%C3%B6z%C5%91-200199203718517"
								target="_blank" rel="noopener noreferrer"
							>Facebook</a>
						}
						leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">group</FontIcon>}
					/>
					<MenuItem
						primaryText={
							<a
								style={{
									color: "white",
									textDecoration: "none",
									display: "flex"
								}} 
								href="https://www.instagram.com/explore/tags/bibicvendeghaz/"
								target="_blank" rel="noopener noreferrer"
							>Instagram</a>
						}
						leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">photo_camera</FontIcon>}
					/>
					<MenuItem
						primaryText={
							<a
								style={{
									color: "white",
									textDecoration: "none",
									display: "flex"
								}} 
								href="https://youtube.com/bibic-vendeghazak"
								target="_blank" rel="noopener noreferrer"
							>YouTube</a>
						}
						leftIcon={<FontIcon style={{color: "#fff"}} className="material-icons">video_library</FontIcon>}
					/>
					<Divider style={dividerStyle}/>
					<Subheader style={{color: "white"}}>Egyéb</Subheader>
					{/* <Store.Consumer>
						{({unreadFeedbackCount}) => <SidebarMenuItem
							to={routes.FEEDBACKS}
							primaryText="Visszajelzések"
							leftIcon="feedback"
							count={unreadFeedbackCount}
						/>}
					</Store.Consumer> */}
					{/* <SidebarMenuItem
						to={routes.STATS}
						primaryText="Statisztikák"
						leftIcon="timeline"
					/> */}

					<SidebarMenuItem
						to={routes.SETTINGS}
						primaryText="Beállítások"
						leftIcon="settings"
					/>
				</Drawer>
			</aside>
		)}
}
	
	
const Profile = ({handleLogout}) => (
	<Store.Consumer>
		{({profile: {name, src}}) => 
			<div className="profile">
				<Avatar className="avatar"
					title={name || "Bíbic vendégházak"}
					src={src ||
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAOUlEQVR42u3OIQEAAAACIP1/2hkWWEBzVgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYF3YDicAEE8VTiYAAAAAElFTkSuQmCC"}
					size={48}
				/>
				<Logout {...{handleLogout}}/>
			</div>
		}
	</Store.Consumer>
)


const SidebarMenuItem = ({primaryText, leftIcon, count, to}) => (
	<NavLink
		className="menu-item"
		activeClassName="menu-active"	
		style={{textDecoration: "none"}}
		to={to}>
		<FontIcon style={{color: "#fff"}} className="material-icons">{leftIcon}</FontIcon>
		{primaryText}
		{count ? <Badge className="menu-badge" primary badgeContent={count.toString()}/> : null}
	</NavLink>
)