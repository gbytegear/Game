const position = { x: 0, y: 0 };

let mapObject = {
    tiles: {
        defaultTile: "./src/img/tiles/grass1.jpg",
        rangeTiles: [],
    },
    background: [],
    solid: [],
    foreground: [],
};

let selectionArea = CanvasObjectModel.createElement('item', { anchors: { position: "center" } }),
    selection = CanvasObjectModel.createElement('rectangle', { color: "#fff4" }),
    selecting = false;

selectionArea.insert(selection);

let mainLoop = new class {
    constructor() {
        let functionStack = new Array,
            block = true,
            loop = () => ((!block) ? (functionStack.forEach(func => func())) : undefined, window.requestAnimationFrame(loop));
        window.requestAnimationFrame(loop);

        this.insertFunction = (func) => { functionStack.push(func); return functionStack.length - 1; };
        this.removeFunctionByIndex = (index) => { functionStack.splice(index, 1); };

        this.executeNow = () => functionStack.forEach(func => func());

        Object.defineProperties(this, {
            block: {
                set: value => block = value,
                get: () => block
            }
        });
    }
};

document.body.addEventListener('resize', () => (mainLoop.block) ? mainLoop.executeNow() : undefined);


const map = new class {
    constructor() {
        this.tiles = CanvasObjectModel.createElement('tiledMap', {
            position: [0, 0],
            tileSize: [100, 100],
            defaultTile: "./src/img/tiles/black.jpg"
        });

        this.backgroundDecorations = CanvasObjectModel.createElement('item', { anchors: { position: "center" } });
        this.solidObjects = CanvasObjectModel.createElement('item', { anchors: { position: "center" } });
        this.foregroundDecorations = CanvasObjectModel.createElement('item', { anchors: { position: "center" } });

        this.mapname = '';
    }

    changePosition(position) {
        this.tiles.x = -position.x + document.body.offsetWidth / 2;
        this.tiles.y = -position.y + document.body.offsetHeight / 2;
        this.solidObjects.x = -position.x + document.body.offsetWidth / 2;
        this.solidObjects.y = -position.y + document.body.offsetHeight / 2;

        this.foregroundDecorations.x = -position.x + document.body.offsetWidth / 2;
        this.foregroundDecorations.y = -position.y + document.body.offsetHeight / 2;

        this.backgroundDecorations.x = -position.x + document.body.offsetWidth / 2;
        this.backgroundDecorations.y = -position.y + document.body.offsetHeight / 2;

        selectionArea.x = -position.x + document.body.offsetWidth / 2;
        selectionArea.y = -position.y + document.body.offsetHeight / 2;
    }

    loadMapByName(name) {
        this.mapname = name;
        this.loadMap(JSON.parse(localStorage.getItem('map'))[name]);
    }

    loadMap(object) {
        if (object.tiles) {
            this.tiles.clearTileRange();
            this.tiles.setProperties(object.tiles);
        }
        if (object.background) {
            this.backgroundDecorations.children = new Array;
            object.background.forEach(element => {
                this.backgroundDecorations.insert(CanvasObjectModel.createElement(element.type, element.properties));
            });
        }
        if (object.solid) {
            this.solidObjects.children = new Array;
            object.solid.forEach(element => {
                this.solidObjects.insert(CanvasObjectModel.createElement(element.type, element.properties));
            });
        }
        if (object.foreground) {
            this.foregroundDecorations.children = new Array;
            object.foreground.forEach(element => {
                this.foregroundDecorations.insert(CanvasObjectModel.createElement(element.type, element.properties));
            });
        }
    }
};

mainController.canvas.rerenderChangeTimeout(canvas => {
    canvas.insert(map.tiles);
    canvas.insert(map.backgroundDecorations);
    canvas.insert(map.solidObjects);
    canvas.insert(map.foregroundDecorations);
    canvas.insert(selectionArea);
    canvas.insert(CanvasObjectModel.createElement('rectangle', { anchors: { position: "center" }, size: [3, 3], color: "red", shadow: { x: 0, y: 0, color: "#ff0", blur: 3 } }));
});


let up = false,
    right = false,
    down = false,
    left = false,
    shift = false,
    lockMovement = false;

