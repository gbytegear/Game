let testSpeed = 2;

customElements.define('game-controller',

    class GameController extends HTMLBodyElement {
        constructor() {
            super();

            this.playerPosition = { x: 0, y: 0 };
        }

        connectedCallback() {
            if (window.gameController) return this.remove();
            window.gameController = this;

            this.startKeyEventLoop();
        }

        startKeyEventLoop() {
            let up = false,
                right = false,
                down = false,
                left = false,
                loop = undefined;
            document.addEventListener('keydown', press)
            function press(e) {
                if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = true;
                if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = true;
                if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = true;
                if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = true;
                if(!loop)loop = setInterval(movementLoop, 1);
            }
            document.addEventListener('keyup', release)
            function release(e) {
                if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = false;
                if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = false;
                if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = false;
                if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = false;
                if(!(up || right || down || left)){
                    clearInterval(loop);
                    loop = undefined;
                }
            }
            const movementLoop = async () => {
                if (up) this.playerPosition.y -= testSpeed;
                if (right) this.playerPosition.x += testSpeed;
                if (down) this.playerPosition.y += testSpeed;
                if (left) this.playerPosition.x -= testSpeed;
                this.area.move(this.playerPosition.x, this.playerPosition.y);
            }
        }
    }

    , { extends: 'body' });


// customElements.define("fps-viewer", class FpsView{
//     constructor(){
//         super();
//         var lastLoop = new Date();
//         function gameLoop() { 
//             var thisLoop = new Date();
//             var fps = 1000 / (thisLoop - lastLoop);
//             lastLoop = thisLoop;
//         }
//     }
// })