const keys = {
    up: false,
    right: false,
    down: false,
    left: false,
    shift: false,
    ctrl: false,
    selecting: false
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
    if (e.keyCode === 16)keys.shift = true;
});

document.addEventListener('keyup', e => {
    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 38) keys.up = false;
    if (e.keyCode === 39 || e.keyCode === 68 || e.keyCode === 39) keys.right = false;
    if (e.keyCode === 40 || e.keyCode === 83 || e.keyCode === 40) keys.down = false;
    if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 37) keys.left = false;

    if (e.keyCode === 16)keys.shift = false;
    if (e.keyCode === 82)editor.map.load(editor.map_json);
    if(/Digit1/.test(e.code)){
        let index = parseInt(e.code.replace('Digit',''));
        if(keys.shift){
            localStorage.setItem('saved_map_' + index, JSON.stringify(editor.map_json));
        }else{
            editor.map_json = JSON.parse(localStorage.getItem('saved_map_' + index));
            editor.map.load(editor.map_json);
        }
    }
});

let speed = 25;

editor.loop.insertBackFunction(() => {
    editor.map.position = [
        editor.map.position[0] + ((keys.left?speed:0) - (keys.right?speed:0)),
        editor.map.position[1] + ((keys.up?speed:0) - (keys.down?speed:0))
    ];
});

let inf = document.querySelector('.info')

canvas.addEventListener('mousemove', e => {
    inf.style.left = e.clientX + 40 + 'px';
    inf.style.top = e.clientY + 'px';
    inf.innerHTML = `
        Mouse:(
            x:${(e.clientX - canvas.width/2) + editor.map.position[0]};
            y:${(e.clientY - canvas.height/2) + editor.map.position[1]})
    `;
    if(keys.selecting)editor.selection.size = [e.clientX - editor.selection.position[0], e.clientY - editor.selection.position[1]];
});

canvas.addEventListener('mousedown', e => {
    keys.selecting = true;
    editor.selection.position = [e.clientX, e.clientY];
    editor.selection.size = [0,0]
});

canvas.addEventListener('mouseup', e => {
    keys.selecting = false;
    editor.selection.size = [e.clientX - editor.selection.position[0], e.clientY - editor.selection.position[1]];
})