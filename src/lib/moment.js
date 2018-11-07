import moment from "moment"
import "moment/locale/hu"
import {extendMoment} from "moment-range"

/*
* This file is related to moment.js
 * Hungarian locale added
 * Extending moment.js with moment-range
 */

export default extendMoment(moment)

export const TODAY = moment().startOf("day")
export const TOMORROW = TODAY.clone().add(1, "day")