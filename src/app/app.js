'use strict';

angular
    .module('itRex', [
        'ui.router',
        'ui.grid',
        'ui.grid.infiniteScroll',
        'dominoSandbox',
        'schoolGPA'
    ])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dominoSandbox');
    }]);
