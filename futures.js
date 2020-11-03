/** 
  * @desc Futures contract pricing
  * @author Aldo
  * @required -
*/

/**
  * @desc Value of a Futures contract
  * @param number spot - Spot price
  * @param number rate - Rate
  * @param number time_to_maturity - Time to maturity
  * @return number - Price
*/
exports.value = (spot, rate, time_to_maturity) => {
    return Math.exp(rate * time_to_maturity) * spot;
}