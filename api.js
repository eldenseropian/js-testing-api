var checker = (function() {
    var TRANSLATIONS = {
        'for': 'ForStatement',
        'while': 'WhileStatement',
        'if': 'IfStatement',
        'break': 'BreakStatement',
        'continue': 'ContinueStatement',
        'return': 'ReturnStatement',
        'function': ['FunctionDeclaration', 'FunctionExpression']
        // function x() --> FunctionDeclaration
        // var x = function() --> FunctionExpression
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
     * Find an element in the AST.
     * @param {String|Array.<String>} eltToFind The shorthand or full name of an
     *     element to find, or a list of equivalent element names.
     * @param {Node} AST The code to search.
     * @param {Number?} start  If provided, the location in code to start looking
     *     for eltToFind.
     * @return {Node|undefined} The found element, or undefined if it is not found.
     */
    function findElt(eltToFind, AST, start) {
        var s = start || null;

        var foundElt = undefined;
        if (eltToFind === 'else') {
            foundElt = acorn.walk.findNodeAfter(AST, s, function(nodeType, node) {
                return (nodeType === 'IfStatement' && node.alternate !== null);
            });
        } else if (eltToFind instanceof Array) {
            foundElt = acorn.walk.findNodeAfter(AST, s, function(nodeType) {
                return eltToFind.indexOf(nodeType) !== -1;
            });
        } else {
            foundElt = acorn.walk.findNodeAfter(AST, s, eltToFind);
        }
        return foundElt;
    }

     /**
     * Returns the result of calling shouldHave if the flag shouldHave is true,
     * otherwise returns the result of shouldNotHave. See their docs for more
     *     details.
     * @param  {String|Node} code The code to check.
     * @param  {Array.<String>} list The elements to check code for.
     * @param  {Boolean} shouldHave Whether list is a whitelist or blacklist.
     * @return {Boolean} Whether code conforms to list.
     */
    function checkList(code, list, shouldHave, start) {
        var s = start || null;

        var AST = code;
        if (typeof code === 'string') {
            AST = acorn.parse(code);
        }

        for (var i = 0; i < list.length; i++) {
            var eltToFind = shorthandToOfficialName(list[i]);
            var foundElt = findElt(eltToFind, AST, s);
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
     * @param {Number?} start If provided, the location in code to start looking
     *     for blacklisted functionalities.
     * @return {boolean} Whether the provided code has the desired functionality.
     */
    function shouldHave(code, whitelist, start) {
        var s = start || null;
        return checkList(code, whitelist, true, s);
    }

    /**
     * Check whether code does not contain blacklisted functionality.
     * For example, the ability to say "This program MUST NOT use a 'while loop' or
     *     an 'if statement'."
     * @param {String|Node} code The code to check.
     * @param {Array.<String>} blacklist The constructs that must not be present in
     *     the code. Constructs must be valid JavaScript reserved words.
     * @param {Number?} start If provided, the location in code to start looking
     *     for blacklisted functionalities.
     * @return {boolean} Whether the provided code does not contain any of the
     *     blacklisted functionalities.
     */
    function shouldNotHave(code, blacklist, start) {
        var s = start || null;
        return checkList(code, blacklist, false, s);
    }

    /**
     * Check whether code is roughly structured in a specified way.
     * For example, "There should be a 'for loop' and inside of it there should be
     *     an 'if statement'."
     * Checks whether sturcture hierarchies exist at any level in the tree; does
     *     not check distance between desired structures (i.e. supports
     *     is-ancestor-of but not is-parent-of).
     * @param {String} code The code to check.
     * @param {Object|String} structure The structure to find in code.
     *     Example: {'for': 'if'} checks if there is a 'for loop' that has an
     *         'if' statement somewhere inside it, possible within another
     *         construct. {'for': {'if' : 'while'}} would check for a 'for loop'
     *         containing an 'if' statement that contains a 'while' loop. See the
     *         unit tests for more examples. 'if' would check if there is an
     *         'if' statement and is equivalent to doing shouldHave(code, 'if').
     * @return {boolean} Whether the provided code conforms to the desired
     *     structure.
     * TODO: expand so you can use arrays to select siblings, e.g.
     *     {'for': ['if', 'else']}
     */
    function shouldBeLike(code, structure) {
        var AST = acorn.parse(code);
        return shouldBeLikeHelper(AST, structure, null);
    }

    /**
     * Recursive implementation of shouldBeLike.
     * @param {Node} AST The code to check.
     * @param {Object|String} structure The structure to find in AST.
     * @param {Number?} start The location in AST to start looking for structures.
     * @return {Boolean} Whether the AST conforms to structure.
     */
    function shouldBeLikeHelper(AST, structure, start) {
        var s = start || null;

        if (typeof structure === 'string') {
            return shouldHave(AST, [structure], s);
        }

        // Any code matches a structure with no constraints
        if (Object.keys(structure).length === 0) {
            return true;
        }

        var shorthandOfEltToFind = Object.keys(structure)[0];
        var eltToFind = shorthandToOfficialName(shorthandOfEltToFind);
        var foundNode = findElt(eltToFind, AST, s);
        if (foundNode === undefined) {
            return false;
        }

        return shouldBeLikeHelper(AST, structure[shorthandOfEltToFind],
            foundNode.node.start + 1);
    }

    return {
        shouldHave: shouldHave,
        shouldNotHave: shouldNotHave,
        shouldBeLike: shouldBeLike
    };
})();