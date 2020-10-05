'use strict';

angular
    .module('dominoSandbox', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('dominoSandbox', {
            url: '/dominoSandbox',
            template: '<domino-sandbox></domino-sandbox>'
        });
    }])