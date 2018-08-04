/**
 * Generates all the possible combination of children.
 * If there is an old price, it is not overriden, otherwise it is 0
 * @param {object} old the old node to check for existing prices
 * @param {number} maxChildren the maximum number of children
 * @returns {object} the new pricing, with preserved pricing from the previous state
 */

const childCombinations = (old, maxPeople, children) => {
    let combinations = {}
    let combination = Array(children).fill("6-12").join("_")
    const length = combination.length - 1
    combination = combination[length] === "_" ? combination.slice(0, length) : combination
    if (combination === "" && children === 0) {
        combinations = {
            name: `${maxPeople} felnőtt`,
            price: old.price || 0 
        }
    } else {
        combinations = old[combination] ? old[combination] : {
            price: 0,
            name: `${maxPeople} felnőtt, ${combination.split("_").length} gyerek (6-12)`
        }
    }
    return combinations
}


/**
 * Generates a price table for a room, without overriding previously set prices.
 * @param {object} old the old pricing
 * @param {number} maxPeople maximum number of adults
 */
const generatePrices = (old, maxPeople) => {
    let table = {}
    for (let adults = 1; adults <= maxPeople; adults++) {
        let adultGroup = {}
        for (let children = 0; children <= maxPeople - 1; children++) {
            if (adults+children <= maxPeople) {
                const oldPrice = old && old[adults] && old[adults][children] ? old[adults][children] : {}
                adultGroup[children] = childCombinations(oldPrice, adults, children)
            }
        }
        table[adults] = adultGroup
    }
    return table
}




module.exports.populatePrices = (change, context) => {
    const {roomId} = context.params
    const {maxPeople} = change.after.val()
    const priceTableRef = roomsRef.child(`${roomId}/prices/table`)
    const priceTypes = ["breakfast", "halfBoard"]
    const promises = priceTypes.map(priceType => 
        priceTableRef
          .child(priceType)
          .once("value", snap => snap.val())
      )
    return Promise
      .all(promises)
      .then(values => {
        return priceTableRef.set({
          "breakfast": generatePrices(values[0].val(), maxPeople),
          "halfBoard": generatePrices(values[1].val(), maxPeople)
        })
      })
  }