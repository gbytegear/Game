window.ObjectList = new Array;
let creationStack = new Array;

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














console.error("СДЕЛАЙ НОРМАЛЬНУЮ СИСТЕМУ ПРЕДМЕТОВ, ЭТА КОСЯЧНАЯ ХУЙНЯ НИКУДА НЕ ГОДИТСЯ");

class Character {
  constructor() {
    let self = this;
    let elements = {
      character: CanvasObjectModel.createElement('item', { size: [78.75, 52.5], origin: "center", anchors: { position: "center" } }),
      body: CanvasObjectModel.createElement('image', { position: [0, 0], origin: "center", anchors: { size: "fill" } }),
      handL1: CanvasObjectModel.createElement('image', { position: [0, -15], origin: [10, 45], size: [19, 50] }),
      handL2: CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], size: [19, 50] }),
      handR1: CanvasObjectModel.createElement('image', { position: [59.75, -15], origin: [10, 45], size: [19, 50] }),
      handR2: CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], size: [19, 50] }),
      weapon: CanvasObjectModel.createElement('image', { position: [0, -80], origin: [10, 80], size: [20, 128] }),
      backpack: CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" } }),
      head: CanvasObjectModel.createElement('image', { position: [15, 0], size: [45, 45], origin: "center", src: "./src/img/textures/characters/heads/player.png" })
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


    this.position = { x: 0, y: 0 };
    this.angle = 0;
    this.walkingSpeed = 10;
    this.runningSpeed = 5;

    this.inventory = Inventory.createStorage();

    let equipment = { head: new Item, body: new Item, pants: new Item, boots: new Item, lhand: new Item, rhand: new Item };
    let equipmentChanged = this.equipmentChanged;
    this.equipment = {
      get head() { return equipment.head },
      get body() { return equipment.body },
      get pants() { return equipment.pants },
      get boots() { return equipment.boots },
      get lhand() { return equipment.lhand },
      get rhand() { return equipment.rhand },

      set head(value) { equipment.head = value; self.equipmentChanged() },
      set body(value) { equipment.body = value; self.equipmentChanged() },
      set pants(value) { equipment.pants = value; self.equipmentChanged() },
      set boots(value) { equipment.boots = value; self.equipmentChanged() },
      set lhand(value) { equipment.lhand = value; self.equipmentChanged() },
      set rhand(value) { equipment.rhand = value; self.equipmentChanged() },
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
      rootElement: { get: () => elements.character },
      elements: { get: () => elements }
    });

    this.equipmentChanged();
  }

  equipmentChanged() {
    this.stats = { maxHP: 1000, defence: 0, walkingSpeed: 0, runningSpeed: 0, bulletSpeed: 0, armed: false };
    for (let item in this.equipment) {
      if (this.equipment[item].name == "empty") {
        switch (item) {
          case "body":
            this.changeTextures(JSON.parse(localStorage.getItem('equipment')).clth_empty.textures);
            break; case "rhand":
            let wpn = JSON.parse(localStorage.getItem('equipment')).wpn_empty
            this.changeTextures(wpn.textures);
            this.changeAnimation(wpn.animation);
            break;
        }
      } else {
        if (this.equipment[item].animation) this.changeAnimation(this.equipment[item].animation);
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

  changeAnimation(name, index = 0) {
    this.currentAnimation = JSON.parse(localStorage.getItem('animations'))[name];
    this.setAnimationFrame(index);
  }

  setAnimationFrame(index) {
    let frame = this.currentAnimation[this.currentAnimationFrame];
    for (let parts in frame)
      this.elements[parts].setProperties(frame[parts]);
  }
}

const player = new Character;
ObjectList.player = player;


















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
  }

  hitTest(x, y, width, height) {
    if (this.solidObjects.children.length == 0) return false;
    for (let i = 0; i < this.solidObjects.children.length; i++)
      if (
        this.solidObjects.children[i].x < x + width &&
        this.solidObjects.children[i].x + this.solidObjects.children[i].width > x &&
        this.solidObjects.children[i].y < y + height &&
        this.solidObjects.children[i].y + this.solidObjects.children[i].height > y
      ) return true;
    return false;
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
  canvas.insert(player.rootElement);
  canvas.insert(map.foregroundDecorations);
});


//Загрузка карты
map.loadMapByName('home');




















// Управление
let up = false,
  right = false,
  down = false,
  left = false,
  shift = false;


document.addEventListener('keydown', e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 38) up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ || e.keyCode === 39) right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ || e.keyCode === 40) down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 37) left = true;
  if (e.keyCode === 16) shift = true;

  if (e.keyCode === 27) {
    let ui = document.querySelector('.menu');
    window.running = ui.classList.contains('show');
    (ui.classList.contains('show')) ? (ui.classList.remove('show'), mainLoop.block = false) : (ui.classList.add('show'), mainLoop.block = true);
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
  let addX = 0, addY = 0, speed = player.walkingSpeed;
  if (shift) speed += player.runningSpeed;
  if (up) addY -= speed;
  if (right) addX += speed;
  if (down) addY += speed;
  if (left) addX -= speed;
  if (!map.hitTest(player.position.x + addX - 20, player.position.y - 20, 40, 40)) player.position.x += addX;
  if (!map.hitTest(player.position.x - 20, player.position.y + addY - 20, 40, 40)) player.position.y += addY;

  map.changePosition(player.position);
  player.rootElement.angle = player.angle;

}

const createObjectsFromStack = () => {
  creationStack.forEach(element => {
    switch (element.to) {
      case "solid":
        map.solidObjects.insert(element.object);
        break; case "background":
        map.backgroundDecorations.insert(element.object);
        break; case "foreground":
        map.foregroundDecorations.insert(element.object);
    }
  });
  creationStack = new Array;
}






document.addEventListener('mousemove', e => {
  player.angle = -(180 / Math.PI * Math.atan2(player.rootElement.x + player.rootElement.width / 2 - e.clientX, player.rootElement.y + player.rootElement.height / 2 - e.clientY));
});

document.addEventListener('mousedown', e => {
  if (mainLoop.block || !player.stats.armed) return;
  let mouse = {
    x: e.clientX - document.body.offsetWidth / 2,
    y: e.clientY - document.body.offsetHeight / 2
  },
    sx = Math.abs(mouse.x) / ((Math.abs(mouse.x) + Math.abs(mouse.y)) / 100),
    sy = Math.abs(mouse.y) / ((Math.abs(mouse.x) + Math.abs(mouse.y)) / 100);
  sx = player.stats.bulletSpeed * sx / 100;
  if (mouse.x < 0) sx = -sx;
  sy = player.stats.bulletSpeed * sy / 100;
  if (mouse.y < 0) sy = -sy;

  let bullet = CanvasObjectModel.createElement('rectangle', {
    size: [3, 40],
    origin: "center",
    angle: player.angle,
    position: [player.position.x - 1.5, player.position.y - 20],
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
      }`}
  });

  creationStack.push({ to: "background", object: bullet });
});





















mainLoop.insertFunction(createObjectsFromStack);
mainLoop.insertFunction(movement);
mainLoop.insertFunction(() => mainController.canvas.render());

mainLoop.block = false