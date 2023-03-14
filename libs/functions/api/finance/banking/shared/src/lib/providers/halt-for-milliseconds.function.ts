/**
 * Used in cases when we want to pause for some time then proceed with function execution.
 *
 * @param n number of milliseconds to pause execution.
 * @warning Factor in Cloud function execution time when passing the number of milliseconds
 *
 */
export function _HaltForMiliseconds (n: number) {
  return new Promise((resolve,reject)=> {
    setTimeout(() => resolve(n), n);
  });
}
