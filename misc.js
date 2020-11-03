/** 
  * @desc Numerical differentiation
  * @author Aldo
  * @required -
*/

exports.numerical_diff = (f, x) => {
    const dx = 0.001
    return (f(x + dx) - f(x - dx)) / (2 * dx);
}

exports.so_numerical_diff = (f, x) => {
    const dx = 0.001
    return (f(x + dx) - 2 * f(x) + f(x - dx)) / (dx * dx);
}