document.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        eval(command_line.value);
        command_line.value = "";
    }
    if (lockMovement) return;
    if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 38) up = true;
    if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ || e.keyCode === 39) right = true;
    if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ || e.keyCode === 40) down = true;
    if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 37) left = true;
    if (e.keyCode === 16) shift = true;
    if (e.keyCode === 84) {
        command_line.focus();
    }
});


document.addEventListener('keyup', e => {
    if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 38) up = false;
    if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ || e.keyCode === 39) right = false;
    if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ || e.keyCode === 40) down = false;
    if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 37) left = false;
    if (e.keyCode === 16) shift = false;
});

const movement = () => {
    let addX = 0, addY = 0;
    if (up) addY -= shift ? .5 : 20;
    if (right) addX += shift ? .5 : 20;
    if (down) addY += shift ? .5 : 20;
    if (left) addX -= shift ? .5 : 20;
    position.x += addX;
    position.y += addY;

    map.changePosition(position);
}


document.addEventListener('mousemove', e => {
    info.mouse = { x: e.clientX, y: e.clientY };
    if (selecting) {
        selection.size = [e.clientX - document.body.offsetWidth / 2 + position.x - selection.position[0], e.clientY - document.body.offsetHeight / 2 + position.y - selection.position[1]];
    }
});

document.addEventListener('mousedown', e => {
    selection.size = [0, 0];
    selection.position = [
        e.clientX - document.body.offsetWidth / 2 + position.x,
        e.clientY - document.body.offsetHeight / 2 + position.y
    ];
    selecting = true;
})

document.addEventListener('mouseup', e => {
    selection.size = [e.clientX - document.body.offsetWidth / 2 + position.x - selection.position[0], e.clientY - document.body.offsetHeight / 2 + position.y - selection.position[1]];
    selecting = false;
})








let info = {
    mouse: { x: 0, y: 0 }
};

const updateInfo = () => {
    devinfo.update({
        position,
        mouse: {
            x: info.mouse.x - document.body.offsetWidth / 2 + position.x,
            y: info.mouse.y - document.body.offsetHeight / 2 + position.y
        },
        selection_start: { x: selection.x, y: selection.y },
        selection_end: { x: selection.x + selection.width, y: selection.y + selection.height }
    });

    devmapinfo.update();
}

customElements.define('dev-info', class extends HTMLElement {
    constructor() {
        super();
        window.devinfo = this;
        this.info = new Object;
        this.style = `
        display: block;
        z-index: 1000 !important;
        position: fixed;
        white-space: pre;
        color: white;
        font-family: Segoe UI;
        `
    }

    connectedCallback() { }

    update(object) {
        Object.assign(this.info, object);
        this.innerHTML = JSON.stringify(this.info, null, 4).replace(/["|{|}|,]/g, '');
    }
})


customElements.define('dev-mapinfo', class extends HTMLElement {
    constructor() {
        super();
        window.devmapinfo = this;
        this.info = new Object;
        this.style = `
        display: block;
        z-index: 1000 !important;
        position: fixed;
        top: 0; right: 0;
        white-space: pre;
        color: white;
        font-family: Segoe UI;
        `;
    }

    connectedCallback() { }

    update() {
        this.innerHTML = JSON.stringify(mapObject, null, 4).replace(/["|{|}|\[|\]|,]/g, '');
    }
})

mainLoop.insertFunction(() => map.loadMap(mapObject));
mainLoop.insertFunction(movement);
mainLoop.insertFunction(updateInfo);
mainLoop.insertFunction(() => mainController.canvas.render());

mainLoop.block = false




//CLI
command_line.onfocus = () => lockMovement = true;
command_line.onblur = () => lockMovement = false;

window.selected = null;

Object.defineProperties(window, {
    addbg: {
        get: () => {
            mapObject.background.push({type: 'rectangle', properties: { color: "#000", position: selection.position, size: selection.size }});
            selected = mapObject.background[mapObject.background.length - 1]
        }
    },
    addfg: {
        get: () => {
            mapObject.foreground.push({type: 'rectangle', properties: { color: "#000", position: selection.position, size: selection.size }});
            selected = mapObject.foreground[mapObject.background.length - 1]
        }
    },
    addsl: {
        get: () => {
            mapObject.solid.push({type: 'rectangle', properties: { color: "#000", position: selection.position, size: selection.size }});
            selected = mapObject.solid[mapObject.background.length - 1]
        }
    }
})