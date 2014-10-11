var EMPTY_CODE = '';
var COMMENT_ONLY = '// Hello world';
var BLOCK_COMMENT_ONLY = '/** Hello world */';
var IF = 'var x = 4;\nif (x > 4) {\n\tx++;\n}';
var IF_ELSE = IF + ' else {\n\tx -= 1;\n}';
var FOR_LOOP = 'var x = 0;\nfor (var i = 0; i < 5; i++) {\n\tx+=1;\n}';
var WHILE_LOOP = 'var x = 0;\nwhile(x < 5) {\nfor(var i = 0; i < 2; i++) ' +
    '{\nif (x > i) {\nbreak;\n}\n}\n}';
var x = 0;
var FUNCTION = 'var y = function() {\n' + IF_ELSE + '\n}';
var FUNCTION_WITH_ARGS = 'function myFunc(y, z) {\n\treturn y + z;\n}';

var programs = [
    EMPTY_CODE,
    COMMENT_ONLY,
    BLOCK_COMMENT_ONLY,
    IF,
    IF_ELSE,
    FOR_LOOP,
    WHILE_LOOP,
    FUNCTION,
    FUNCTION_WITH_ARGS
];

/*******************/
/* WHITELIST TESTS */
/*******************/

QUnit.test('empty whitelist', function(assert) {
    programs.forEach(function(program) {
        assert.ok(checker.shouldHave(program, []));
    });
});

QUnit.test('single whitelist item', function(assert) {
    assert.ok(checker.shouldHave(IF, ['if']));
    assert.ok(checker.shouldHave(IF_ELSE, ['if']));
    assert.ok(checker.shouldHave(IF_ELSE, ['else']));
    assert.equal(checker.shouldHave(FOR_LOOP, ['if']), false);
});

QUnit.test('multiple whitelist items', function(assert) {
    assert.ok(checker.shouldHave(IF_ELSE, ['if', 'else']));
    assert.ok(checker.shouldHave(FUNCTION_WITH_ARGS, ['function', 'return']));
    assert.equal(checker.shouldHave(IF, ['if', 'else']), false);
    assert.equal(checker.shouldHave(FOR_LOOP, ['if', 'else']), false);
});

/*******************/
/* BLACKLIST TESTS */
/*******************/

QUnit.test('empty blacklist', function(assert) {
    programs.forEach(function(program) {
        assert.ok(checker.shouldNotHave(program, []));
    });
});

QUnit.test('single blacklist item', function(assert) {
    assert.equal(checker.shouldNotHave(IF, ['if']), false);
    assert.equal(checker.shouldNotHave(IF_ELSE, ['if']), false);
    assert.equal(checker.shouldNotHave(IF_ELSE, ['else']), false);
    assert.ok(checker.shouldNotHave(FOR_LOOP, ['if']));
});

QUnit.test('multiple blacklist items', function(assert) {
    assert.equal(checker.shouldNotHave(IF_ELSE, ['if', 'else']), false);
    assert.equal(checker.shouldNotHave(IF_ELSE, ['for', 'else']), false);
    assert.equal(checker.shouldNotHave(IF_ELSE, ['else', 'return']), false);
    assert.equal(checker.shouldNotHave(FUNCTION_WITH_ARGS,
        ['function', 'return']), false);
    assert.equal(checker.shouldNotHave(IF, ['if', 'else']), false);
    assert.ok(checker.shouldNotHave(FOR_LOOP, ['if', 'else']));
});

/*******************/
/* STRUCTURE TESTS */
/*******************/

QUnit.test('empty structure', function(assert) {
    programs.forEach(function(program) {
        assert.ok(checker.shouldBeLike(program, {}));
    });
});

QUnit.test('single layer structure', function(assert) {
    assert.ok(checker.shouldBeLike(IF, 'if'));
    assert.ok(checker.shouldBeLike(IF_ELSE, 'if'));
    assert.ok(checker.shouldBeLike(IF_ELSE, 'else'));
    assert.equal(checker.shouldBeLike(FOR_LOOP, 'if'), false);
});

QUnit.test('nested structure', function(assert) {
    assert.ok(checker.shouldBeLike(WHILE_LOOP,
        {'while': {'for': {'if': 'break'}}}));
    assert.ok(checker.shouldBeLike(FUNCTION, {'function': 'if'}));
    assert.ok(checker.shouldBeLike(FUNCTION_WITH_ARGS, {'function': 'return'}));
    assert.equal(checker.shouldBeLike(IF_ELSE, {'if': 'else'}), false);
    assert.equal(checker.shouldBeLike(IF_ELSE, {'function': 'else'}), false);
});