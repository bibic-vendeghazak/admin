import {Adults} from "../Adults"
describe("Adults component", () => {
  const props = {
    value: "1",
    onChange: jest.fn()
  }
  const wrapper = shallow(<Adults {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toHaveLength(1)
  })

  it("change is propagated", () => {
    wrapper.simulate("change", {target: {value: props.value}})
    expect(props.onChange).toBeCalledWith("adults", 1, true)
    expect(wrapper.prop("value")).toBe(props.value)
    wrapper.setProps({value: null})
    wrapper.simulate("change", {target: {value: null}})
    expect(props.onChange).toBeCalledWith("adults", 1, true)
    expect(wrapper.prop("value")).toBe("")
  })

  it("minimum 1 adult", () => {
    expect(wrapper.prop("min")).toBe(1)
  })
})