const NavHeaderComponent = {
    selector: 'navHeader',
    templateUrl: 'app/shared/navHeader/nav-header.html'
};

angular
    .module('itRex')
    .component(NavHeaderComponent.selector, NavHeaderComponent);