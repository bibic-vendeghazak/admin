import moment from "../moment"


describe("moment", () => {
  it("extended with moment-range", () => {
    expect(moment.range).not.toBe(undefined)
  })

  it("locale is Hungarian", () => {
    expect(moment.locale()).toBe("hu")
  })
})