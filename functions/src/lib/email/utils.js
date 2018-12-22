import fs from "fs"
import { parseReservation } from "./parse"
import handlebars from "handlebars"

const readFile = (path, opts = "utf8") =>
  new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(err)
      else res(data)
    })
  })


/**
 * Turns data object into HTML string
 * @param {string} path to the HTML template
 * @param {object} data object
 */
export const toHTML = async (path, data) => {
  const accepted = await readFile(path)
  const template = handlebars.compile(accepted)
  return template(data)
}

/**
 * Turns reservation object into HTML string
 * @param {string} path to the HTML template
 * @param {object} reservation object
 */
export const reservationToHTML = async (path, reservation) =>
  toHTML(path, parseReservation(reservation))


/**
 * Turns feedback object into HTML string
 * @param {string} path to the HTML template
 * @param {object} feedback object
 */
export const feedbackToHTML = async (path, feedback) =>
  toHTML(path, feedback)