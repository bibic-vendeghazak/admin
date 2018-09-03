import React from "react"
import PropTypes from "prop-types"
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
import Feedback from "@material-ui/icons/ThumbsUpDownRounded"
import Group from "@material-ui/icons/GroupRounded"
import Language from "@material-ui/icons/LanguageRounded"
import Message from "@material-ui/icons/MessageRounded"
import SpecialReqests from "@material-ui/icons/LoyaltyRounded"
import Person from "@material-ui/icons/PersonRounded"
import PhotoCamera from "@material-ui/icons/PhotoCameraRounded"
import Restaurant from "@material-ui/icons/RestaurantRounded"
import RoomService from "@material-ui/icons/RoomServiceRounded"
import Settings from "@material-ui/icons/SettingsRounded"
import VerifiedUser from "@material-ui/icons/VerifiedUserRounded"
import VideoLibrary from "@material-ui/icons/VideoLibraryRounded"


const styles = ({
  spacing: {unit}, palette: {primary: {dark}}
}) => ({
  primary: {
    color: "white",
    paddingTop: unit
  },
  button: {"&:hover": {backgroundColor: dark}},
  activeLink: {backgroundColor: dark},
  divider: {backgroundColor: "white"},
  nested: {
    paddingLeft: unit * 4,
    paddingTop: unit/2,
    paddingBottom: unit
  }
})

const Sidebar = ({
  classes : {
    divider, primary, button, activeLink, nested
  }, handleDrawerToggle,
  unhandledReservationCount, unhandledFeedbackCount, unhandledSpecialRequestCount,profile: {
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
          {...{drawerItemStyle: {
            nested,
            ...drawerItemStyle
          }}}
          icon={
            <Badge
              badgeContent={unhandledReservationCount}
              color="secondary"
            >
              <Bookmark/>
            </Badge>
          }
          to={routes.RESERVATIONS}
        >
            Szobafoglalás
        </DrawerItem>
        <DrawerItem
          {...{drawerItemStyle: {
            nested,
            ...drawerItemStyle
          }}}
          icon={<DateRange/>}
          to={toRoute(routes.CALENDAR, moment().format("YYYY/MM"))}
        >Naptár</DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={
            <Badge
              badgeContent={unhandledSpecialRequestCount}
              color="secondary"
            >
              <SpecialReqests/>
            </Badge>
          }
          to={routes.SPECIAL_REQUESTS}
        >
          Külön ajánlat
        </DrawerItem>
        <DrawerItem
          {...{drawerItemStyle}}
          icon={
            <Badge
              badgeContent={unhandledFeedbackCount}
              color="secondary"
            >
              <Feedback/>
            </Badge>
          }
          to={routes.FEEDBACKS}
        >
            Visszajelzés
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
  unhandledReservationCount: PropTypes.number,
  unhandledFeedbackCount: PropTypes.number,
  profile: PropTypes.object
}


export default withStyles(styles, {withTheme: true})((withStore(Sidebar)))


const DrawerItem = ({
  drawerItemStyle: {
    button, primary, activeLink, nested
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
      className={nested}
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