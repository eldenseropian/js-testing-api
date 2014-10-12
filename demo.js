function ctrl($scope) {
    $scope.code = 'var x = 0;\nif(x > 0) {\n\talert("Hello!");\n} else {\n\talert("World.");\n}';

    $scope.whitelist = ['for', 'if'];
    $scope.blacklist = ['else'];
    $scope.structure = '{"function": {"for": "if"}}';

    $scope.error = '';
    
    $scope.check = function() {
        var errors = [];
        var structure;
        if ($scope.structure.indexOf('{') !== -1) {
            try{
                structure = JSON.parse($scope.structure);
            } catch(e) {
                errors.push('Your structure is not valid JSON.');
                structure = {};
            }
        } else {
            structure = $scope.structure;
        }

        try {
            if (!checker.shouldHave($scope.code, $scope.whitelist)) {
                errors.push('Your code is missing an element from the whitelist.');
            }

            if (!checker.shouldNotHave($scope.code, $scope.blacklist)) {
                errors.push('Your code has an element from the blacklist.');
            }

            if (!checker.shouldBeLike($scope.code, structure)) {
                errors.push('Your code is not structured correctly.');
            }
        } catch (e) {
            errors.push('Your code is not syntatically correct.');
        }
        return errors;
    }
}