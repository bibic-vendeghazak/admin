import {moment} from "../lib"

const TOMORROW = moment().add(1, "day").startOf("day")

const nameRe = new RegExp(/[\s.áéíóöőúüűÁÉÍÓÖŐÚÜŰa-zA-Z-]+/)
const emailRe = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
const telRe = new RegExp(/^\+?[0-9-\s]+/)
const addressRe = new RegExp(/[\s.\-,/áéíóöőúüűÁÉÍÓÖŐÚÜŰa-zA-Z0-9]+/)

export const valid = {
  roomId: (roomId=0, roomsLength) => (0 < roomId) && (roomId <= roomsLength),
  name: name => nameRe.test(name),
  email: email => emailRe.test(email),
  tel: tel => telRe.test(tel),
  address: address => typeof address === "string" && addressRe.test(address),
  message: message => typeof message === "string",
  messageMin: message => typeof message === "string" && message.length >= 40,
  from: from => moment(from).isAfter(TOMORROW),
  to: to => moment(to).isAfter(TOMORROW.clone().add(2, "day")),
  period: (from, to) => moment.range(from, to).snapTo("day").diff("day") >= 1,
  adults: adults => typeof adults === "number" && adults,
  children: children =>
    Array.isArray(children) &&
    (children.length === 0 ||
    children.every(child =>
      Object.keys(child).length === 2 &&
        child.name && child.count &&
        ["0-6", "6-12"].includes(child.name) && child.count >= 0
    )),
  peopleCount: (adults, children, maxPeople) => adults + children.reduce((acc, {count}) => acc+count, 0) <= maxPeople,
  foodService: service => ["breakfast", "halfBoard"].includes(service)
}


export const validateReservation = ({
  roomId, roomLength, name, email, tel, address, from, to, message, adults, children, maxPeople, foodService
}) =>
  !valid.roomId(roomId, roomLength) ? "Érvénytelen szobaszám" :
    !valid.name(name) ? "Érvénytelen név" :
      !valid.email(email) ? "Érvénytelen e-mail cím" :
        !valid.tel(tel) ? "Érvénytelen telefonszám" :
          !valid.address(address) ? "Érvénytelen lakcím" :
            !valid.from(from) ? "Legkorábbi érkezés holnap" :
              !valid.to(to) ? "Legkorábbi távozás holnapután" :
                !valid.period(from, to) ? "A foglalás legalább egy éjszakát kell, hogy tartalmazzon" :
                  !valid.message(message) ? "Érvénytelen üzenet" :
                    !valid.messageMin(message) ? "Túl rövid üzenet (min 40 karakter)" :
                      !valid.adults(adults) ? "Érvénytelen felnőtt" :
                        !valid.children(children) ? "Érvénytelen gyerek" :
                          !valid.foodService(foodService) ? "Érvénytelen ellátás" :
                            !valid.peopleCount(adults, children, maxPeople) ? "A személyek száma nem haladhatja meg a szoba kapacitását" :
                              false
