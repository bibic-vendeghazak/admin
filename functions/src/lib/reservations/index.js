const functions = require("firebase-functions")
const email = require("../email")
const moment = require("../moment")
const utils = require("./utils")
const exists = require("./exists")


module.exports.exists = exists.reservationExists

const reservationRef = functions
  .region("europe-west1")
  .firestore
  .document("reservations/{reservationId}")


module.exports.reservationCreated = reservationRef
  .onCreate((snap, {params: {reservationId}}) => {
    const reservation = snap.data()
    const {from, to, roomId, handled} = reservation
    console.log(`reservation ${reservationId} created`)

    let type = "created"

    /* check if admin created this reservation,
     * for the sake of right phrasing in the e-mail to be sent
     */
    if (handled === true) {
      type = "changedFirst"
    }

    // create dates✨
    return utils.updateReservationDates(from, to, roomId, snap.id)
    /* if creating dates was successful, send an e-mail, but
     * do not send if the reservation was added by the admin
     * (an admin generated reservation has email@email.hu as default e-mail address)
     * admins always get a reminder e-mail
     * NOTE: remember to add reservationId to the reservation that will be passed to the email
     */
      .then(() => {
        console.log("now the emails")
        let emails = ["admin"]
        reservation.email !== "email@email.hu" && emails.push("user")

        emails = emails.map(target => email.sendReservationEmail({reservationId, ...reservation}, type, target))

        return Promise.all(emails)
      })
  })

module.exports.reservationDeleted = reservationRef
  .onDelete((snap, {params: {reservationId}}) => {
    const reservation = snap.data()
    const {from, to, roomId} = reservation
    console.log(`reservation ${reservationId} deleted`)

    // sanitize dates 🔥
    return utils.updateReservationDates(from, to, roomId, reservationId, true)
    /* if sanitizing was successful, send an e-mail, but
     * do not send if the reservation was added by the admin
     * (an admin generated reservation has email@email.hu as default e-mail address)
     * admins always get a reminder e-mail
     * NOTE: remember to add reservationId to the reservation that will be passed to the email
     */
      .then(() => {
        console.log("now the emails")
        const targets = ["admin"]
        reservation.email !== "email@email.hu" && targets.push("user")
        return Promise.all(targets.map(target =>
          email.sendReservationEmail({reservationId, ...reservation}, "deleted", target)
        ))
      }
      )
  })

module.exports.reservationChanged = reservationRef
  .onUpdate(({before, after}, {params: {reservationId}}) => {
    console.log(`reservation ${reservationId} changed`)
    before = before.data()
    after = after.data()

    return (
      // check if we at all need to run updateReservationDates, or there was no date or room change
      (
        moment(before.from.toDate()).isSame(moment(after.from.toDate())) &&
        moment(before.to.toDate()).isSame(moment(after.to.toDate())) &&
        before.roomId === after.roomId
      ) ?
        (console.log("no reservation dates/room was changed") || Promise.resolve()) :
        // sanitize dates 🔥 - to avoid conflicts
        (console.log("updating reservation dates") || utils.updateReservationDates(before.from, before.to, before.roomId, reservationId, true))
          .then(() => // ✨ only after add new dates
            utils.updateReservationDates(after.from, after.to, after.roomId, reservationId)
          )
    )
      .then(() => {
        console.log("now the emails")
        /* Send an e-mail about the changes, except if
      * the reservation was added by the admin
      * (an admin generated reservation has email@email.hu as default e-mail address)
      * admins always get a reminder e-mail
      */

        const targets = ["admin"]

        if (after.email !== "email@email.hu") {
          targets.push("user")
        }

        // determine what type of email will be sent
        let type = null

        if (before.handled === false && after.handled === true) {
        // reservation accepted 🎉 - It was created by a user, an admin accepts it for the first time
          type = "accepted"
        } else if (before.handled === true && after.handled === true && !utils.isEquivalent(before, after)) {
        // reservation changed 🔔 - An admin made a change on the reservation.

          /* check if it is the first time that we send a mail to the user
         * (then it need a different phrasing in the email)
         */
          if (before.email === "email@email.hu") {
            type = "changedFirst"
          } else {
            type = "changed"
          // WIP: we should only notify the user about the changed things
          // after = utils.diff(before, after)
          }
        }

        /* send e-mail(s) with the new reservation information
      * NOTE: remember to add reservationId to the reservation that will be passed to the email
      */
        return Promise.all(targets.map(target =>
          email.sendReservationEmail({reservationId, ...after}, type, target)
        ))
      })
  })
