var EMPTY_CODE = '';
var COMMENT_ONLY = '// Hello world';
var BLOCK_COMMENT_ONLY = '/** Hello world */';
var IF = 'var x = 4;\nif (x > 4) {\n\tx++;\n}';
var IF_ELSE = IF + ' else {\n\tx -= 1;\n}';
var FOR_LOOP = 'var x = 0;\nfor (var i = 0; i < 5; i++) {\n\tx+=1;\n}';
var WHILE_LOOP = 'var x = 0;\nwhile(x < 5) {\nfor(var i = 0; i < 2; i++) {\nif (x > i) {\nreturn true;\n}\n}\n}';
var x = 0;
var FUNCTION = 'function() {\n' + IF_ELSE + '\n}';
var FUNCTION_WITH_ARGS = 'function(y, z) {\n\treturn y + z;\n}';

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
        assert.ok(shouldHave(program, []));
    });
});

QUnit.test('single whitelist item', function(assert) {
    assert.ok(shouldHave(IF, ['if']));
    assert.ok(shouldHave(IF_ELSE, ['if']));
    assert.ok(shouldHave(IF_ELSE, ['else']));
    assert.ok(!shouldHave(FOR_LOOP, ['if']));
});

QUnit.test('multiple whitelist items', function(assert) {
    assert.ok(shouldHave(IF_ELSE, ['if', 'else']));
    assert.ok(shouldHave(FUNCTION_WITH_ARGS, ['function', 'return']));
    assert.ok(!shouldHave(IF, ['if', 'else']));
    assert.ok(!shouldHave(FOR_LOOP, ['if', 'else']));
});

/*******************/
/* BLACKLIST TESTS */
/*******************/

QUnit.test('empty blacklist', function(assert) {
    programs.forEach(function(program) {
        assert.ok(shouldNotHave(program, []));
    });
});

QUnit.test('single blacklist item', function(assert) {
    assert.ok(!shouldNotHave(IF, ['if']));
    assert.ok(!shouldNotHave(IF_ELSE, ['if']));
    assert.ok(!shouldNotHave(IF_ELSE, ['else']));
    assert.ok(shouldNotHave(FOR_LOOP, ['if']));
});

QUnit.test('multiple blacklist items', function(assert) {
    assert.ok(!shouldNotHave(IF_ELSE, ['if', 'else']));
    assert.ok(!shouldNotHave(IF_ELSE, ['for', 'else']));
    assert.ok(!shouldNotHave(IF_ELSE, ['else', 'return']));
    assert.ok(!shouldNotHave(FUNCTION_WITH_ARGS, ['function', 'return']));
    assert.ok(!shouldNotHave(IF, ['if', 'else']));
    assert.ok(shouldNotHave(FOR_LOOP, ['if', 'else']));
});

/*******************/
/* STRUCTURE TESTS */
/*******************/

QUnit.test('empty structure', function(assert) {
    programs.forEach(function(program) {
        assert.ok(shouldBeLike(program, {}));
    });
});

QUnit.test('single layer structure', function(assert) {
    assert.ok(shouldBeLike(IF, 'if'));
    assert.ok(shouldBeLike(IF_ELSE, 'if'));
    assert.ok(shouldBeLike(IF_ELSE, 'else'));
    assert.ok(!shouldBeLike(FOR_LOOP, 'if'));
});

QUnit.test('nested structure', function(assert) {
    assert.ok(shouldBeLike(WHILE_LOOP, {'while': {'for': {'if': 'return'}}}));
    assert.ok(shouldBeLike(FUNCTION, {'function': 'if'}));
    assert.ok(shouldBeLike(FUNCTION_WITH_ARGS, {'function': 'return'}));
    assert.ok(!shouldBeLike(IF_ELSE, {'if': 'else'}));
});