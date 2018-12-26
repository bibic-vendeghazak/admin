import {getPrice, handleSubmit} from "../functions"
import {TODAY, TOMORROW} from "../../../lib/moment"

describe("getPrice", () => {

  const validReservation = {
    message: "🤖 admin által felvéve",
    name: "",
    roomId: 1,
    tel: "000-000-000",
    email: "email@email.hu",
    address: "lakcím",
    adults: 1,
    children: [
      {name: "0-6", count: 0},
      {name: "6-12", count: 0}
    ],
    from: TODAY.clone().hours(14).toDate(),
    to: TOMORROW.clone().hours(10).toDate(),
    handled: true,
    foodService: "breakfast",
    price: 1,
    archived: false
  }

  const validRooms = [
    {
      prices: {
        metadata: {maxPeople: 2},
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

  it("👍 valid parameters", () => {
    expect(getPrice(validReservation, validRooms)).toEqual({error: null , price: 1000})
  })

  const wrongPriceTable = {error: {code: "WRONG_PRICE_TABLE", message: expect.any(String)} , price: 0}
  const invalidPrice = {error: {code: "INVALID_PRICE", message: expect.any(String)} , price: expect.any(Number)}
  const customPricingNeeded = {error: {code: "CUSTOM_PRICING_NEEDED", message: expect.any(String)} , price: 0}

  describe("👎 invalid parameters", () => {
    describe("invalid reservation parameters", () => {
      it("negative price", () => {
        const reservation = {...validReservation, from: TOMORROW.toDate()}
        expect(getPrice(reservation, validRooms)).toEqual(invalidPrice)
      })

      it("max people exceeded", () => {
        const reservation1 = {...validReservation, adults: 3}
        expect(getPrice(reservation1, validRooms)).toEqual(customPricingNeeded)
        const reservation2 = {...validReservation, children: [{count: 3}, {count: 0}]}
        expect(getPrice(reservation2, validRooms)).toEqual(customPricingNeeded)
      })


    })
    describe("invalid room parameters", () => {
      describe("invalid price table", () => {

        it("no rooms", () => {
          expect(getPrice(validReservation, null)).toEqual(wrongPriceTable)
        })

        it("no room", () => {
          expect(getPrice(validReservation, {1: null})).toEqual(wrongPriceTable)
        })

        it("no prices", () => {
          expect(getPrice(validReservation, {0: {prices: null}})).toEqual(wrongPriceTable)
        })

        it("no metadata", () => {
          expect(getPrice(validReservation, {0: {
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
          }})).toEqual(wrongPriceTable)
        })

        it("invalid maxPeople", () => {
          expect(getPrice(validReservation, {0: {
            prices: {
              metadata: {maxPeople: null},
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
          }})).toEqual(wrongPriceTable)
        })

        it("no maxPeople", () => {
          expect(getPrice(validReservation, {0: {
            prices: {
              metadata: null,
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
          }})).toEqual(wrongPriceTable)
        })

        it("no table", () => {
          expect(getPrice(validReservation, {0: {
            prices: {metadata: {maxPeople: 2}}
          }})).toEqual(wrongPriceTable)
        })

        it("no foodService", () => {
          expect(getPrice(validReservation, {0: {
            prices: {
              metadata: {maxPeople: 2},
              table: {}
            }
          }})).toEqual(wrongPriceTable)
        })

      })

      it("invalid adults", () => {
        const rooms1 = [
          {
            prices: {
              metadata: {maxPeople: 2},
              table: {
                breakfast: {
                  0: null,
                  1: null
                }
              }
            }
          }
        ]
        const rooms2 = [
          {
            prices: {
              metadata: {maxPeople: 2},
              table: {
                breakfast: {
                  0: null,
                  1: {}
                }
              }
            }
          }
        ]
        const rooms3 = [
          {
            prices: {
              metadata: {maxPeople: 2},
              table: {
                breakfast: {
                  0: null,
                  1: ""
                }
              }
            }
          }
        ]
        expect(getPrice(validReservation, rooms1)).toEqual(customPricingNeeded)
        expect(getPrice(validReservation, rooms2)).toEqual(customPricingNeeded)
        expect(getPrice(validReservation, rooms3)).toEqual(customPricingNeeded)
      })

      it("invalid children", () => {
        const rooms1 = [
          {
            prices: {
              metadata: {maxPeople: 2},
              table: {
                breakfast: {
                  0: null,
                  1: {
                    0: null
                  }
                }
              }
            }
          }
        ]
        expect(getPrice(validReservation, rooms1)).toEqual(customPricingNeeded)
      })
    })

  })

})


// REVIEW:
describe.skip("handleSubmit", () => {
  const validReservation = {
    roomId: 1,
    roomLength: 6,
    name: "Name Name",
    email: "email@email.hu",
    tel: "+000-000-000",
    address: "1234 Budapest, Utca utca 1/a",
    from: TODAY.toDate(),
    to: TOMORROW.toDate(),
    message: "Lorem ipsum dolor sit amet,lorem ipsum dolor sit amet,lorem ipsum dolor sit amet,lorem ipsum dolor sit amet.",
    adults: 1,
    children: [],
    foodService: "breakfast",
    archived: false
  }


  describe("👍 valid reservation", () => {
    it("new reservation", () => {
      expect(handleSubmit(validReservation, 6, "admin name", undefined))
        .toEqual(Promise.resolve())
    })

    it("edited reservation", () => {
      expect(handleSubmit(validReservation, 6, "admin name", "reservationId"))
        .toEqual(Promise.resolve())
    })
  })

  describe("👎 invalid reservation", () => {
    it("no reservation", () => {
      expect(handleSubmit(undefined, 6, "admin name", undefined))
        .toEqual(Promise.reject())
    })

    it("invalid reservation", () => {
      expect(handleSubmit({...validReservation, from: TOMORROW}, 6, "admin name", undefined))
        .toEqual(Promise.reject({code: "error", message: "A foglalás legalább egy éjszakát kell, hogy tartalmazzon"}))
    })

  })

})