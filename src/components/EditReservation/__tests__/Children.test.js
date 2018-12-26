import {Children} from "../Children"
import {Grid, TextField} from "@material-ui/core"
describe("Children component", () => {
  const props = {
    values: [{name: "name", count: 1}],
    onChange: jest.fn()
  }
  const wrapper = shallow(<Children {...props}/>)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("custom values", () => {
    it("renders correctly", () => {
      expect(wrapper.find(Grid)).toHaveLength(1)
    })

    it("change propagates", () => {
      wrapper.find(TextField).first().simulate("change", {target: {name: "name", value: "1"}})
      expect(props.onChange).toBeCalledWith("children", [{name: "name", count: 1}], true)
      wrapper.find(TextField).first().simulate("change", {target: {name: "name", value: null}})
      expect(props.onChange).toBeCalledWith("children", [{name: "name", count: 0}], true)
      wrapper.find(TextField).first().simulate("change", {target: {name: "name", value: -1}})
      expect(props.onChange).toBeCalledWith("children", [{name: "name", count: 0}], true)
    })
  })

  describe("default values", () => {
    it("renders correctly", () => {
      wrapper.setProps({values: []})
      expect(wrapper.find(Grid)).toHaveLength(2)
    })

    it.skip("change propagates", () => {
      wrapper.find(TextField).first().simulate("change", {target: {name: "0-6", value: ""}})
      expect(props.onChange).toBeCalledWith("children", [{name: "0-6", count: 0}], true)
    })

  })


})