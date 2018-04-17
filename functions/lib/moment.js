// Init moment.js
const Moment = require('moment')
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment)
moment.locale("hu")

module.exports = moment