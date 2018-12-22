import React from "react"
import {
  configure, mount, shallow
} from "enzyme"
import Adapter from "enzyme-adapter-react-16"
configure({adapter: new Adapter()})
import {moment} from "./utils"
import hu from "./lang/hu"

/**
 * make these available without needing to import them every time in tests
 * @see https://youtu.be/uo0psyTxgQM?t=903
 */
global.React = React
global.mount = mount
global.shallow = shallow
global.moment = moment
global.hu = hu