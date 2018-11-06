import {toRoute} from "../routes"


describe("toRoutes", () => {
  it("combine parts", () => {
    expect(toRoute("one", "two")).toBe("one/two")
  })
})