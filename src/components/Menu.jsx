import React, {Component} from 'react'
import Logout from './Auth/Logout'

export default class Menu extends Component {
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
			<div id="menu">
				<div className="hamburger" onClick={() => this.toggleSidebar()}>
					<span></span>
				</div>
				{profile &&
					<aside id="sidebar" className={isSidebarHidden ? "sidebar-hidden" : ""} onClick={() => this.toggleSidebar()}>
						<div id="profile" 
						className="menu-item">
							<h3>{profile.name}</h3>
							<img src={`https://balazsorban44.github.io/bibic-vendeghazak/assets/images/other/${profile.src}.jpg`} alt={`${profile.name} profilkép`}/>
						</div>
						<div 
						onClick={() => this.changeOpenedMenuItem("rooms")}
						className="menu-item">
							<h3>Szobák</h3>
						</div>
						<div 
						onClick={() => this.changeOpenedMenuItem("reservations")}
						className="menu-item">
							<h3>Foglalások</h3>
							{unreadReservationCount !== 0 && <span className="notification-counter">{unreadReservationCount}</span>}
						</div>
						<div 
						onClick={() => this.changeOpenedMenuItem("calendar")}
						className="menu-item">
							<h3>Dátumok</h3>
						</div>
						<div 
						onClick={() => this.changeOpenedMenuItem("stats")}
						className="menu-item">
							<h3>Statisztikák</h3>
						</div>
						<div 
						onClick={() => this.changeOpenedMenuItem("feedbacks")}
						className="menu-item">
							<h3>Visszajelzések</h3>
							{unreadFeedbackCount !== 0 && <span className="notification-counter">{unreadFeedbackCount}</span>}
						</div>
						<div 
						onClick={() => this.changeOpenedMenuItem("settings")}
						className="menu-item">
							<h3>Beállítások</h3>
						</div>
						<Logout reset={reset}/>
					</aside>}
			</div>
		)}
}