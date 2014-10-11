var TRANSLATIONS = {
    'for': 'ForStatement',
    'while': 'WhileStatement',
    'if': 'IfStatement',
    'break': 'BreakStatement',
    'continue': 'ContinueStatement',
    'return': 'ReturnStatement',
    'function': ['FunctionDeclaration', 'FunctionExpression']
};

/**
 * Convience method to allow shorthands instead of official parse statement
 *     names. If the provided name is a shorthand, returns the official version;
 *     otherwise returns the provided name. Note that all official names,
 *     regardless of whether they have shorthand available, will work as
 *     arguments to shouldHave, shouldNotHave, and shouldBeLike.
 * @param  {String} shorthand The name is get the official version of.
 * @return {String} The official version, or shorthand if it is not actually
 *     short for anything.
 */
function shorthandToOfficialName(shorthand) {
    if (TRANSLATIONS[shorthand] !== undefined) {
        return TRANSLATIONS[shorthand];
    }
    return shorthand;
}

/**
 * 'Else's have to be handled differently because they're not their own
 * statement, but a property of an IfStatement.
 * @param  {Node} AST The AST to search for an else statement.
 * @param {Number?} start The offset to start looking for the else.
 * @return {Node} The else node, or undefined if the tree does not have one.
 */
function findElse(AST, start) {
    console.log('finding else', AST, start);
    var s = start || null;
    var e = start || null;
    return acorn.walk.findNodeAfter(AST, s, function(nodeType, node) {
        return (nodeType === 'IfStatement' && node.alternate !== null);
    });
}

/**
 * Returns shouldHave if shouldHave is true, otherwise performs shouldNotHave
 * (see their docs for more details).
 * @param  {String|Node} code The code to check.
 * @param  {Array.<String>} list The elements to check code for.
 * @param  {Boolean} shouldHave Whether list is a whitelist or blacklist.
 * @return {Boolean} Whether code conforms to list.
 */
function checkList(code, list, shouldHave, start) {
    console.log('checking list', code, list, shouldHave, start);
    var s = start || null;

    var AST = code;
    if (typeof code === 'string') {
        AST = acorn.parse(code);
    }

    for (var i = 0; i < list.length; i++) {
        var eltToFind = shorthandToOfficialName(list[i]);
        var foundElt = undefined;
        if (eltToFind === 'else') {
            foundElt = findElse(AST, s);
        } else if (eltToFind instanceof Array) {
            foundElt = acorn.walk.findNodeAfter(AST, s, function(nodeType) {
                return eltToFind.indexOf(nodeType) !== -1;
            });
        } else {
            foundElt = acorn.walk.findNodeAfter(AST, s, eltToFind);
        }
        if (foundElt && !shouldHave || !foundElt && shouldHave) {
            return false;
        }
    }
    return true;
}

/**
 * Check whether code contains whitelisted functionality.
 * For example, the ability to say "This program MUST use a 'for loop' and a
 *     'variable declaration'."
 * Only checks for the presence/absence of constructs; does not check for
 *     count (e.g. can't say "This program MUST use 2 'for loop's").
 * @param {String|Node} code The code to check.
 * @param {Array.<String>} whitelist The constructs that must be present in the
 *     code. Constructs must be valid JavaScript reserved words.
 * @return {boolean} Whether the provided code has the desired functionality.
 */
function shouldHave(code, whitelist, start) {
    return checkList(code, whitelist, true, start);
}

/**
 * Check whether code does not contain blacklisted functionality.
 * For example, the ability to say "This program MUST NOT use a 'while loop' or
 *     an 'if statement'."
 * @param {String|Node} code The code to check.
 * @param {Array.<String>} blacklist The constructs that must not be present in
 *     the code. Constructs must be valid JavaScript reserved words.
 * @return {boolean} Whether the provided code does not contain any of the
 *     blacklisted functionalities.
 */
function shouldNotHave(code, blacklist, start) {
    return checkList(code, blacklist, false, start);
}

/**
 * Check whether code is roughly structured in a specified way.
 * For example, "There should be a 'for loop' and inside of it there should be
 *     an 'if statement'."
 * Checks whether sturcture hierarchies exist at any level in the tree; does
 *     not check distance between desired structures (i.e. supports
 *     is-ancestor-of but not is-parent-of).
 * @param {String} code The code to check.
 * @param {Object|String} structure An object represented the desired structure.
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
    console.log("DOING", code, structure);
    var AST = acorn.parse(code);
    return shouldBeLikeHelper(AST, structure, null, null);
}

function shouldBeLikeHelper(AST, structure, start) {
    console.log('starting with', AST, structure, start);
    if (typeof structure === 'string') {
        return shouldHave(AST, [structure], start);
    }

    if (Object.keys(structure).length === 0) {
        return true;
    }

    var topElt = Object.keys(structure)[0];
    var eltToFind = shorthandToOfficialName(topElt);
    var topEltNode = undefined;

    if (eltToFind === 'else') {
        topEltNode = findElse(AST, start);
    } else if (eltToFind instanceof Array) {
        topEltNode = acorn.walk.findNodeAfter(AST, start, function(nodeType) {
            return eltToFind.indexOf(nodeType) !== -1;
        });
    } else {
        topEltNode = acorn.walk.findNodeAfter(AST, start, eltToFind);
    }

    if (topEltNode === undefined) {
        return false;
    }

    var restElts = structure[topElt];
    console.log(topEltNode);
    return shouldBeLikeHelper(AST, restElts, topEltNode.node.start + 1);
}