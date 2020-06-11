"strict mode"

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
    if(e.target != document.body)return;
    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 38) keys.up = false;
    if (e.keyCode === 39 || e.keyCode === 68 || e.keyCode === 39) keys.right = false;
    if (e.keyCode === 40 || e.keyCode === 83 || e.keyCode === 40) keys.down = false;
    if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 37) keys.left = false;

    if (e.keyCode === 16)keys.shift = false;
    if (e.keyCode === 82){
        editor.map.load(editor.map_json);
        document.querySelector('json-editor').reload();
    }
    if(/Digit/.test(e.code)){
        let index = parseInt(e.code.replace('Digit',''));
        if(keys.shift){
            localStorage.setItem('saved_map_' + index, JSON.stringify(editor.map_json));
        }else{
            editor.map_json = JSON.parse(localStorage.getItem('saved_map_' + index));
            editor.map.load(editor.map_json);
            document.querySelector('json-editor').reload();
        }
    }
});

let speed = 25;

editor.loop.insert(() => {
    editor.map.position = [
        editor.map.position[0] + ((keys.left?speed:0) - (keys.right?speed:0)),
        editor.map.position[1] + ((keys.up?speed:0) - (keys.down?speed:0))
    ];
});

let inf = document.querySelector('.info'),
editor_settings = {
    delta: .1,
}

canvas.addEventListener('mousemove', e => {
    inf.style.left = e.clientX + 5 + 'px';
    inf.style.top = e.clientY + 'px';
    if(keys.selecting)
        editor.selection.size = [
            Math.round((
                (e.clientX - editor.map.position[0] - canvas.width/2) - editor.selection.position[0]
                ) / (editor_settings.delta*10)) * (editor_settings.delta*10),
            Math.round((
                (e.clientY - editor.map.position[1] - canvas.height/2) - editor.selection.position[1]
                ) / (editor_settings.delta*10)) * (editor_settings.delta*10)
        ];

    inf.innerText = `Mouse:{x:${(e.clientX - editor.map.position[0] - canvas.width/2) }; y:${(e.clientY - editor.map.position[1] - canvas.height/2) }},
        Position:{x:${editor.map.position[0]}; y:${editor.map.position[1]}}
        Delta:${editor_settings.delta}
        ${(editor.selection.size[0] != 0 && editor.selection.size[1] != 0)?`Selected:(pos:(${JSON.stringify(editor.selection.position)}); size:(${JSON.stringify(editor.selection.size)}))`:''}
    `;
});

canvas.addEventListener('mousedown', e => {
    editor.selection.position = [
        Math.round((e.clientX - editor.map.position[0] - canvas.width/2) / (editor_settings.delta*10)) * (editor_settings.delta*10),
        Math.round((e.clientY - editor.map.position[1] - canvas.height/2) / (editor_settings.delta*10)) * (editor_settings.delta*10)
    ];
    editor.selection.size = [0,0];
    keys.selecting = true;
});

canvas.addEventListener('mouseup', e => {
    keys.selecting = false;
    editor.selection.size = [
        Math.round(((e.clientX - editor.map.position[0] - canvas.width/2) - editor.selection.position[0]) / (editor_settings.delta*10)) * (editor_settings.delta*10),
        Math.round(((e.clientY - editor.map.position[1] - canvas.height/2) - editor.selection.position[1]) / (editor_settings.delta*10)) * (editor_settings.delta*10)
    ];
    if(editor.selection.width < 0){
        editor.selection.x = editor.selection.x + editor.selection.width;
        editor.selection.width = -editor.selection.width;
    }
    if(editor.selection.height < 0){
        editor.selection.y = editor.selection.y + editor.selection.height;
        editor.selection.height = -editor.selection.height;
    }
})




















//CLI
HTMLDataListElement.prototype.containsValue = function(value){
    for(let option of this.children)
        if(option.value == value)return true;
    return false;
}

const cli = new class CommandLineinterface {
    constructor(){
        Object.defineProperties(this, {
            loadMap: {
               value: async function(name) {
                   let json_map = JSON.parse(localStorage[name])
                   window.editor.map.load(json_map);
                   window.editor.map_json = json_map;
                   document.querySelector("json-editor").load(window.editor.map_json);
                   },
               enumerable: true,
               writable: false
            },

            addObj:{
                value: async function(to, properties = {}){
                    properties.position = editor.selection.position;
                    properties.size = editor.selection.size;
                    editor.map_json[to].push(properties);
                    editor.map.load(editor.map_json);
                    document.querySelector('json-editor').reload();
                },
                enumerable: true,
                writable: false
            },
            addTl:{
                value: async function(src = 'transparent'){
                    let tile = new Object;
                    tile.from = [editor.selection.position[0] / 100, editor.selection.position[1] / 100];
                    tile.to = [editor.selection.size[0] / 100 + tile.from[0], editor.selection.size[1] / 100 + tile.from[1]];
                    tile.src = src;
                    editor.map_json.tiles.range_tiles.push(tile);
                    editor.map.load(editor.map_json);
                    document.querySelector('json-editor').reload();
                },
                enumerable: true,
                writable: false
            },
            setDefTl:{
                value: async function(src = "transparent"){
                    editor.map_json.tiles.default_tile = src;
                    editor.map.load(editor.map_json);
                    document.querySelector('json-editor').reload();
                },
                enumerable: true,
                writable: false
            },
            setPos:{
                value: async function(pos = [0,0]){
                    editor.map.position = pos;
                },
                enumerable: true,
                writable: false
            },
            setDelta:{
                value: async function(delta){editor_settings.delta = delta;},
                enumerable: true,
                writable: false
            },
            addAct: {
                value: async function(fx){},
                enumerable: true,
                writable: false
            }
        });

        for(let command in this){
            let element = document.createElement('option');
            element.value = 'this.' + command;
            
            commands.appendChild(element);
            if(typeof(this[command]) == 'function')element.value += '()';
        }

        document.querySelector('.command-line').addEventListener('keyup', e => (()=>{
            if (e.keyCode !== 13)return;

            const tile_src = './src/img/tiles/';

            try{
                eval(e.target.value);
                if(!commands.containsValue(e.target.value)){
                    let element = document.createElement('option');
                    element.value = e.target.value;
                    commands.appendChild(element);
                }
                e.target.value = "";
            }catch(err){
                alert(err);
                console.error(err);
            }
        })())
    }
}