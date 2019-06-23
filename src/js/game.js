const ObjectList = new Array;
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

document.body.addEventListener('resize', () => (mainLoop.block)?mainLoop.executeNow():undefined);














console.error("СДЕЛАЙ НОРМАЛЬНУЮ СИСТЕМУ ПРЕДМЕТОВ, ЭТА КОСЯНАЯ ХУЙНЯ НИКУДА НЕ ГОДИТСЯ");

const player = new class Character {
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
    this.angle = 0,
      this.walkingSpeed = 10,
      this.runningSpeed = 5;

    let equipment = {
      head: { name: 'empty' },
      body: { name: "clth_gray_cloack", type: "body"},
      pants: { name: 'empty' },
      boots: { name: 'empty' },
      lhand: { name: 'empty' },
      rhand: { name: "wpn_machinegun", type: "rhand"}
    }

    this.equipment = {
      self,
      get head() { return equipment.head },
      set head(value) {
        if (value.name == 'empty') return;
        self.changeEquipment(value.name);
        equipment.head = value;
      },
      get body() { return equipment.body },
      set body(value) {
        if (value.name == 'empty') {
          self.changeEquipment("clth_empty");
          equipment.body = value;
          return;
        }
        self.changeEquipment(value.name);
        equipment.body = value;
      },
      get pants() { return equipment.pants },
      set pants(value) {
        if (value.name == 'empty') return;
        self.changeEquipment(value.name);
        equipment.pants = value;
      },
      get boots() { return equipment.boots },
      set boots(value) {
        if (value.name == 'empty') return;
        self.changeEquipment(value.name);
        equipment.boots = value;
      },
      get lhand() { return equipment.lhand },
      set lhand(value) {
        if (value.name == 'empty') return;
        self.changeEquipment(value.name);
        equipment.lhand = value;
      },
      get rhand() { return equipment.rhand },
      set rhand(value) {
        self.changeEquipment((value.name == "empty") ? 'wpn_empty' : value.name);
        equipment.rhand = value;
      }
    };

    Object.defineProperties(this, {
      rootElement: { get: () => elements.character },
      elements: { get: () => elements }
    });

    for(let item in equipment)this.equipment[item] = equipment[item];
  }

  changeEquipment(name) {
    let equipment = JSON.parse(localStorage.getItem('equipment'))[name];

    if (equipment.animationType) {
      this.changeAnimation(equipment.animationType);
      delete equipment.animationType;
    }

    for (let textures in equipment)
      this.elements[textures].src = equipment[textures];
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

  if (e.keyCode === 81) {
    if (/dead_/.test(map.mapname)) {
      map.loadMapByName(map.mapname.replace("dead_", ""));
    } else {
      map.loadMapByName("dead_" + map.mapname);
    }
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
  if (!map.hitTest(player.position.x + addX - 40, player.position.y - 40, 80, 80)) player.position.x += addX;
  if (!map.hitTest(player.position.x - 40, player.position.y + addY - 40, 80, 80)) player.position.y += addY;

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

let loopIsRunning = true;

// const gameLoop = () => {
//   mainController.canvas.rerenderChangeTimeout(() => {
//     createObjectsFromStack();
//     movement();
//   })
//   if (loopIsRunning) return window.requestAnimationFrame(gameLoop)
// }; window.requestAnimationFrame(gameLoop);

document.addEventListener('mousemove', e => {
  player.angle = -(180 / Math.PI * Math.atan2(player.rootElement.x + player.rootElement.width / 2 - e.clientX, player.rootElement.y + player.rootElement.height / 2 - e.clientY));
});

let bulletSpeed = 40;

document.addEventListener('click', e => {
  if (mainLoop.block) return;
  let mouse = {
    x: e.clientX - document.body.offsetWidth / 2,
    y: e.clientY - document.body.offsetHeight / 2
  };
  let sx = Math.abs(mouse.x) / ((Math.abs(mouse.x) + Math.abs(mouse.y)) / 100),
    sy = Math.abs(mouse.y) / ((Math.abs(mouse.x) + Math.abs(mouse.y)) / 100);
  sx = bulletSpeed * sx / 100;
  if (mouse.x < 0) sx = -sx;
  sy = bulletSpeed * sy / 100;
  if (mouse.y < 0) sy = -sy;
  console.log({
    sx, sy,
    x: player.position.x,
    y: player.position.y
  });
  let bullet = CanvasObjectModel.createElement('rectangle', {
    size: [3, 40], origin: "center", angle: player.angle, position: [player.position.x - 1.5, player.position.y - 20], color: "#ff08",
    deleteStep: 100, currentStep: 0, renderBlock: true, dynamicProperties: { x: sx, y: sy, fx: "()=>{if(this.currentStep==this.deleteStep)this.remove();this.currentStep++}" }
  })
  creationStack.push({ to: "background", object: bullet });
})

// Object.defineProperty(this, 'running', {
//   set: value => {
//     if (value && !loopIsRunning) window.requestAnimationFrame(gameLoop);
//     loopIsRunning = value;
//   },
//   get: () => loopIsRunning
// });

mainLoop.insertFunction(createObjectsFromStack);
mainLoop.insertFunction(movement);
mainLoop.insertFunction(() => mainController.canvas.render());

mainLoop.block = false