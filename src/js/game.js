const playerCharacter = new class {
  constructor() {
    let elements = {
      character: CanvasObjectModel.createElement('item', { size: [78.75, 52.5], origin: "center", anchors: { position: "center" } }),
      body: CanvasObjectModel.createElement('image', { position: [0, 0], origin: "center", anchors: { size: "fill" } }),
      handL1: CanvasObjectModel.createElement('image', { position: [0, -15], origin: [10, 45], size: [19, 50] }),
      handL2: CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], size: [19, 50] }),
      handR1: CanvasObjectModel.createElement('image', { position: [59.75, -15], origin: [10, 45], size: [19, 50] }),
      handR2: CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], size: [19, 50] }),
      weapon: CanvasObjectModel.createElement('image', { position: [0, -80], origin: [10, 80], size: [20, 128] }),
      backpack: CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" } }),
      head: CanvasObjectModel.createElement('image', { position: [15, 0], size: [45, 45], origin: "center", src: "./src/img/textures/characters/gray_cloack/head.png" })
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

    Object.defineProperties(this, {
      rootElement: {get: () => elements.character},
      elements: {get:()=>elements},
      animationType: {
        set: animation => this.changeAnimation(animation)
      }
    });

    this.changeEquipment('clth_grayCloack');
    this.changeEquipment('wpn_empty');
    // this.changeAnimation('noweapon');
  }

  changeEquipment(name) {
    let equipment = JSON.parse(localStorage.getItem('equipment'))[name];

    if(equipment.animationType){
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
  canvas.insert(playerCharacter.rootElement);
  canvas.insert(map.foregroundDecorations);
});


//Загрузка карты
map.loadMap(JSON.parse(localStorage.getItem('map')).home);














// Управление
let up = false,
  right = false,
  down = false,
  left = false,
  shift = false
playerPosition = { x: 0, y: 0 },
  playerAngle = 0,
  playerWalkingSpeed = 10,
  playerRunningSpeed = 5;

document.addEventListener('keydown', e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 38) up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ || e.keyCode === 39) right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ || e.keyCode === 40) down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 37) left = true;
  if (e.keyCode === 16) shift = true;

  if (e.keyCode === 27) {
    let ui = document.querySelector('.menu');
    window.running = ui.classList.contains('show');
    (ui.classList.contains('show')) ? ui.classList.remove('show') : ui.classList.add('show');
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
  let addX = 0, addY = 0, speed = playerWalkingSpeed;
  if (shift) speed += playerRunningSpeed;
  if (up) addY -= speed;
  if (right) addX += speed;
  if (down) addY += speed;
  if (left) addX -= speed;
  if (!map.hitTest(playerPosition.x + addX - 40, playerPosition.y - 40, 80, 80)) playerPosition.x += addX;
  if (!map.hitTest(playerPosition.x - 40, playerPosition.y + addY - 40, 80, 80)) playerPosition.y += addY;
  mainController.canvas.rerenderChangeTimeout(() => {
    map.changePosition(playerPosition);
    playerCharacter.rootElement.angle = playerAngle;
  })
}

let loopIsRunning = true;

const gameLoop = () => {
  movement();
  if (loopIsRunning) return window.requestAnimationFrame(gameLoop)
}; window.requestAnimationFrame(gameLoop);

document.addEventListener('mousemove', e => {
  playerAngle = -(180 / Math.PI * Math.atan2(playerCharacter.rootElement.x + playerCharacter.rootElement.width / 2 - e.clientX, playerCharacter.rootElement.y + playerCharacter.rootElement.height / 2 - e.clientY));
});

let bulletSpeed = 10;

document.addEventListener('click', e => {
  let mouse = {
    x:e.clientX - document.body.offsetWidth/2,
    y:e.clientY - document.body.offsetHeight/2
  };
  let sx = Math.abs(mouse.x) / ((Math.abs(mouse.x) + Math.abs(mouse.y))/100),
  sy = Math.abs(mouse.y) / ((Math.abs(mouse.x) + Math.abs(mouse.y))/100);
  sx = bulletSpeed * sx / 100;
  if(mouse.x < 0) sx = -sx;
  sy = bulletSpeed * sy / 100;
  if(mouse.y < 0) sy = -sy;
  console.log({
    sx,sy,
    x:playerPosition.x,
    y:playerPosition.y
  });
  let bullet = CanvasObjectModel.createElement('rectangle', { size: [10, 10], origin: "center", position: [playerPosition.x, playerPosition.y], color: "red",
  deleteStep: 100, currentStep:0, dynamicProperties: {x:sx, y:sy/*, fx:"()=>{if(this.currentStep==this.deleteStep)return this.remove();this.currentStep++}"*/}})
  map.foregroundDecorations.insert(bullet);
})

Object.defineProperty(this, 'running', {
  set: value => {
    if (value && !loopIsRunning) window.requestAnimationFrame(gameLoop);
    loopIsRunning = value;
  },
  get: () => loopIsRunning
});