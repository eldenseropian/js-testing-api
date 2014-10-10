/**
 * Check whether code contains whitelisted functionality.
 * For example, the ability to say "This program MUST use a 'for loop' and a
 *     'variable declaration'."
 * Only checks for the presence/absence of constructs; does not check for
 *     count (e.g. can't say "This program MUST use 2 'for loop's").
 * @param {string} code The code to check.
 * @param {Array.<string>} whitelist The constructs that must be present in the
 *     code. Constructs must be valid JavaScript reserved words.
 * @return {boolean} Whether the provided code has the desired functionality.
 */
function shouldHave(code, whitelist) {
    throw new Error('Not implemented yet');
}

/**
 * Check whether code does not contain blacklisted functionality.
 * For example, the ability to say "This program MUST NOT use a 'while loop' or
 *     an 'if statement'."
 * @param {string} code The code to check.
 * @param {Array.<string>} blacklist The constructs that must not be present in
 *     the code. Constructs must be valid JavaScript reserved words.
 * @return {boolean} Whether the provided code does not contain any of the
 *     blacklisted functionalities.
 */
function shouldNotHave(code, blacklist) {
    throw new Error('Not implemented yet');
}

/**
 * Check whether code is roughly structured in a specified way.
 * For example, "There should be a 'for loop' and inside of it there should be
 *     an 'if statement'."
 * Checks whether sturcture hierarchies exist at any level in the tree; does
 *     not check distance between desired structures (i.e. supports
 *     is-ancestor-of but not is-parent-of).
 * @param {string} code The code to check.
 * @param {Object} structure An object represented the desired structure.
 *     Example: {'for': 'if'} checks if there is a 'for loop' that has an
 *         'if' statement somewhere inside it, possible within another
 *         construct. {'for': {'if' : 'while'}} would check for a 'for loop'
 *         containing an 'if' statement that contains a 'while' loop. See the
 *         unit tests for more examples.
 * @return {boolean} Whether the provided code conforms to the desired
 *     structure.
 */
function structureShouldBeLike() {
    throw new Error('Not implemented yet');
}