import {Rooms} from "../"
import Room from "../Room"
import {EditRoom} from "../../../components/EditRoom"
import {Loading} from "../../../components/shared"


describe("Rooms component", () => {
  const props = {
    rooms: [],
    match: {params: {roomId: "2"}}
  }
  const wrapper = shallow(<Rooms {...props}/>)

  it("when roomId parameter in URL, render EditRoom", () => {
    expect(wrapper.prop("roomId")).toBe(1)
  })

  it("show Loading", () => {
    wrapper.setProps({match: {params: {roomId: null}}})
    expect(wrapper.find(Loading).length).toBe(1)
  })

  it("render list of rooms", () => {
    wrapper.setProps({roomPictures: [], rooms: [{id: 0},{id: 1}]})
    expect(wrapper.find(Room).length).toBe(2)
  })
})