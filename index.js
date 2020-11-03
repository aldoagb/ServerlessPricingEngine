/** 
  * @desc Bond pricing
  * @author Aldo
  * @required serverless-http.js, express.js, body-parser.js, bond.js, futures.js, option.js
*/

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');

const bond = require('./bond');
const futures = require('./futures')
const option = require('./option')

const app = express();

app.use(bodyParser.json({ strict: false }));

app.post('/bond', (req, res) => {

    let face_value = req.body.face_value;
    let coupon = req.body.coupon;
    let maturity = req.body.maturity;
    let frequency = req.body.frequency;
    let rate = req.body.rate;

    let value = bond.discrete_pv(face_value, coupon, maturity, frequency, rate);
    let ytm = bond.ytm((rate) => { return bond.discrete_pv(face_value, coupon, maturity, frequency, rate) }, rate);
    let modified_duration = bond.modified_duration((rate) => { return bond.discrete_pv(face_value, coupon, maturity, frequency, rate) }, rate, value);
    let duration = bond.duration((rate) => { return bond.discrete_pv(face_value, coupon, maturity, frequency, rate) }, rate, value);
    let macaulay_duration = bond.macaulay_duration((ytm) => { return bond.discrete_pv(face_value, coupon, maturity, frequency, ytm) }, ytm, value);
    let convexity = bond.convexity((rate) => { return bond.discrete_pv(face_value, coupon, maturity, frequency, rate) }, rate, value);

    res.json({ value: value, ytm: ytm, duration: duration, modified_duration: modified_duration, macaulay_duration: macaulay_duration, convexity: convexity });

})

app.post('/futures', (req, res) => {

    let spot = req.body.spot;
    let rate = req.body.rate;
    let time_to_maturity = req.body.time_to_maturity;

    let value = futures.value(spot, rate, time_to_maturity);

    res.json({ value: value });

})

app.post('/option', (req, res) => {

    let spot = req.body.spot;
    let strike = req.body.strike;
    let rate = req.body.rate;
    let volatility = req.body.volatility;
    let time_to_maturity = req.body.time_to_maturity;
    let cost_of_carry = req.body.cost_of_carry;
    let is_call = req.body.is_call;

    let value = option.value(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call);
    let delta = option.delta(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call);
    let gamma = option.gamma(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call);
    let theta = option.theta(spot, strike, rate, volatility, time_to_maturity, cost_of_carry, is_call);

    res.json({ value: value, delta: delta, gamma: gamma, theta: theta });

})

module.exports.handler = serverless(app);