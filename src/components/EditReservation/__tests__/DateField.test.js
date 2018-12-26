import {DateField} from "../DateField"
import {TODAY, TOMORROW} from "../../../lib/moment"

describe("DateField component", () => {
  const props = {
    type: "from",
    from: TODAY.clone().startOf("day").hours(14),
    to: TOMORROW.clone().startOf("day").hours(10),
    onChange: jest.fn()
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const wrapper = shallow(<DateField {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toHaveLength(1)
    expect(wrapper.prop("name")).toBe(props.type)
  })

  it("correct label", () => {
    expect(wrapper.prop("label")).toBe("Érkezés")
    wrapper.setProps({type: "to"})
    expect(wrapper.prop("label")).toBe("Távozás")
  })

  it("correct value", () => {
    expect(wrapper.prop("value")).toBe(props.to.format("YYYY-MM-DD"))
    wrapper.setProps({type: "from"})
    expect(wrapper.prop("value")).toBe(props.from.format("YYYY-MM-DD"))
  })

  it("change propagates", () => {
    const newDate = TODAY.clone().add(1, "week")
    wrapper.simulate("change", {target: {value: newDate.clone().format("YYYY-MM-DD")}})
    expect(props.onChange).toBeCalledTimes(2)
    expect(props.onChange.mock.calls).toEqual([
      ["from", newDate.clone().startOf("day").hours(14).toDate() , true],
      ["to", props.to.clone().toDate() , true]
    ])
    jest.resetAllMocks()
    wrapper.setProps({type: "to"})

    wrapper.simulate("change", {target: {value: newDate.clone().format("YYYY-MM-DD")}})
    expect(props.onChange).toBeCalledTimes(2)
    expect(props.onChange.mock.calls).toEqual([
      ["from", props.from.clone().toDate() , true],
      ["to", newDate.clone().startOf("day").hours(10).toDate() , true]
    ])
  })
})