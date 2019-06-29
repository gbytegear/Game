(()=>{
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    class Inventory extends HTMLElement {
        constructor() {
            super();
        }

        static createStorage(length) {
            let index = Inventory.length;
            Inventory.storage.push(new Array);
            for (let i = 0; i < 100; i++)
                Inventory.storage[index].push(new Item);
            return Inventory.storage[index];
        }

        connectedCallback() {
            this.style = `
            display: flex;
            justify-content: flex-start;
            align-content: flex-start;
            flex-wrap: wrap;
        `;
            this.loadStrorage();
        }

        loadStrorage(index=0) {
            Inventory.storage[index].forEach((item,i)=>{
                let cell = document.createElement('inv-cell');
                cell.setAttribute('path', `Inventory/storage/${index}`);
                cell.setAttribute('index', `${i}`);
                this.appendChild(cell);
            }
            );
        }
    }

    Inventory.storage = new Array;
    window.Inventory = Inventory;

    customElements.define('inv-container', Inventory);

    class Item {
        constructor(name="empty", property=new Object) {
            let data = JSON.parse(localStorage.getItem('equipment'))[name] || {};
            Object.defineProperties(this, {
                name: {
                    get: ()=>name,
                    set: value=>(name = value,
                    data = JSON.parse(localStorage.getItem('equipment'))[name])
                },
                type: {
                    get: ()=>data.type
                },
                textures: {
                    get: ()=>data.textures
                },
                properties: {
                    get: ()=>data.properties
                },
                animation: {
                    get: ()=>data.animation
                },
                json: {
                    get: ()=>JSON.stringify({
                        name: this.name,
                        type: this.type,
                        textures: this.textures,
                        properties: this.properties
                    }),
                    set: json=>(this.name = json.name,
                    data.properties = json.properties)
                }
            })
        }
    }

    window.Item = Item;


















    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    customElements.define('inv-cell', class InvCell extends HTMLElement {
        constructor() {
            super();
            this.type = undefined;

            this.item = null;

            let containdeItem = new Item()
              , selected = false;

            Object.defineProperties(this, {
                item: {
                    get: ()=>containdeItem,
                    set: value=>{
                        containdeItem = value;
                        this.itemChanged();
                        if (this.type)
                            GameEngine.player.equipment[this.type] = this.item;
                    }
                },
                selected: {
                    get: ()=>selected,
                    set: value=>(selected) ? (value) ? undefined : (this.unselect(),
                    selected = value) : (value) ? (this.select(),
                    selected = value) : undefined
                }
            });
        }

        static get observedAttributes() {
            return ['path', 'index', 'type'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!newValue)
                return;
            switch (name) {
            case 'path':
                let obj = GameEngine;
                newValue.split('/').forEach(str=>obj = obj[(isNaN(Number(str))) ? str : parseInt(str)]);
                this.container = obj;

                break;
            case 'index':
                if (!this.container)
                    break;
                this.index = (isNaN(Number(newValue))) ? newValue : parseInt(newValue);
                if (this.container[this.index])
                    this.item = this.container[this.index];

                break;
            case 'type':
                this.type = newValue;
            }
        }

        connectedCallback() {
            this.draggable = false;
            this.addEventListener('click', ()=>this.selected = !this.selected);
        }

        select() {
            if (InvCell.selectedCell) {
                this.replaceItem(InvCell.selectedCell);
                InvCell.selectedCell.selected = false;
            }
            this.classList.add('selected');
            InvCell.selectedCell = this;
        }

        unselect() {
            this.classList.remove('selected');
            InvCell.selectedCell = null;
        }

        replaceItem(cell) {
            if (((this.type) ? cell.item.type != this.type && cell.item.name != "empty" : false) || ((cell.type) ? this.item.type != cell.type && this.item.name != "empty" : false))
                return;
            [this.item,cell.item] = [cell.item, this.item];
        }

        itemChanged() {
            this.style.backgroundImage = `url(./src/img/icons/items/${this.item.name}.png)`;
            if (this.container)
                this.container[this.index] = this.item;
        }
    }
    );


















    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    class Character {
        constructor() {
            let self = this;
            let elements = {
                character: CanvasObjectModel.createElement('item', {
                    size: [78.75, 52.5],
                    origin: "center",
                    anchors: {
                        position: "center"
                    }
                }),
                body: CanvasObjectModel.createElement('rectangle', {
                    position: [0, 0],
                    origin: "center",
                    anchors: {
                        size: "fill"
                    }
                }),
                handL1: CanvasObjectModel.createElement('rectangle', {
                    position: [0, -15],
                    origin: [10, 45],
                    size: [19, 50]
                }),
                handL2: CanvasObjectModel.createElement('rectangle', {
                    position: [0, -37],
                    origin: [10, 45],
                    size: [19, 50]
                }),
                handR1: CanvasObjectModel.createElement('rectangle', {
                    position: [59.75, -15],
                    origin: [10, 45],
                    size: [19, 50]
                }),
                handR2: CanvasObjectModel.createElement('rectangle', {
                    position: [0, -37],
                    origin: [10, 45],
                    size: [19, 50]
                }),
                weapon: CanvasObjectModel.createElement('rectangle', {
                    position: [0, -80],
                    origin: [10, 80],
                    size: [20, 128]
                }),
                backpack: CanvasObjectModel.createElement('rectangle', {
                    position: [0, 0],
                    anchors: {
                        size: "fill"
                    }
                }),
                head: CanvasObjectModel.createElement('rectangle', {
                    position: [15, 0],
                    size: [45, 45],
                    origin: "center",
                    src: "./src/img/textures/characters/heads/player.png"
                })
            };

            elements.character.insert(elements.body);
            elements.handL1.insert(elements.handL2);
            elements.body.insert(elements.handL1);
            elements.handR2.insert(elements.weapon);
            elements.handR1.insert(elements.handR2);
            elements.body.insert(elements.backpack);
            elements.body.insert(elements.handR1);
            elements.body.insert(elements.head);

            this.currentAnimation = null;
            this.currentAnimationFrame = 0;

            this.position = {
                x: 0,
                y: 0
            };
            this.angle = 0;
            this.walkingSpeed = 10;
            this.runningSpeed = 5;

            this.inventory = Inventory.createStorage();

            let equipment = {
                head: new Item,
                body: new Item,
                pants: new Item,
                boots: new Item,
                lhand: new Item,
                rhand: new Item
            };
            let equipmentChanged = this.equipmentChanged;
            this.equipment = {
                get head() {
                    return equipment.head
                },
                get body() {
                    return equipment.body
                },
                get pants() {
                    return equipment.pants
                },
                get boots() {
                    return equipment.boots
                },
                get lhand() {
                    return equipment.lhand
                },
                get rhand() {
                    return equipment.rhand
                },

                set head(value) {
                    equipment.head = value;
                    self.equipmentChanged()
                },
                set body(value) {
                    equipment.body = value;
                    self.equipmentChanged()
                },
                set pants(value) {
                    equipment.pants = value;
                    self.equipmentChanged()
                },
                set boots(value) {
                    equipment.boots = value;
                    self.equipmentChanged()
                },
                set lhand(value) {
                    equipment.lhand = value;
                    self.equipmentChanged()
                },
                set rhand(value) {
                    equipment.rhand = value;
                    self.equipmentChanged()
                },
            };
            this.stats = {
                maxHP: 1000,

                defence: 0,
                walkingSpeed: 0,
                runningSpeed: 0,

                bulletSpeed: 0,
                armed: false
            };

            Object.defineProperties(this, {
                rootElement: {
                    get: ()=>elements.character
                },
                elements: {
                    get: ()=>elements
                }
            });

            this.equipmentChanged();
        }

        equipmentChanged() {
            this.stats = {
                maxHP: 1000,
                defence: 0,
                walkingSpeed: 0,
                runningSpeed: 0,
                bulletSpeed: 0,
                armed: false
            };
            for (let item in this.equipment) {
                if (this.equipment[item].name == "empty") {
                    switch (item) {
                    case "body":
                        this.changeTextures(JSON.parse(localStorage.getItem('equipment')).clth_empty.textures);
                        break;
                    case "rhand":
                        let wpn = JSON.parse(localStorage.getItem('equipment')).wpn_empty
                        this.changeTextures(wpn.textures);
                        this.changeAnimation(wpn.animation);
                        break;
                    }
                } else {
                    if (this.equipment[item].animation)
                        this.changeAnimation(this.equipment[item].animation);
                    this.changeTextures(this.equipment[item].textures);
                    for (let property in this.equipment[item].properties)
                        this.stats[property] = this.equipment[item].properties[property];
                }
            }
        }

        changeTextures(textures) {
            for (let texture in textures)
                this.elements[texture].src = textures[texture];
        }

        changeAnimation(name, index=0) {
            this.currentAnimation = JSON.parse(localStorage.getItem('animations'))[name];
            this.setAnimationFrame(index);
        }

        setAnimationFrame(index) {
            let frame = this.currentAnimation[this.currentAnimationFrame];
            for (let parts in frame)
                this.elements[parts].setProperties(frame[parts]);
        }

        giveItem(item) {
            for (let i = 0; i < this.inventory.length; i++)
                if (this.inventory[i].name == 'empty')
                    return this.inventory[i] = item;
        }
    }


















    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const hitTest = (obj1,obj2)=>{
        if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y)
            return true;
        return false;
    }
    ;

    class MapController {
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
            this.actionArea = new Array;

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
        }

        hitSolid(obj) {
            if (this.solidObjects.children.length == 0)
                return false;
            for (let i = 0; i < this.solidObjects.children.length; i++)
                if (hitTest(this.solidObjects.children[i], obj))
                    return true;
            return false;
        }

        hitAction(obj) {
            if (this.actionArea.length == 0)
                return;
            this.actionArea.forEach(area=>{
                if (hitTest(area, obj))
                    area.fx();
            }
            );
        }

        loadMapByName(name) {
            this.mapname = name;
            this.loadMap(JSON.parse(localStorage.getItem('map'))[name]);
        }

        loadMap(object) {
            this.backgroundDecorations.children = new Array;
            this.solidObjects.children = new Array;
            this.foregroundDecorations.children = new Array;
            this.actionArea = new Array;
            if (object.tiles) {
                this.tiles.clearTileRange();
                this.tiles.setProperties(object.tiles);
            }
            if (object.background) {
                object.background.forEach(element=>{
                    this.backgroundDecorations.insert(CanvasObjectModel.createElement(element.type, element.properties));
                }
                );
            }
            if (object.solid) {
                object.solid.forEach(element=>{
                    this.solidObjects.insert(CanvasObjectModel.createElement(element.type, element.properties));
                }
                );
            }
            if (object.foreground) {
                object.foreground.forEach(element=>{
                    this.foregroundDecorations.insert(CanvasObjectModel.createElement(element.type, element.properties));
                }
                );
            }
            if (object.actions) {
                object.actions.forEach(area=>{
                    area.fx = eval(area.fx);
                    this.actionArea.push(area);
                }
                )
            }
        }
    };
    

















    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    class LoopController {
        constructor() {
            let functionStack = new Array
              , block = true
              , loop = ()=>((!block) ? (functionStack.forEach(func=>func())) : undefined,
            window.requestAnimationFrame(loop));
            window.requestAnimationFrame(loop);

            this.insertFunction = (func)=>{
                functionStack.push(func);
                return functionStack.length - 1;
            }
            ;
            this.removeFunctionByIndex = (index)=>{
                functionStack.splice(index, 1);
            }
            ;

            this.executeNow = ()=>functionStack.forEach(func=>func());

            Object.defineProperties(this, {
                block: {
                    set: value=>block = value,
                    get: ()=>block
                }
            });
        }
    };


















    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    window.GameEngine = new class GameEngine {
        constructor() {
            this.ObjectList = new Array;
            this.Inventory = Inventory;

            this.creationStack = new Array;
            this.mainLoop = new LoopController;
            this.map = new MapController;
            this.player = new Character;

            mainController.canvas.insert(this.map.tiles);
            mainController.canvas.insert(this.map.backgroundDecorations);
            mainController.canvas.insert(this.map.solidObjects);
            mainController.canvas.insert(this.player.rootElement);
            mainController.canvas.insert(this.map.foregroundDecorations);

            this.map.loadMapByName('home');

            this.mainLoop.insertFunction(()=>this.createObjectsFromStack());
            this.mainLoop.insertFunction(()=>this.movement());
            this.mainLoop.insertFunction(()=>mainController.canvas.rerender());
            this.mainLoop.block = false;

            this.controllerButtons = {
                up: false,
                right: false,
                down: false,
                left: false,
                shift: false
            };
            this.intiControllEvents();
        }

        createObjectsFromStack() {
            this.creationStack.forEach(element=>{
                switch (element.to) {
                case "solid":
                    this.map.solidObjects.insert(element.object);
                    break;
                case "background":
                    this.map.backgroundDecorations.insert(element.object);
                    break;
                case "foreground":
                    this.map.foregroundDecorations.insert(element.object);
                }
            }
            );
            this.creationStack = new Array;
        }

        movement() {
            let addX = 0
              , addY = 0
              , speed = this.player.walkingSpeed;
            if (this.controllerButtons.shift)
                speed += this.player.runningSpeed;
            if (this.controllerButtons.up)
                addY -= speed;
            if (this.controllerButtons.right)
                addX += speed;
            if (this.controllerButtons.down)
                addY += speed;
            if (this.controllerButtons.left)
                addX -= speed;

            if (!this.map.hitSolid({
                x: this.player.position.x + addX - 20,
                y: this.player.position.y - 20,
                width: 40,
                height: 40
            }))
                this.player.position.x += addX;

            if (!this.map.hitSolid({
                x: this.player.position.x - 20,
                y: this.player.position.y + addY - 20,
                width: 40,
                height: 40
            }))
                this.player.position.y += addY;

            this.map.hitAction({
                x: this.player.position.x,
                y: this.player.position.y,
                width: 40,
                height: 40
            });

            this.map.changePosition(this.player.position);
            this.player.rootElement.angle = this.player.angle;

        }

        intiControllEvents() {
            document.addEventListener('keydown', e=>{
                if (e.keyCode === 38 /* up */
                || e.keyCode === 87 /* w */
                || e.keyCode === 38)
                    this.controllerButtons.up = true;
                if (e.keyCode === 39 /* right */
                || e.keyCode === 68 /* d */
                || e.keyCode === 39)
                    this.controllerButtons.right = true;
                if (e.keyCode === 40 /* down */
                || e.keyCode === 83 /* s */
                || e.keyCode === 40)
                    this.controllerButtons.down = true;
                if (e.keyCode === 37 /* left */
                || e.keyCode === 65 /* a */
                || e.keyCode === 37)
                    this.controllerButtons.left = true;
                if (e.keyCode === 16)
                    this.controllerButtons.shift = true;

                if (e.keyCode === 27) {
                    let ui = document.querySelector('.menu');
                    window.running = ui.classList.contains('show');
                    (ui.classList.contains('show')) ? (ui.classList.remove('show'),
                    this.mainLoop.block = false) : (ui.classList.add('show'),
                    this.mainLoop.block = true);
                }
            }
            );

            document.addEventListener('keyup', e=>{
                if (e.keyCode === 38 /* up */
                || e.keyCode === 87 /* w */
                || e.keyCode === 38)
                    this.controllerButtons.up = false;
                if (e.keyCode === 39 /* right */
                || e.keyCode === 68 /* d */
                || e.keyCode === 39)
                    this.controllerButtons.right = false;
                if (e.keyCode === 40 /* down */
                || e.keyCode === 83 /* s */
                || e.keyCode === 40)
                    this.controllerButtons.down = false;
                if (e.keyCode === 37 /* left */
                || e.keyCode === 65 /* a */
                || e.keyCode === 37)
                    this.controllerButtons.left = false;
                if (e.keyCode === 16)
                    this.controllerButtons.shift = false;
            }
            );

            document.addEventListener('mousemove', e=>{
                this.player.angle = -(180 / Math.PI * Math.atan2(this.player.rootElement.x + this.player.rootElement.width / 2 - e.clientX, this.player.rootElement.y + this.player.rootElement.height / 2 - e.clientY));
            }
            );

            document.addEventListener('mousedown', e=>{
                if (this.mainLoop.block || !this.player.stats.armed)
                    return;
                let mouse = {
                    x: e.clientX - document.body.offsetWidth / 2,
                    y: e.clientY - document.body.offsetHeight / 2
                }
                  , sx = Math.abs(mouse.x) / ((Math.abs(mouse.x) + Math.abs(mouse.y)) / 100)
                  , sy = Math.abs(mouse.y) / ((Math.abs(mouse.x) + Math.abs(mouse.y)) / 100);
                sx = this.player.stats.bulletSpeed * sx / 100;
                if (mouse.x < 0)
                    sx = -sx;
                sy = this.player.stats.bulletSpeed * sy / 100;
                if (mouse.y < 0)
                    sy = -sy;

                let bullet = CanvasObjectModel.createElement('rectangle', {
                    size: [3, 40],
                    origin: "center",
                    angle: this.player.angle,
                    position: [this.player.position.x - 1.5, this.player.position.y - 20],
                    color: "#ff08",

                    deleteStep: 100,
                    currentStep: 0,
                    renderBlock: true,
                    dynamicProperties: {
                        x: sx,
                        y: sy,
                        fx: `()=>{
            if(this.currentStep==this.deleteStep)this.remove();
            this.currentStep++
            }`
                    }
                });

                this.creationStack.push({
                    to: "background",
                    object: bullet
                });
            }
            );
        }

    }

    document.body.addEventListener('resize', ()=>(mainLoop.block) ? mainLoop.executeNow() : undefined);
}
)();
