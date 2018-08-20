import moment from "moment"


const isValidRoomId = (roomId=0, roomCount) => (0 < roomId) && (roomId <= roomCount)
const isValidId = (id, from, roomId) => id === `${moment(from).format("YYYYMMDD")}-sz${roomId}`
const isValidName = name => (/[\s.áéíóöőúüűÁÉÍÓÖŐÚÜŰa-zA-Z-]/).test(name)
const isValidEmail = email => (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(email)
const isValidTel = tel => (/[0-9-+\s]/).test(tel)
const isValidAddress = address => typeof address === "string" && address.length > 0
const isValidMessage = message => typeof message === "string"
const isValidPeriod = (from, to) => moment(to).startOf("day").hours(14).diff(moment(from).startOf("day").hours(10), "days") >= 1
const isValidAdults = adults => typeof adults === "number" && adults >= 1
const isValidChildren = children => (
  Array.isArray(children) &&
  children.length >= 2 &&
  children.some(({name}) => name === "0-6") &&
  children.some(({name}) => name === "6-12")
)
const isValidPrice = price => parseInt(price, 10) >= 1


const isValidReservation = ({
  roomId, id, name, email, tel, address,
  from, to, message, adults, children, price
}, roomCount) =>
  !isValidRoomId(roomId, roomCount) ? "szobaszám" :
    !isValidId(id, from, roomId) ? "azonosító" :
      !isValidName(name) ? "név" :
        !isValidEmail(email) ? "e-mail" :
          !isValidTel(tel) ? "telefonszám" :
            !isValidAddress(address) ? "cím" :
              !isValidPeriod(from, to) ? "dátum" :
                !isValidMessage(message) ? "megjegyzés" :
                  !isValidAdults(adults) ? "felnőtt" :
                    !isValidChildren(children) ? "gyerek" :
                      !isValidPrice(price) ? "ár" : "OK"

export {isValidReservation}