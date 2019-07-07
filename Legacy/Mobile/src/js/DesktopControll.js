
document.addEventListener('keydown', e => {
    if (e.keyCode === 38 /* up */
        || e.keyCode === 87 /* w */
        || e.keyCode === 38)
        GameEngine.controllerButtons.up = true;
    if (e.keyCode === 39 /* right */
        || e.keyCode === 68 /* d */
        || e.keyCode === 39)
        GameEngine.controllerButtons.right = true;
    if (e.keyCode === 40 /* down */
        || e.keyCode === 83 /* s */
        || e.keyCode === 40)
        GameEngine.controllerButtons.down = true;
    if (e.keyCode === 37 /* left */
        || e.keyCode === 65 /* a */
        || e.keyCode === 37)
        GameEngine.controllerButtons.left = true;
    if (e.keyCode === 16)
        GameEngine.controllerButtons.shift = true;

    if (e.keyCode === 27) {
        let ui = document.querySelector('.menu');
        window.running = ui.classList.contains('show');
        (ui.classList.contains('show')) ? (ui.classList.remove('show'),
            GameEngine.mainLoop.block = false) : (ui.classList.add('show'),
                GameEngine.mainLoop.block = true);
    }
});

document.addEventListener('keyup', e => {
    if (e.keyCode === 38 /* up */
        || e.keyCode === 87 /* w */
        || e.keyCode === 38)
        GameEngine.controllerButtons.up = false;
    if (e.keyCode === 39 /* right */
        || e.keyCode === 68 /* d */
        || e.keyCode === 39)
        GameEngine.controllerButtons.right = false;
    if (e.keyCode === 40 /* down */
        || e.keyCode === 83 /* s */
        || e.keyCode === 40)
        GameEngine.controllerButtons.down = false;
    if (e.keyCode === 37 /* left */
        || e.keyCode === 65 /* a */
        || e.keyCode === 37)
        GameEngine.controllerButtons.left = false;
    if (e.keyCode === 16)
        GameEngine.controllerButtons.shift = false;
});

document.addEventListener('mousemove', e => {
    GameEngine.player.angle = -(180 / Math.PI * Math.atan2(GameEngine.player.rootElement.x + GameEngine.player.rootElement.width / 2 - e.clientX, GameEngine.player.rootElement.y + GameEngine.player.rootElement.height / 2 - e.clientY));
});

document.addEventListener('mousedown', e => GameEngine.shoot(e.clientX, e.clientY));