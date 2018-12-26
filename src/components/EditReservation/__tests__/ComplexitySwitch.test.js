import {ComplexitySwitch} from "../ComplexitySwitch"

describe("CopmlexitySwitch component", () => {
  const props = {
    checked: false,
    onChange: jest.fn()
  }
  const wrapper = shallow(<ComplexitySwitch {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toHaveLength(1)
  })

  it("correct label shown", () => {
    expect(wrapper.prop("label")).toBe("Egyszerű")
    wrapper.setProps({checked: true})
    expect(wrapper.prop("label")).toBe("Részletes")
  })
})