const DominoPartComponent = {
    selector: 'dominoPart',
    templateUrl: 'app/pages/dominoSandbox/dominoPart/domino-part.html'
};

angular
    .module('dominoSandbox')
    .component(DominoPartComponent.selector, DominoPartComponent);