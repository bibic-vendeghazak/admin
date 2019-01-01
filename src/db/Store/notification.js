
export const notification = {open: false, message: {}, duration: 5000}

/**
 * Notification to the user
 * @param {object} message Contains a code, and a message to display.
 * @param {string} message.code eg.: SUCCESS, ERROR
 * @param {string} message.message The message that will be shown to the user.
 * @param {number} length How long the notification should be present.
 */
export function sendNotification(message, length) {
  this.setState(({notification}) => ({
    notification: {
      ...notification,
      open: true,
      length: length || 5000,
      message
    }}))
}

/**
 * Resets the notification.
 */
export async function closeNotification() {
  /*
   * NOTE: To prevent text flickering, first, only
   * the open state is changed, then the rest of the notification.
   */
  await this.setState(({notification: prevNotification}) => ({
    notification: {
      ...prevNotification,
      open: false
    }
  }))
  setTimeout(() => this.setState({notification}), notification.duration)
}