import Symbol from 'es6-symbol'

/**
 * A unique key that identifies dispatched actions to be handled by the LP
 * Redux Api middleware. This is implemented as a Symbol, instead of a String
 * to guarantee uniqueness.
 * 
 * The params provided as the value include anything that is supported by
 * {@link middleware|LP Redux Api Middleware}
 * 
 * @constant
 * @type {Symbol}
 * @default
 * @example
 * 
 * // An example action creator
 * function fooAction () {
 *   return {
 *     [LP_API]: {
 *       url: 'http://foo.com/posts',
 *       requestAction: 'REQUEST', 
 *       successAction: 'SUCCESS', 
 *       failureAction: 'FAILURE',
 *     }
 *   }
 * } 
 */

const LP_API = Symbol('Lp Api')
export default LP_API
