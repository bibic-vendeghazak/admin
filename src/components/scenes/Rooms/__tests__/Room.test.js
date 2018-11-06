import {Room} from "../Room"
import {Tooltip, Typography, CardMedia, Button} from "@material-ui/core"
import {routes} from "../../../../utils"

describe("Room component", () => {
  const props = {id: 1}
  const wrapper = shallow(<Room {...props}/>)

  it("renders correctly", () => {
    expect(wrapper.length).toBe(1)
  })

  describe("Card media image", () => {
    it("falls back to empty state image", () => {
      expect(wrapper.find(CardMedia).prop("image")).toBe("empty-state.svg")
    })

    it("displays image", () => {
      wrapper.setProps({pictures: {
        picture: {order: 0, SIZE_640: "image.jpg"}
      }})
      expect(wrapper.find(CardMedia).prop("image")).toBe("image.jpg")
    })

  })

  describe("Shows unavailable status", () => {
    beforeAll(() => {
      wrapper.setProps({unavailable: true})
    })
    it("in the tooltip", () => {
      expect(wrapper.find(Tooltip).prop("title")).toBe(hu.rooms.room.unavailable.long)
    })

    it("in the subtitle", () => {
      expect(
        wrapper.find(Typography)
          .findWhere(e => e.prop("variant") === "body2").prop("children")).toBe(hu.rooms.room.unavailable.short)
    })
  })

  describe("Shows booked status", () => {
    beforeAll(() => {
      wrapper.setProps({unavailable: false, isBooked: true})
    })
    it("in the tooltip", () => {
      expect(wrapper.find(Tooltip).prop("title")).toBe(hu.rooms.room.booked.yes.long)
    })

    it("in the subtitle", () => {
      expect(
        wrapper.find(Typography)
          .findWhere(e => e.prop("variant") === "body2").prop("children")).toBe(hu.rooms.room.booked.yes.short)
    })
  })

  describe("Shows unbooked status", () => {
    beforeAll(() => {
      wrapper.setProps({isBooked: false})
    })
    it("in the tooltip", () => {
      expect(wrapper.find(Tooltip).prop("title")).toBe(hu.rooms.room.booked.no.long)
    })

    it("in the subtitle", () => {
      expect(
        wrapper.find(Typography)
          .findWhere(e => e.prop("variant") === "body2").prop("children")).toBe(hu.rooms.room.booked.no.short)
    })
  })

  it("details button points to 'rooms/roomId'", () => {
    expect(wrapper.find(Button).prop("to")).toBe(`${routes.ROOMS}/1`)
  })

})