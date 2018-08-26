import moment from 'moment'


export const translateService = name => {
  const options = {
    cleanliness: "tisztaság",
    comfort: "kényelem",
    staff: "személyzet",
    services: "szolgáltatások",
    coffee: "kávé",
    food: "ételek"
  }
  return options[name] || Object.keys(options).filter(option => options[option] === name)[0]
}


/**
 * Calculate an average rating for a feedback
 * @param {object} ratings an object containing all the ratings
 * @return {number} a rounded number
 */
export const averageRating = ratings => {
  ratings = Object.values(ratings)
  return Number(((ratings
    .reduce((acc, num) => acc + num, 0))/ratings.length)
    .toFixed(2))
}

export const avgObjectsByKey = (...objs) =>
  objs.reduce((a, b) => {
    for (const k in b) {
      if (b.hasOwnProperty(k))
        a[k] = Number((((a[k] || 0) + b[k])/(a[k] ? 2 : 1)).toFixed(2))
    }
    return a
  }, {})

/**
 * NOTE: timestamp.toDate() when feedback Timestamp is fixed in Firestore
 * Filter an array of dates by an interval
 * @param {moment} start the start of the interval
 * @param {moment=} end end of the interval
 * @return {function} the filter function
 */
export const intervalFilter = (start, end) => ({timestamp}) =>
  moment(new Date(timestamp)).isBetween(start, end)

export const roomFilter = roomId => ({roomId: id}) => roomId === id

/**
 * @param {array} feedbacks array of feedbacks for the day
 * @return {object} the day data
 */
const dayAvg = feedbacks =>
  feedbacks
    .reduce((result, {ratings}) => {
      const avg = averageRating(ratings)
      return result ? averageRating({
        result,
        avg
      }) : avg
    }, null)


/*
 * export const mutateCategory = (feedbacks, start, interval) => {
 *   const halfWay = moment().subtract(moment().diff(start), "milliseconds")
 *   let prevFeedbacks = feedbacks.filter(intervalFilter(start, interval, halfWay))
 *   const lastFeedbacks = feedbacks.filter(intervalFilter(halfWay, interval, moment()))
 *   console.log(prevFeedbacks)
 *   prevFeedbacks = prevFeedbacks.reduce((result, {ratings}) => {
 *     const newResult = {}
 *     Object.entries(ratings).forEach(([key, value]) => {
 *       newResult[key] = result[key] ? averageRating({
 *         prev: result[key],
 *         value
 *       }) : value
 *     })
 *     return newResult
 *   }, {})
 *   console.log(prevFeedbacks)
 *   return ([])
 * }
 */


export const mutateCategory = (feedbacks, start, interval) => {
  feedbacks = feedbacks
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .filter(intervalFilter(start.clone().startOf(interval), moment()))
    .reduce((acc, {ratings}) => acc = avgObjectsByKey(ratings, acc), {})

  /*
   * const middle = Math.ceil(feedbacks.length)/2
   * const prevFeedbacks = feedbacks.slice(0, middle)
   *   .reduce((acc, {ratings}) => acc = avgObjectsByKey(ratings, acc), {})
   * const lastFeedbacks = feedbacks.slice(middle)
   *   .reduce((acc, {ratings}) => acc = avgObjectsByKey(ratings, acc), {})
   */

  return Object.entries(feedbacks).map(([name, value]) => ({
    name: translateService(name),
    value
    /*
     * prev: value,
     * now: prevFeedbacks[name]
     */
  }))
}


/**
 *  turns list into a dataset that AreaChart can consume
 * @param {array} list the list to mutate
 * @param {object} period start, end Date
 * @param {string} interval interval type
 * @return {array} the mutated dataset
 */
export const mutateAvg = (list, {start}, interval) => {
  let end = moment()
  if (start.clone().endOf(interval).isAfter(end)) {
    end = start.clone().endOf(interval)
  }
  return Array
    .from(moment
      .range(start, end)
      .by(interval))
    // get day averages
    .map(day => {
      const newList = list.filter(intervalFilter(day.clone().startOf(interval), day.clone().endOf(interval)))
      return ({
        "átlag": dayAvg(newList),
        name: day.format("MMM D")
      })
    })

}
