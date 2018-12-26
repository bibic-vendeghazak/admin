import {EditReservation} from ".."


describe("EditReservation component", () => {
  const props = {
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

