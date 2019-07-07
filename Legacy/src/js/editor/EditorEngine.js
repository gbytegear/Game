const switchClass = (element, className) => (element.classList.contains(className)) ? element.classList.remove(className) : element.classList.add(className)

const position = {
    x: 0,
    y: 0
};

window.mapObject = {
    tiles: {
        defaultTile: "./src/img/tiles/grass1.jpg",
        rangeTiles: [],
    },
    background: [],
    solid: [],
    foreground: [],
    actions: []
};

if (localStorage.getItem('editing'))
    mapObject = JSON.parse(localStorage.getItem('editing'));

let selectionArea = CanvasObjectModel.createElement('item', {
    anchors: {
        position: "center"
    }
})
    , selection = CanvasObjectModel.createElement('rectangle', {
        color: "#fff4"
    })
    , selecting = false;

selectionArea.insert(selection);

let mainLoop = new class {
    constructor() {
        let functionStack = new Array
            , block = true
            , loop = () => ((!block) ? (functionStack.forEach(func => func())) : undefined,
                window.requestAnimationFrame(loop));
        window.requestAnimationFrame(loop);

        this.insertFunction = (func) => {
            functionStack.push(func);
            return functionStack.length - 1;
        }
            ;
        this.removeFunctionByIndex = (index) => {
            functionStack.splice(index, 1);
        }
            ;

        this.executeNow = () => functionStack.forEach(func => func());

        Object.defineProperties(this, {
            block: {
                set: value => block = value,
                get: () => block
            }
        });
    }
}
    ;

document.body.addEventListener('resize', () => (mainLoop.block) ? mainLoop.executeNow() : undefined);

const map = new class {
    constructor() {
        this.tiles = CanvasObjectModel.createElement('tiledMap', {
            position: [0, 0],
            tileSize: [100, 100],
            defaultTile: "./src/img/tiles/black.jpg"
        });

        this.backgroundDecorations = CanvasObjectModel.createElement('item', {
            anchors: {
                position: "center"
            }
        });
        this.solidObjects = CanvasObjectModel.createElement('item', {
            anchors: {
                position: "center"
            }
        });
        this.foregroundDecorations = CanvasObjectModel.createElement('item', {
            anchors: {
                position: "center"
            }
        });

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
        localStorage.setItem('editing', JSON.stringify(object));
        if (object.tiles) {
            this.tiles.clearTileRange();
            this.tiles.setProperties(object.tiles);
        }
        if (object.background) {
            this.backgroundDecorations.children = new Array;
            object.background.forEach(element => {
                this.backgroundDecorations.insert(CanvasObjectModel.createElement(element.type, element.properties));
            }
            );
        }
        if (object.solid) {
            this.solidObjects.children = new Array;
            object.solid.forEach(element => {
                this.solidObjects.insert(CanvasObjectModel.createElement(element.type, element.properties));
            }
            );
        }
        if (object.foreground) {
            this.foregroundDecorations.children = new Array;
            object.foreground.forEach(element => {
                this.foregroundDecorations.insert(CanvasObjectModel.createElement(element.type, element.properties));
            }
            );
        }
    }
}
    ;

mainController.canvas.insert(map.tiles);
mainController.canvas.insert(map.backgroundDecorations);
mainController.canvas.insert(map.solidObjects);
mainController.canvas.insert(map.foregroundDecorations);
mainController.canvas.insert(selectionArea);
mainController.canvas.insert(CanvasObjectModel.createElement('rectangle', {
    anchors: {
        position: "center"
    },
    size: [3, 3],
    color: "red",
    shadow: {
        x: 0,
        y: 0,
        color: "#ff0",
        blur: 3
    }
}));

let up = false
    , right = false
    , down = false
    , left = false
    , shift = false
    , lockMovement = false
    , ctrl = false;

document.addEventListener('keydown', e => {
    if (e.keyCode === 17)
        ctrl = true;
    if (e.keyCode === 13) {
        cliscope.execute(command_line.value);
        command_line.value = "";
    }
    if (lockMovement)
        return;
    if (e.keyCode === 74)
        switchClass(document.body, 'json')
    if (e.keyCode === 38 /* up */
        || e.keyCode === 87 /* w */
        || e.keyCode === 38)
        up = true;
    if (e.keyCode === 39 /* right */
        || e.keyCode === 68 /* d */
        || e.keyCode === 39)
        right = true;
    if (e.keyCode === 40 /* down */
        || e.keyCode === 83 /* s */
        || e.keyCode === 40)
        down = true;
    if (e.keyCode === 37 /* left */
        || e.keyCode === 65 /* a */
        || e.keyCode === 37)
        left = true;
    if (e.keyCode === 16)
        shift = true;
    if (e.keyCode === 84) {
        command_line.focus();
    }
}
);

