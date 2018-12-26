import {Price} from "../Price"
describe("Price component", () => {
  const props = {
    value: null,
    onChange: jest.fn(),
    error: null
  }
  const wrapper = shallow(<Price {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toHaveLength(1)
  })

  it("propagate change", () => {
    wrapper.simulate("change", {target: {value: props.value}})
    expect(props.onChange).toBeCalledWith("price", 0, false)
  })

  it("informs about pricing needed", () => {
    wrapper.setProps({
      error: {
        code:  "CUSTOM_PRICING_NEEDED",
        message: "message"
      },
      value: 0
    })
    wrapper.simulate("change", {target: {value: props.value}})
    expect(props.onChange).toBeCalledWith("price", 0, false)
  })

  it("correct props", () => {
    expect(wrapper.prop("label")).toBe("message")
    expect(wrapper.prop("error")).toBe(true)

    wrapper.setProps({error: null})
    expect(wrapper.prop("label")).toBe("Ár")
    expect(wrapper.prop("error")).toBe(false)
  })
})