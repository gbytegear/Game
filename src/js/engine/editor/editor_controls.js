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
    if (e.keyCode === 82)editor.map.load(editor.map_json);
});

let speed = 25;

editor.loop.insertBackFunction(() => {
    editor.map.position = [
        editor.map.position[0] + ((keys.left?speed:0) - (keys.right?speed:0)),
        editor.map.position[1] + ((keys.up?speed:0) - (keys.down?speed:0))
    ];
});

// document.addEventListener('mousemove', e => {
//     ge.player.angle = -(180 / Math.PI * Math.atan2(ge.player.x + ge.player.width / 2 - e.clientX, ge.player.y + ge.player.height / 2 - e.clientY));
// });