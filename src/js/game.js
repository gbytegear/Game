const playerCharacter = new class {
  constructor() {
    let
      character = CanvasObjectModel.createElement('item', { size: [78.75, 52.5], origin: "center", anchors: { position: "center" } });
    this.body = CanvasObjectModel.createElement('image', { position: [0, 0], origin: "center", anchors: { size: "fill" }});
    this.handL1 = CanvasObjectModel.createElement('image', { position: [0, -15], origin: [10, 45], size: [19, 50]});
    this.handL2 = CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], size: [19, 50]});
    this.handR1 = CanvasObjectModel.createElement('image', { position: [59.75, -15], origin: [10, 45], size: [19, 50]});
    this.handR2 = CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], size: [19, 50]});

    this.weapon = CanvasObjectModel.createElement('image', { position: [0, -80], origin: [10, 80], size: [20, 128]});
    this.backpack = CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" }});
    this.head = CanvasObjectModel.createElement('image', { position: [15, 0], size: [45, 45], origin: "center", src: "./src/img/textures/characters/gray_cloack/head.png" });

    character.insert(this.body);
    this.handL1.insert(this.handL2);
    this.body.insert(this.handL1);
    this.handR2.insert(this.weapon);
    this.handR1.insert(this.handR2);
    this.body.insert(this.backpack);
    this.body.insert(this.handR1);
    this.body.insert(this.head);

    this.currentAnimation = null;
    this.currentAnimationFrame = 0;

    Object.defineProperties(this, {
      character: {
        get: () => character
      }
    });

    this.changeEquipment('grayCloack');
    this.changeAnimation('noWeapon');
  }

  changeEquipment(name){
    let equipment = JSON.parse(localStorage.getItem('equipment'))[name];
    for(let textures in equipment)
      this[textures].src = equipment[textures];
  }

  changeAnimation(name, index = 0){
    this.currentAnimation = JSON.parse(localStorage.getItem('animations'))[name];
    this.setAnimationFrame(index);
  }

  setAnimationFrame(index){
    let frame = this.currentAnimation[this.currentAnimationFrame];
    for(let parts in frame)
      this[parts].setProperties(frame[parts]);
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
  }

  hittTest(x, y, width, height) {
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
  canvas.insert(map.foregroundDecorations);
  canvas.insert(playerCharacter.character);
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
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ ||  e.keyCode === 38) up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ||  e.keyCode === 39) right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ||  e.keyCode === 40) down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ ||  e.keyCode === 37) left = true;
  if (e.keyCode === 16) shift = true;

  if (e.keyCode === 27){
    let ui = document.querySelector('.menu');
    if(ui.classList.contains('show')){ui.classList.remove('show')}else ui.classList.add('show');
  }
});


document.addEventListener('keyup', e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ ||  e.keyCode === 38) up = false;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ||  e.keyCode === 39) right = false;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ||  e.keyCode === 40) down = false;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ ||  e.keyCode === 37) left = false;
  if (e.keyCode === 16) shift = false;
});

const gameLoop = () => {

  // if(!up && !down && !left && !right)return;
  let addX = 0, addY = 0, speed = playerWalkingSpeed;
  if (shift) speed += playerRunningSpeed;
  if (up) addY -= speed;
  if (right) addX += speed;
  if (down) addY += speed;
  if (left) addX -= speed;
  if (!map.hittTest(playerPosition.x + addX - 40, playerPosition.y - 40, 80, 80)) playerPosition.x += addX;
  if (!map.hittTest(playerPosition.x - 40, playerPosition.y + addY - 40, 80, 80)) playerPosition.y += addY;
  mainController.canvas.rerenderChangeTimeout(() => {
    map.changePosition(playerPosition);
    playerCharacter.character.angle = playerAngle;
  })
  return window.requestAnimationFrame(gameLoop)
}; window.requestAnimationFrame(gameLoop);

document.addEventListener('mousemove', e => {
  playerAngle = -(180 / Math.PI * Math.atan2(playerCharacter.character.x + playerCharacter.character.width / 2 - e.clientX, playerCharacter.character.y + playerCharacter.character.height / 2 - e.clientY));
});