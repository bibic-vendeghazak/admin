// Init moment.js
import moment from "moment"
import { extendMoment } from "moment-range"
moment.locale("hu")
export default extendMoment(moment)