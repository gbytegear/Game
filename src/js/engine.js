customElements.define('game-controller',

    class GameController extends HTMLBodyElement {
        constructor() {
            super();
        }

        connectedCallback() {
            if (window.gameController) return this.remove();
            window.gameController = this;

            this.ui = document.createElement('game-ui');
            this.appendChild(this.ui);

            this.startKeyEventLoop();
        }

        startKeyEventLoop() {
            let up = false,
                right = false,
                down = false,
                left = false,
                x = 0,
                y = 0;
            document.addEventListener('keydown', press)
            function press(e) {
                if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = true;
                if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = true;
                if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = true;
                if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = true;
            }
            document.addEventListener('keyup', release)
            function release(e) {
                if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = false;
                if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = false;
                if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = false;
                if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = false;
            }
            const movementLoop = () => {
                if (up) y = y - 10;
                if (right) x = x + 10;
                if (down) y = y + 10;
                if (left) x = x - 10;
                // console.log("a");
                return window.requestAnimationFrame(movementLoop);
            }
            window.requestAnimationFrame(movementLoop);
        }
    }

    , { extends: 'body' });