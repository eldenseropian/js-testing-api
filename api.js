var TRANSLATIONS = {
    'for': 'ForStatement',
    'if': 'IfStatement',
    'break': 'BreakStatement',
    'continue': 'ContinueStatement',
    'return': 'ReturnStatement',
    'function': 'FunctionDeclaration'
};

/**
 * Convience method to allow shorthands instead of official parse statement
 *     names. If the provided name is a shorthand, returns the official version;
 *     otherwise returns the provided name. Note that all official names,
 *     regardless of whether they have shorthand available, will work as
 *     arguments to shouldHave, shouldNotHave, and shouldBeLike.
 * @param  {string} shorthand The name is get the official version of.
 * @return {string} The official version, or shorthand if it is not actually
 *     short for anything.
 */
function shorthandToOfficialName(shorthand) {
    if (TRANSLATIONS[shorthand] !== undefined) {
        return TRANSLATIONS[shorthand];
    }
    return shorthand;
}

function hasElse(AST) {
    return acorn.walk.findNodeAt(AST, null, null, function(nodeType, node) {
        return (nodeType === 'IfStatement' && node.alternate !== null);
    }) !== undefined;
}

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
    var AST = acorn.parse(code);

    for (var i = 0; i < whitelist.length; i++) {
        var eltToFind = shorthandToOfficialName(whitelist[i]);
        if (eltToFind === 'else') {
            if(!hasElse(AST)) {
                return false;
            }
        } else if (!acorn.walk.findNodeAt(AST, null, null, eltToFind)) {
            return false;
        }
    }
        
    return true;
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
    acorn.parse(code);
}

/**
 * Check whether code is roughly structured in a specified way.
 * For example, "There should be a 'for loop' and inside of it there should be
 *     an 'if statement'."
 * Checks whether sturcture hierarchies exist at any level in the tree; does
 *     not check distance between desired structures (i.e. supports
 *     is-ancestor-of but not is-parent-of).
 * @param {string} code The code to check.
 * @param {Object|string} structure An object represented the desired structure.
 *     Example: {'for': 'if'} checks if there is a 'for loop' that has an
 *         'if' statement somewhere inside it, possible within another
 *         construct. {'for': {'if' : 'while'}} would check for a 'for loop'
 *         containing an 'if' statement that contains a 'while' loop. See the
 *         unit tests for more examples. 'if' would check if there is an
 *         'if' statement and is equivalent to doing shouldHave(code, 'if').
 * @return {boolean} Whether the provided code conforms to the desired
 *     structure.
 * TODO: expand so you can use arrays to select siblings, e.g.
 * {'for': ['if', 'else']}
 */
function shouldBeLike(code, structure) {
    acorn.parse(code)
}