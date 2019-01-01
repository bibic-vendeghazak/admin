/**
 * Toggles the drawer.
 */
export function toggleDrawer() {
  this.setState(({mobileOpen}) => ({mobileOpen: !mobileOpen}))
}