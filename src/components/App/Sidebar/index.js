import React, {Component, Fragment} from "react"
import moment from "moment"
import {NavLink} from "react-router-dom"
import Store from "../Store"
import * as routes from "../../../utils/routes"
import Logout from "../Auth/Logout"

import {
  Avatar,
  Drawer,
  Divider,
  FontIcon,
  MenuItem,
  Badge,
  Subheader
} from "material-ui"


const dividerStyle = {backgroundColor: "rgba(255,255,255,.5)"}


export default class Sidebar extends Component {

  render() {
    const {
      handleLogout, isDrawerOpened, toggleSidebar
    } = this.props

    return (
      <aside
        id="sidebar"
        onClick={() => window.innerWidth <= 768 && toggleSidebar()}
      >
        <Drawer
          containerStyle={{
            height: "calc(100% - 64px)",
            top: 64,
            paddingBottom: "5em"
          }}
          open={isDrawerOpened}
        >
          <Profile {...{handleLogout}}/>
          <Divider style={dividerStyle}/>
          <MenuItem
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{color: "#fff"}}
              >language
              </FontIcon>
            }
            primaryText={
              <a
                href="https://bibic-vendeghazak-web.firebaseapp.com"
                rel="noopener noreferrer"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex"
                }}
                target="_blank"
              >Weblap megtekintése</a>
            }
          />
          <Divider style={dividerStyle}/>
          <Subheader style={{color: "white"}}>Foglalás</Subheader>
          <Store.Consumer>
            {({
              unHandledReservationCount, unreadFeedbackCount
            }) =>
              <Fragment>
                <SidebarMenuItem
                  count={unHandledReservationCount}
                  leftIcon="bookmark_border"
                  primaryText="Foglalások"
                  to={routes.RESERVATIONS}
                />
                <SidebarMenuItem
                  leftIcon="date_range"
                  primaryText="Naptár"
                  to={`${routes.CALENDAR}/${moment().format("YYYY/MM")}`}
                />
                <SidebarMenuItem
                  count={unreadFeedbackCount}
                  leftIcon="feedback"
                  primaryText="Visszajelzések"
                  to={routes.FEEDBACKS}
                />
              </Fragment>
            }
          </Store.Consumer>


          <Divider style={dividerStyle}/>
          <Subheader style={{color: "white"}}>Szekciók</Subheader>
          <SidebarMenuItem
            leftIcon="person"
            primaryText="Bemutatkozás"
            to={routes.INTRO}
          />
          <SidebarMenuItem
            leftIcon="verified_user"
            primaryText="Tanúsítványok"
            to={routes.CERTIFICATES}
          />
          <SidebarMenuItem
            leftIcon="business"
            primaryText="Szobák"
            to={routes.ROOMS}
          />
          <SidebarMenuItem
            leftIcon="restaurant"
            primaryText="Ételek"
            to={routes.FOODS}
          />
          <SidebarMenuItem
            leftIcon="event"
            primaryText="Rendezvények"
            to={routes.EVENTS}
          />
          <SidebarMenuItem
            leftIcon="room_service"
            primaryText="Szolgáltatásaink"
            to={routes.SERVICES}
          />
          <Divider style={dividerStyle}/>
          <Subheader style={{color: "white"}}>Közösségi média</Subheader>
          <MenuItem
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{color: "#fff"}}
              >message</FontIcon>}
            primaryText={
              <a
                href="https://www.messenger.com/t/200199203718517"
                rel="noopener noreferrer"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex"
                }}
                target="_blank"
              >Messenger</a>
            }
          />
          <MenuItem
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{color: "#fff"}}
              >group</FontIcon>}
            primaryText={
              <a
                href="https://www.facebook.com/B%C3%ADbic-Vendegh%C3%A1zak-%C3%89s-S%C3%B6r%C3%B6z%C5%91-200199203718517"
                rel="noopener noreferrer"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex"
                }}
                target="_blank"
              >Facebook</a>
            }
          />
          <MenuItem
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{color: "#fff"}}
              >photo_camera</FontIcon>}
            primaryText={
              <a
                href="https://www.instagram.com/explore/tags/bibicvendeghaz/"
                rel="noopener noreferrer"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex"
                }}
                target="_blank"
              >Instagram</a>
            }
          />
          <MenuItem
            leftIcon={
              <FontIcon
                className="material-icons"
                style={{color: "#fff"}}
              >video_library</FontIcon>}
            primaryText={
              <a
                href="https://youtube.com/bibic-vendeghazak"
                rel="noopener noreferrer"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex"
                }}
                target="_blank"
              >YouTube</a>
            }
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
            leftIcon="settings"
            primaryText="Beállítások"
            to={routes.SETTINGS}
          />
        </Drawer>
      </aside>
    )}
}


const Profile = ({handleLogout}) => (
  <Store.Consumer>
    {({profile: {
      name, src
    }}) =>
      <div className="profile">
        <Avatar
          className="avatar"
          size={48}
          src={src ||
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAOUlEQVR42u3OIQEAAAACIP1/2hkWWEBzVgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYF3YDicAEE8VTiYAAAAAElFTkSuQmCC"}
          title={name || "Bíbic vendégházak"}
        />
        <Logout {...{handleLogout}}/>
      </div>
    }
  </Store.Consumer>
)


const SidebarMenuItem = ({
  primaryText, leftIcon, count, to
}) => (
  <NavLink
    activeClassName="menu-active"
    className="menu-item"
    style={{textDecoration: "none"}}
    to={to}
  >
    <FontIcon
      className="material-icons"
      style={{color: "#fff"}}
    >{leftIcon}</FontIcon>
    {primaryText}
    {count ?
      <Badge
        badgeContent={count.toString()}
        className="menu-badge"
        primary
      /> : null}
  </NavLink>
)