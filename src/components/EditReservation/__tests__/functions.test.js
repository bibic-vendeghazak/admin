import {getPrice} from "../functions"

describe("getPrice", () => {

  const validReservation = {
    from: new Date(),
    to: new Date(),
    roomId: 1,
    adults: 1,
    children: [],
    foodService: "breakfast"
  }

  const rooms = [
    {
      prices: {
        table: {
          breakfast: {
            0: null,
            1: {
              0: {
                price: 1000
              }
            }
          }
        }
      }
    }
  ]


  describe("👍 valid parameters", () => {
    it("no child", () => {
      expect(getPrice(validReservation, rooms)).toEqual({error: null , price: 1000})
    })
  })

  describe("👎 invalid parameters", () => {
    it("wrong rooms parameter", () => {
      expect(getPrice(validReservation, [])).toEqual({error: "Hibás ártáblázat" , price: 0})
    })
  })


})