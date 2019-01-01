import React from "react"
import {Route, Redirect, Switch} from "react-router-dom"
import {withStore} from "../../db"
import Sidebar from "./Sidebar"
import NoMatch from "./NoMatch"
import Login from "../Auth/Login"
import {
  Reservations, Calendar, Rooms, Messages, Feedbacks
} from "../../scenes"

import {routes, toRoute, colors} from "../../utils"
import {Tip, Paragraphs, Gallery} from "../shared"


import {withStyles} from "@material-ui/core/styles"
import Menu from "@material-ui/icons/MenuRounded"

import {
  Drawer, AppBar, Toolbar,
  IconButton, Hidden
} from "@material-ui/core"
import {Title, RightAction} from "./Toolbar"
import Dialog from "./Dialog"
import Notification from "./Notification"


const App = ({
  isLoggedIn, handleDrawerToggle, mobileOpen,
  classes, theme
}) =>
  <div>
    {isLoggedIn ?
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              aria-label="Open drawer"
              className={classes.navIconHide}
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <Menu/>
            </IconButton>
            <Title/>
            <RightAction/>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            // Better open performance on mobile.
            ModalProps={{keepMounted: true}}
            anchor={theme.direction === "rtl" ? "right" : "left"}
            classes={{paper: classes.drawerPaper}}
            onClose={handleDrawerToggle}
            open={mobileOpen}
            variant="temporary"
          >
            <Sidebar/>
          </Drawer>
        </Hidden>
        <Hidden
          implementation="css"
          smDown
        >
          <Drawer
            classes={{paper: classes.drawerPaper}}
            open
            variant="permanent"
          >
            <Sidebar/>
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route component={() => <Redirect to={routes.RESERVATIONS}/>} exact path="/" />
            <Route
              component={Reservations}
              path={routes.RESERVATIONS}
            />
            <Route
              component={Calendar}
              path={toRoute(routes.CALENDAR, ":year",":month")}
            />
            <Route
              component={Feedbacks}
              path={toRoute(routes.FEEDBACKS, ":show?")}
            />
            <Route
              component={Messages}
              path={routes.MESSAGES}
            />
            <Route
              component={Paragraphs}
              path={routes.INTRO}
            />
            <Route
              component={Rooms}
              path={toRoute(routes.ROOMS, ":roomId?")}
            />
            <Route
              path={routes.CERTIFICATES}
              render={props =>
                <div
                  style={{
                    maxWidth: 540,
                    margin: "0 auto"
                  }}
                >
                  <Paragraphs {...props}/>
                  <Gallery fabOffsetY={-64} hasText={false} {...props}/>
                </div>
              }
            />
            <Route
              component={Gallery}
              path={routes.EVENTS}
            />
            <Route
              component={props =>
                <>
                  <Gallery {...props}/>
                  <Tip>
                    Az első három kép fel lesz tüntetve a főoldalon a
                    Szolgáltatásaink szekció alatt.
                  </Tip>
                </>
              }
              path={routes.SERVICES}
            />
            <Route
              component={Gallery}
              path={routes.FOODS}
            />
            <Route component={NoMatch}/>
          </Switch>
        </main>
      </div>
      : <Login/>
    }
    <Dialog/>
    <Notification/>
  </div>


const drawerWidth = 240

export default withStyles(theme => ({
  root: {
    flexGrow: 1,
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "fixed",
    marginLeft: drawerWidth,
    backgroundColor: theme.palette.primary.dark,
    [theme.breakpoints.up("md")]: {width: `calc(100% - ${drawerWidth}px)`}
  },
  navIconHide: {[theme.breakpoints.up("md")]: {display: "none"}},
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {marginLeft: drawerWidth},
    backgroundColor: colors.grey
  }
}), {withTheme: true})(withStore(App))