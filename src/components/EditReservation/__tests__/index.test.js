import {EditReservation} from ".."
import {TODAY, TOMORROW} from "../../../lib/moment"


describe("EditReservation component", () => {
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
  const props = {
    reservation: validReservation,
    sendNotification: jest.fn(),
    match: {params: {reservationId: "reservationId"}}
  }

  it("renders correctly", () => {
    const wrapper = shallow(<EditReservation {...props}/>)
    expect(wrapper).toHaveLength(1)
  })

  it("renders correctly (detailed)", () => {
    const wrapper2 = shallow(<EditReservation {...{...props, isDetailed: true}}/>)
    expect(wrapper2).toHaveLength(1)
  })

})