document.addEventListener('keyup', e => {
    if (e.keyCode === 17)
        ctrl = false;
    if (e.keyCode === 38 /* up */
        || e.keyCode === 87 /* w */
        || e.keyCode === 38)
        up = false;
    if (e.keyCode === 39 /* right */
        || e.keyCode === 68 /* d */
        || e.keyCode === 39)
        right = false;
    if (e.keyCode === 40 /* down */
        || e.keyCode === 83 /* s */
        || e.keyCode === 40)
        down = false;
    if (e.keyCode === 37 /* left */
        || e.keyCode === 65 /* a */
        || e.keyCode === 37)
        left = false;
    if (e.keyCode === 16)
        shift = false;
}
);

const movement = () => {
    let addX = 0
        , addY = 0;
    if (up)
        addY -= shift ? .5 : 20;
    if (right)
        addX += shift ? .5 : 20;
    if (down)
        addY += shift ? .5 : 20;
    if (left)
        addX -= shift ? .5 : 20;
    position.x += addX;
    position.y += addY;

    map.changePosition(position);
}

mainController.canvas.addEventListener('mousemove', e => {
    info.mouse = {
        x: e.clientX,
        y: e.clientY
    };
    if (selecting) {
        let sz = [e.clientX - document.body.offsetWidth / 2 + position.x - selection.position[0], e.clientY - document.body.offsetHeight / 2 + position.y - selection.position[1]];
        if (ctrl)
            sz = [Math.round(sz[0] / (delta * 10)) * delta * 10, Math.round(sz[1] / (delta * 10)) * delta * 10]
        selection.size = sz;
    }
}
);

mainController.canvas.addEventListener('mousedown', e => {
    selection.size = [0, 0];
    let pos = [e.clientX - document.body.offsetWidth / 2 + position.x, e.clientY - document.body.offsetHeight / 2 + position.y];
    if (ctrl)
        pos = [Math.round(pos[0] / (delta * 10)) * delta * 10, Math.round(pos[1] / (delta * 10)) * delta * 10]
    selection.position = pos;
    selecting = true;
}
)

mainController.canvas.addEventListener('mouseup', e => {
    let sz = [e.clientX - document.body.offsetWidth / 2 + position.x - selection.position[0], e.clientY - document.body.offsetHeight / 2 + position.y - selection.position[1]];
    if (ctrl)
        sz = [Math.round(sz[0] / (delta * 10)) * delta * 10, Math.round(sz[1] / (delta * 10)) * delta * 10]
    selection.size = sz;
    selecting = false;
}
)

let info = {
    mouse: {
        x: 0,
        y: 0
    }
};

let delta = 1;

const updateInfo = () => {
    devinfo.update({
        position,
        mouse: {
            x: info.mouse.x - document.body.offsetWidth / 2 + position.x,
            y: info.mouse.y - document.body.offsetHeight / 2 + position.y
        },
        selection_start: {
            x: selection.x,
            y: selection.y
        },
        selection_end: {
            x: selection.x + selection.width,
            y: selection.y + selection.height
        }
    });

    if (typeof (devmapinfo) != "undefined")
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
}
)

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
}
)

//CLI
command_line.onfocus = () => lockMovement = true;
command_line.onblur = () => lockMovement = false;

let tiles = {
    planks: './src/img/tiles/planks.jpg',
    bricks: './src/img/tiles/bricks.jpg',
    asphalt: './src/img/tiles/asphalt.jpg',
    spaceLetice: './src/img/tiles/space_letice.jpg',
};

