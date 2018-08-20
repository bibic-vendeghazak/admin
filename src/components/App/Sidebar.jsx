import React from "react"
import PropTypes from 'prop-types'
import moment from "moment"
import {NavLink} from "react-router-dom"
import {withStore} from "./Store"
import {routes, toRoute} from "../../utils"
import Logout from "./Auth/Logout"

import {
  Avatar,
  Badge,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  withStyles
} from "@material-ui/core"


import Bookmark from "@material-ui/icons/BookmarkRounded"
import Business from "@material-ui/icons/BusinessRounded"
import DateRange from "@material-ui/icons/DateRangeRounded"
import Event from "@material-ui/icons/EventRounded"
import Feedback from "@material-ui/icons/FeedbackRounded"
import Group from "@material-ui/icons/GroupRounded"
import Language from "@material-ui/icons/LanguageRounded"
import Message from "@material-ui/icons/MessageRounded"
import Person from "@material-ui/icons/PersonRounded"
import PhotoCamera from "@material-ui/icons/PhotoCameraRounded"
import Restaurant from "@material-ui/icons/RestaurantRounded"
import RoomService from "@material-ui/icons/RoomServiceRounded"
import Settings from "@material-ui/icons/SettingsRounded"
import VerifiedUser from "@material-ui/icons/VerifiedUserRounded"
import VideoLibrary from "@material-ui/icons/VideoLibraryRounded"


const styles = theme => ({
  primary: {color: "white"},
  button: {"&:hover": {backgroundColor: theme.palette.primary.dark}},
  activeLink: {backgroundColor: theme.palette.primary.dark},
  divider: {backgroundColor: "white"}
})

const Sidebar = ({
  classes : {
    divider, primary, button, activeLink
  }, handleDrawerToggle,
  unHandledReservationCount, unreadFeedbackCount, profile: {
    name="Bíbic vendégházak",
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAOUlEQVR42u3OIQEAAAACIP1/2hkWWEBzVgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYF3YDicAEE8VTiYAAAAAElFTkSuQmCC"
  }
}) => {
  const drawerItemStyle={
    primary,
    button,
    activeLink

  }
  return (
    <div onClick={handleDrawerToggle}>
      <Grid
        alignItems="center"
        container
        justify="space-between"
        style={{padding: "12px 8px"}}
      >
        <Tooltip title={`Üdvözöljük, ${name}!`}>
          <Avatar
            size={48}
            src={src}
          />
        </Tooltip>
        <Logout/>
      </Grid>
      <Divider className={divider}/>
      <DrawerItem
        {...{drawerItemStyle}}
        href={routes.WEB}
        icon={<Language/>}
      >
      Weblap megtekintése
      </DrawerItem>
      <Divider className={divider}/>
      <List disablePadding>
        <ListSubheader disableSticky style={{color: "white"}}>Foglalás</ListSubheader>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={
            <Badge
              badgeContent={unHandledReservationCount}
              color="secondary"
            >
              <Bookmark/>
            </Badge>
          }
          to={routes.RESERVATIONS}
        >
            Foglalások
        </DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={<DateRange/>}
          to={toRoute(routes.CALENDAR, moment().format("YYYY/MM"))}
        >Naptár</DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={
            <Badge
              badgeContent={unreadFeedbackCount}
              color="secondary"
            >
              <Feedback/>
            </Badge>
          }
          to={routes.FEEDBACKS}
        >
            Visszajelzések
        </DrawerItem>
      </List>
      <Divider className={divider}/>
      <List disablePadding>
        <ListSubheader disableSticky style={{color: "white"}}>Szekciók</ListSubheader>
        <DrawerItem
          component={NavLink}
          {...{drawerItemStyle}}
          icon={<Person/>}
          to={routes.INTRO}
        >
        Bemutatkozás
        </DrawerItem>
        <DrawerItem
          component={NavLink}
          {...{drawerItemStyle}}
          icon={<VerifiedUser/>}
          to={routes.CERTIFICATES}
        >
        Tanúsítványok
        </DrawerItem>
        <DrawerItem
          component={NavLink}
          {...{drawerItemStyle}}
          icon={<Business/>}
          to={routes.ROOMS}
        >
        Szobák
        </DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={<Restaurant/>}
          to={routes.FOODS}
        >
        Ételek
        </DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={<Event/>}
          to={routes.EVENTS}
        >
        Rendezvények
        </DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={<RoomService/>}
          to={routes.SERVICES}
        >
        Szolgáltatásaink
        </DrawerItem>
      </List>
      <Divider className={divider}/>
      <List disablePadding>
        <ListSubheader disableSticky style={{color: "white"}}>Közösségi média</ListSubheader>
        <DrawerItem
          {...{drawerItemStyle}}
          href={routes.MESSENGER}
          icon={<Message/>}
        >Messenger</DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          href={routes.FACEBOOK}
          icon={<Group/>}
        >Facebook</DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          href={routes.INSTAGRAM}
          icon={<PhotoCamera/>}
        >Instagram</DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          href={routes.YOUTUBE}
          icon={<VideoLibrary/>}
        >YouTube</DrawerItem>

      </List>
      <Divider className={divider}/>
      <List disablePadding>
        <ListSubheader disableSticky style={{color: "white"}}>Egyéb</ListSubheader>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={<Settings/>}
          to={routes.SETTINGS}
        >
        Beállítások
        </DrawerItem>
      </List>
    </div>
  )
}

Sidebar.propTypes = {
  classes: PropTypes.object,
  handleLogout: PropTypes.func,
  unHandledReservationCount: PropTypes.number,
  unreadFeedbackCount: PropTypes.number,
  profile: PropTypes.object
}


export default withStyles(styles, {withTheme: true})((withStore(Sidebar)))


const DrawerItem = ({
  drawerItemStyle: {
    button, primary, activeLink
  }, href, to, icon, children, ...props
}) => {
  let typeProps = {}
  if (href) {
    typeProps = {
      href,
      component: "a",
      rel: "noopener noreferrer",
      target: "_blank"
    }
  } else if (to) {
    typeProps = {
      to,
      component: NavLink,
      activeClassName: activeLink
    }
  }
  return (
    <ListItem
      button
      classes={{button}}
      {...{
        ...typeProps,
        ...props
      }}
    >
      <ListItemIcon style={{color: "white"}}>
        {icon}
      </ListItemIcon>
      <ListItemText
        classes={{primary}}
        primary={children}
      />
    </ListItem>

  )
}