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
    if(e.target != document.body)return;
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

let inf = document.querySelector('.info'),
editor_settings = {
    delta: 1,
}

canvas.addEventListener('mousemove', e => {
    inf.style.left = e.clientX + 5 + 'px';
    inf.style.top = e.clientY + 'px';
    if(keys.selecting)editor.selection.size = [(e.clientX - editor.map.position[0] - canvas.width/2) - editor.selection.position[0], (e.clientY - editor.map.position[1] - canvas.height/2) - editor.selection.position[1]];

    inf.innerText = `Mouse:(x:${(e.clientX - editor.map.position[0] - canvas.width/2) }; y:${(e.clientY - editor.map.position[1] - canvas.height/2) })
        Delta:${editor_settings.delta}
        ${keys.selecting?`Selected:(pos:(${JSON.stringify(editor.selection.position)}); size:(${JSON.stringify(editor.selection.size)}))`:''}
    `;
});

canvas.addEventListener('mousedown', e => {
    editor.selection.position = [e.clientX - editor.map.position[0] - canvas.width/2, e.clientY - editor.map.position[1] - canvas.height/2];
    editor.selection.size = [0,0];
    keys.selecting = true;
});

canvas.addEventListener('mouseup', e => {
    keys.selecting = false;
    // editor.selection.size = [e.clientX - editor.selection.position[0], e.clientY - editor.selection.position[1]];
})