let cliscope = new class {
    constructor() {
        let selected = null
            , mapName = null;

        Object.defineProperties(window, {

            tlmode: {
                get: () => delta = 10
            },
            objmode: {
                get: () => delta = 1
            },

            //Добавление объектов
            addbg: {
                //Добавить объект заднего плана
                get: () => {
                    mapObject.background.push({
                        type: 'rectangle',
                        properties: {
                            color: "#000",
                            position: selection.position,
                            size: selection.size
                        }
                    });
                    selected = mapObject.background[mapObject.background.length - 1];
                    map.loadMap(mapObject)
                }
            },
            addfg: {
                //Добавить объект переднего плана
                get: () => {
                    mapObject.foreground.push({
                        type: 'rectangle',
                        properties: {
                            color: "#000",
                            position: selection.position,
                            size: selection.size
                        }
                    });
                    selected = mapObject.foreground[mapObject.foreground.length - 1];
                    map.loadMap(mapObject)
                }
            },
            addsl: {
                //Добавить твёрдый объект
                get: () => {
                    mapObject.solid.push({
                        type: 'rectangle',
                        properties: {
                            color: "#000",
                            position: selection.position,
                            size: selection.size
                        }
                    });
                    selected = mapObject.solid[mapObject.solid.length - 1];
                    map.loadMap(mapObject)
                }
            },
            addac: {
                set: fx => mapObject.actions.push({
                    x: selection.x,
                    y: selection.y,
                    width: selection.width,
                    height: selection.height,
                    fx: `()=>{${fx}}`
                })
            },
            conn: {
                set: to => {
                    addac = `GameEngine.map.loadMapByName("${to}")`;
                }
            },

            //Выборка объектов
            selbg: {
                set: index => {
                    selected = mapObject.background[index];
                    selection.position = mapObject.background[index].properties.position;
                    selection.size = mapObject.background[index].properties.size;
                }
            },
            selfg: {
                set: index => {
                    selected = mapObject.foreground[index];
                    selection.position = mapObject.foreground[index].properties.position;
                    selection.size = mapObject.foreground[index].properties.size;
                }
            },
            selsl: {
                set: index => {
                    selected = mapObject.solid[index];
                    selection.position = mapObject.solid[index].properties.position;
                    selection.size = mapObject.solid[index].properties.size;
                }
            },
            sel: {
                get: () => console.log(selected)
            },

            //Изменнение свойств объектов
            color: {
                set: color => {
                    selected.properties.color = color;
                    map.loadMap(mapObject)
                }
            },
            src: {
                set: src => {
                    selected.properties.src = src;
                    map.loadMap(mapObject)
                }
            },
            width: {
                set: width => {
                    selected.properties.size[0] = width;
                    map.loadMap(mapObject)
                }
            },
            height: {
                set: height => {
                    selected.properties.size[1] = height;
                    map.loadMap(mapObject)
                }
            },
            move: {},
            x: {
                set: x => {
                    selected.properties.position[0] = x;
                    map.loadMap(mapObject)
                }
            },
            y: {
                set: y => {
                    selected.properties.position[0] = y;
                    map.loadMap(mapObject)
                }
            },

            //Тайлы
            addtl: {
                set: src => {
                    let tileinfo = {
                        fromX: Math.round(selection.position[0] / map.tiles.tileSize.width),
                        fromY: Math.round(selection.position[1] / map.tiles.tileSize.height),
                        toX: Math.round(selection.position[0] / map.tiles.tileSize.width) + Math.round(selection.size[0] / map.tiles.tileSize.width),
                        toY: Math.round(selection.position[1] / map.tiles.tileSize.height) + Math.round(selection.size[1] / map.tiles.tileSize.height),
                        src
                    }
                    mapObject.tiles.rangeTiles.push(tileinfo);
                    map.loadMap(mapObject);
                }
            },

            cpmap: {
                get: () => {
                    navigator.clipboard.writeText(JSON.stringify(mapObject, null, 4)).then(() => {
                        alert("Success");
                    }
                    ).catch(() => alert('Something wrong!'));
                }
            },
            cpdata: {
                get: () => {
                    navigator.clipboard.writeText(`localStorage.setItem('map', JSON.stringify(${localStorage.getItem('maps')}));`).then(() => {
                        alert("Success");
                    }
                    ).catch(() => alert('Something wrong!'));
                }
            },

            setdata: {
                set: data => {
                    let maps = JSON.parse(localStorage.getItem('maps'));
                    maps = data;
                    localStorage.setItem('maps', JSON.stringify(maps));
                }
            },
            reload: {
                get: () => map.loadMap(mapObject)
            },
            save: {
                set: name => {
                    let maps = JSON.parse(localStorage.getItem('maps'));
                    maps[name] = mapObject;
                    localStorage.setItem('maps', JSON.stringify(maps));
                }
            },
            delete: {
                set: name => {
                    let maps = JSON.parse(localStorage.getItem('maps'));
                    delete maps[name];
                    localStorage.setItem('maps', JSON.stringify(maps));
                }
            },
            load: {
                set: name => (mapObject = JSON.parse(localStorage.getItem('maps'))[name],
                    map.loadMap(mapObject))
            },
            clear: {
                get: () => (mapObject = {
                    tiles: {
                        defaultTile: "./src/img/tiles/grass1.jpg",
                        rangeTiles: [],
                    },
                    background: [],
                    solid: [],
                    foreground: [],
                    actions: []
                },
                    map.loadMap(mapObject))
            }
        });

        this.execute = command => eval(command);
    }
}

map.loadMap(mapObject);
// mainLoop.insertFunction(() => );
mainLoop.insertFunction(movement);
mainLoop.insertFunction(updateInfo);
mainLoop.insertFunction(() => mainController.canvas.rerender());

mainLoop.block = false
