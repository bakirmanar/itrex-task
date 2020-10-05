const DominoComponent = {
    selector: 'domino',
    templateUrl: 'app/pages/dominoSandbox/domino/domino.html',
    bindings: {
        state: '='
    }
};

angular
    .module('dominoSandbox')
    .component(DominoComponent.selector, DominoComponent);