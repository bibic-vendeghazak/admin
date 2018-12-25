import {Address} from "../Address"
import {TextField} from "@material-ui/core"

describe("Address component", () => {
  const props = {
    value: "value",
    onChange: jest.fn()
  }
  const wrapper = shallow(<Address {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toHaveLength(1)
  })

  it("handles change", () => {
    const typedValue = "typed value"
    wrapper.find(TextField).simulate("change", {target: {value: typedValue}})
    expect(props.onChange).toBeCalledWith("address", typedValue, false)
  })

  it("value is propagated", () => {
    expect(wrapper.find(TextField).prop("value")).toBe(props.value)
  })

  it("autocomplete address", () => {
    expect(wrapper.find(TextField).prop("autoComplete")).toBe("address")
  })
})