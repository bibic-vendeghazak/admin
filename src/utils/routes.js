
const routes = {
  WEB: process.env.REACT_APP_WEBSITE_URL,
  ROOT: process.env.REACT_APP_ADMIN_DASHBOARD_URL,
  INSTAGRAM: "https://www.instagram.com/explore/tags/bibicvendeghaz",
  YOUTUBE: "https://youtube.com/bibic-vendeghazak",
  MESSENGER: "https://www.messenger.com/t/200199203718517",
  FACEBOOK: "https://www.facebook.com/B%C3%ADbic-Vendegh%C3%A1zak-%C3%89s-S%C3%B6r%C3%B6z%C5%91-200199203718517",
  LOGIN: "/bejelentkezes",
  WELCOME: "/kezdolap",
  MESSAGES: "/uzenetek",
  ROOMS: "/szobak",
  INTRO: "/bemutatkozas",
  CERTIFICATES: "/tanusitvanyok",
  EVENTS: "/rendezvenyek",
  FOODS: "/etelek",
  SETTINGS: "/beallitasok",
  SERVICES: "/szolgaltatasaink",
  CALENDAR: "/naptar",
  RESERVATIONS: "/foglalasok",
  FEEDBACKS: "/visszajelzesek",
  STATS: "/statisztikak",
  GALLERY: "galeria",
  EDIT: "szerkeszt",
  BLOCK: "blokkolas",
  NEW: "uj",
  IS_VALID: "ervenyesseg",
  UPLOAD: "feltoltes",
  HANDLED: "kezelt",
  READ: "olvasott",
  UNREAD: "olvasatlan",
  DELETE: "torol"
}

/**
 * Construct a route path from the parameters
 * @param  {...string} individual parts of the desired path
 * @returns {string} a string of parts joined by a /
 */
const toRoute = (...parts) => [...parts].join("/")

export {routes, toRoute}