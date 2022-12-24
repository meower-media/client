/**
 * @file ZZZzzz...
 */

/**
 * Sleep for a certain amount of milliseconds.
 * @param {number} ms
 * @returns {Promise}
 */
export default function (ms) {
	return new Promise(r => setTimeout(r, ms));
}
