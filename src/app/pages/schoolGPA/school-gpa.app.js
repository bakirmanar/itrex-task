'use strict';

angular
    .module('schoolGPA', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('schoolGPA', {
            url: '/schoolGPA',
            template: '<school-gpa></school-gpa>'
        });
    }]);