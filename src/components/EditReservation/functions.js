import {moment} from "../../lib"

export const getPrice = ({
  from, to, roomId, adults, children, foodService
}, rooms) => {

  let price = 0
  let error = {code: "WRONG_PRICE_TABLE", message: "Hibás ártáblázat"}

  if (roomId.length !== 1) {
    error = {code: "CUSTOM_PRICING_NEEDED", message: "Egyedi árazás szükséges"}
    return ({error, price})
  }

  try {
    roomId = roomId[0]
    const {prices} = rooms[roomId-1]
    const {maxPeople} = prices.metadata
    const priceTable = prices.table[foodService]

    if (!priceTable || typeof maxPeople !== "number") return

    error = {code: "CUSTOM_PRICING_NEEDED", message: "Egyedi árazás szükséges"}
    // Check if there is enough place for the amount of adults
    const tempPrice = priceTable[adults]

    const freeChildCount = children[0].count
    const childCount = children[1].count

    // Check if there is enough place including the children
    if ((adults + freeChildCount + childCount) <= maxPeople) {

      const periodLength = moment.range(from, to).snapTo("day").diff("day")

      price = tempPrice[childCount].price * periodLength
      error = null

      if (periodLength <= 0)
        error = {code: "INVALID_PRICE", message: "Érvénytelen ár (az érkezés/távozás jól lett kitöltve?)"}

    }

  } finally {
    return ({error, price})
  }

}

