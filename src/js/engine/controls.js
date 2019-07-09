const keys = {
    up: false,
    right: false,
    down: false,
    left: false,
    shift: false
};

document.addEventListener('keydown', e => {
    if (e.keyCode === 38 /* up */
        || e.keyCode === 87 /* w */
        || e.keyCode === 38)
        keys.up = true;
    if (e.keyCode === 39 /* right */
        || e.keyCode === 68 /* d */
        || e.keyCode === 39)
        keys.right = true;
    if (e.keyCode === 40 /* down */
        || e.keyCode === 83 /* s */
        || e.keyCode === 40)
        keys.down = true;
    if (e.keyCode === 37 /* left */
        || e.keyCode === 65 /* a */
        || e.keyCode === 37)
        keys.left = true;
    if (e.keyCode === 16)
        keys.shift = true;

    // if (e.keyCode === 27) {
    //     let ui = document.querySelector('.menu');
    //     window.running = ui.classList.contains('show');
    //     (ui.classList.contains('show')) ? (ui.classList.remove('show'),
    //         GameEngine.mainLoop.block = false) : (ui.classList.add('show'),
    //             GameEngine.mainLoop.block = true);
    // }
});

document.addEventListener('keyup', e => {
    if (e.keyCode === 38 /* up */
        || e.keyCode === 87 /* w */
        || e.keyCode === 38)
        keys.up = false;
    if (e.keyCode === 39 /* right */
        || e.keyCode === 68 /* d */
        || e.keyCode === 39)
        keys.right = false;
    if (e.keyCode === 40 /* down */
        || e.keyCode === 83 /* s */
        || e.keyCode === 40)
        keys.down = false;
    if (e.keyCode === 37 /* left */
        || e.keyCode === 65 /* a */
        || e.keyCode === 37)
        keys.left = false;
    if (e.keyCode === 16)
        keys.shift = false;
});

document.addEventListener('mousemove', e => {
    ge.player.angle = -(180 / Math.PI * Math.atan2(ge.player.x + ge.player.width / 2 - e.clientX, ge.player.y + ge.player.height / 2 - e.clientY));
});

// document.addEventListener('mousedown', e => GameEngine.shoot(e.clientX, e.clientY));

ge.loop.insertBackFunction(() => {
    let add = [
        ((keys.left?ge.player.stats.movement_speed:0) - (keys.right?ge.player.stats.movement_speed:0)) * (keys.shift?2:1),
        ((keys.up?ge.player.stats.movement_speed:0) - (keys.down?ge.player.stats.movement_speed:0)) * (keys.shift?2:1)
    ];
    ge.map.position = [ge.map.position[0] + add[0], ge.map.position[1] + add[1]];
});