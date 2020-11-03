/** 
  * @desc Option pricing
  * @author Aldo
  * @required gaussian.js, misc.js
*/

const gaussian = require('gaussian');
const distribution = gaussian(0, 1);
const misc = require("./misc");


/**
  * @desc Value of an option
  * @param number spot - Spot price
  * @param number strike - Strike price
  * @param number rate - Rate
  * @param number volatility - Constant volatility
  * @param number time_to_maturity - Time to maturity
  * @param number cost_of_carry - Cost of carry
  * @param bool is_call - Is Call? (Or put)
  * @return number - Price
*/
exports.value = (spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) => {

    const temp = volatility * Math.sqrt(time_to_maturity);

    const d1 = (Math.log(spot / strike) + (cost_of_carry + (Math.pow(volatility, 2) / 2)) * time_to_maturity) / temp;

    const Nd1 = distribution.cdf((is_call ? 1 : - 1) * d1);

    const d2 = d1 - temp;

    const Nd2 = distribution.cdf((is_call ? 1 : - 1) * d2);

    const SebrT = spot * Math.exp((cost_of_carry - rate) * time_to_maturity);

    const KerT = strike * Math.exp(- rate * time_to_maturity);

    return (is_call ? 1 : - 1) * SebrT * Nd1 - (is_call ? 1 : - 1) * KerT * Nd2;
}

/**
  * @desc Delta of an option
  * @param number spot - Spot price
  * @param number strike - Strike price
  * @param number rate - Rate
  * @param number volatility - Constant volatility
  * @param number time_to_maturity - Time to maturity
  * @param number cost_of_carry - Cost of carry
  * @param bool is_call - Is Call? (Or put)
  * @return number - Delta
*/
exports.delta = (spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) => {
    return misc.numerical_diff((spot) => { return this.value(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) }, spot);
}

/**
  * @desc Gamma of an option
  * @param number spot - Spot price
  * @param number strike - Strike price
  * @param number rate - Rate
  * @param number volatility - Constant volatility
  * @param number time_to_maturity - Time to maturity
  * @param number cost_of_carry - Cost of carry
  * @param bool is_call - Is Call? (Or put)
  * @return number - Gamma
*/
exports.gamma = (spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) => {
    return misc.so_numerical_diff((spot) => { return this.value(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) }, spot);
}

/**
  * @desc Theta of an option
  * @param number spot - Spot price
  * @param number strike - Strike price
  * @param number rate - Rate
  * @param number volatility - Constant volatility
  * @param number time_to_maturity - Time to maturity
  * @param number cost_of_carry - Cost of carry
  * @param bool is_call - Is Call? (Or put)
  * @return number - Theta
*/
exports.theta = (spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) => {
    return misc.numerical_diff((time_to_maturity) => { return this.value(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call) }, time_to_maturity);
}