class DominoSandbox {
    $timeout;

    ROTATE_MAX_SPEED = 10;
    ROTATE_STEP = 90;
    BASE_WIDTH = 100;

    dominoState = {
        firstPartType: null,
        secondPartType: null
    };
    dominoStyles = {};
    sandboxConfig = {
        rotateSpeed: 3,
        rotateState: 0,
        size: 10
    };

    static get $inject() { return ['$timeout']; }
    constructor($timeout) {
        this.$timeout = $timeout;
    }

    $onInit = () => {
        this.setDominoSizeStyles();
        this.setDominoRotateStyles();
        this.setDominoTransitionStyles();
    }

    resetDominoState = () => {
        this.dominoState = { firstPartType: null, secondPartType: null };
        // temporary turning off rotation animation by resetting transition styles
        this.setDominoTransitionStyles(true);
        this.sandboxConfig.rotateState = 0;
        this.setDominoRotateStyles();
        // returning rotation animation back after $digest cycle (that updated domino element styles in template)
        this.$timeout(() => this.setDominoTransitionStyles());
    }

    setDominoPartType = (type) => {
        if (!this.dominoState.firstPartType) {
            this.dominoState.firstPartType = type;
        } else if (!this.dominoState.secondPartType) {
            this.dominoState.secondPartType = type;
        }
    }

    rotateDomino = (isCounterClockwise) => {
        this.sandboxConfig.rotateState += isCounterClockwise ? -this.ROTATE_STEP : this.ROTATE_STEP;
        this.setDominoRotateStyles();
    }

    setDominoRotateStyles = () => {
        this.dominoStyles['-webkit-transform'] = 'rotate(' + this.sandboxConfig.rotateState + 'deg)';
        this.dominoStyles['-ms-transform'] = 'rotate(' + this.sandboxConfig.rotateState + 'deg)';
        this.dominoStyles.transform = 'rotate(' + this.sandboxConfig.rotateState + 'deg)';
    }

    setDominoSizeStyles = () => {
        this.dominoStyles.width = this.sandboxConfig.size / 10 * this.BASE_WIDTH + 'px';
        this.dominoStyles.height = this.sandboxConfig.size / 10 * this.BASE_WIDTH * 2 + 'px';
    }

    setDominoTransitionStyles = (isReset) => {
        const seconds = isReset ? 0 : (this.ROTATE_MAX_SPEED - this.sandboxConfig.rotateSpeed) / 10;
        this.dominoStyles['-webkit-transition-duration'] = seconds + 's';
        this.dominoStyles['-ms-transition-duration'] = seconds + 's';
        this.dominoStyles['transition-duration'] = seconds + 's';
    }
}

const DominoSandboxComponent = {
    selector: 'dominoSandbox',
    templateUrl: 'app/pages/dominoSandbox/domino-sandbox.html',
    controller: DominoSandbox
};

angular
    .module('dominoSandbox')
    .component(DominoSandboxComponent.selector, DominoSandboxComponent);