/** 
  * @desc Bond pricing
  * @author Aldo
  * @required misc.js
*/

const misc = require("./misc");

/**
  * @desc Value of a bond
  * @param number face_value - Par value
  * @param number coupon - Coupon rate
  * @param number maturity - Time to maturity
  * @param number frequency - Coupon frequency
  * @param number rate - Discount rate
  * @return number - Price
*/
exports.discrete_pv = (face_value, coupon, maturity, frequency, rate) => {
    let pv = 0;

    for (let time_step = 1; time_step < maturity + 1; time_step = time_step + frequency) {
        pv = pv + (coupon * face_value) / ((1 + rate) ** time_step);

        if (time_step == maturity) {
            pv = pv + (face_value) / ((1 + rate) ** time_step);
        }
    }

    return pv;
}

/**
  * @desc YTM of a bond
  * @param function pv_r - B(rate)
  * @param number rate - Discount rate
  * @return number - Yield to maturity
*/
exports.ytm = (pv_r, rate) => {
    let ytm = 0.3;
    const iterations = 100;
    solve = (ytm) => { return pv_r(ytm) - pv_r(rate) }

    for (let iteration = 0; iteration < iterations; iteration++) {
        ytm = ytm - (solve(ytm) / misc.numerical_diff(solve, ytm));
    }

    return ytm;
}

/**
  * @desc Duration of a bond
  * @param function pv_r - B(rate)
  * @param number rate - Discount rate
  * @param number value - PV
  * @return number - Duration
*/
exports.duration = (pv_r, rate, value) => {
    return misc.numerical_diff(pv_r, rate) * (1 + rate) / value;
}

/**
  * @desc Mod. Duration of a bond
  * @param function pv_r - B(rate)
  * @param number rate - Discount rate
  * @param number value - PV
  * @return number - Duration
*/
exports.modified_duration = (pv_r, rate, value) => {
    return misc.numerical_diff(pv_r, rate) / value;
}

/**
  * @desc Mac. Duration of a bond
  * @param function pv_r - B(rate)
  * @param number rate - Discount rate
  * @param number value - PV
  * @return number - Duration
*/
exports.macaulay_duration = (pv_r, ytm, value) => {
    return misc.numerical_diff(pv_r, ytm) * (1 + ytm) / value;
}

/**
  * @desc Convexity of a bond
  * @param function pv_r - B(rate)
  * @param number rate - Discount rate
  * @param number value - PV
  * @return number - Convexity
*/
exports.convexity = (pv_r, rate, value) => {
    return misc.so_numerical_diff(pv_r, rate) / value;
}