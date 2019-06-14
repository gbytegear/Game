let 
  character = CanvasObjectModel.createElement('item', { size: [78.75, 52.5], origin: "center", anchors: { position: "center" } }),
  body = CanvasObjectModel.createElement('image', { position: [0, 0], origin: "center", angle:45, anchors: { size: "fill" }, src: "./src/img/textures/characters/gray_cloack/body.png" }),

  handL1 = CanvasObjectModel.createElement('image', { position: [0, -15], origin: [10,45],angle: -15, size:[19,50], src: "./src/img/textures/characters/gray_cloack/handL1.png" }),
  handL2 = CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10,45], angle: 50, size:[19,50], src: "./src/img/textures/characters/gray_cloack/handL2.png" }),

  handR1 = CanvasObjectModel.createElement('image', { position: [59.75, -15], origin: [10,45], angle: 20, size:[19,50], src: "./src/img/textures/characters/gray_cloack/handL1.png" }),
  handR2 = CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10,45], angle: -100, size:[19,50], src: "./src/img/textures/characters/gray_cloack/handL2.png" }),
  weapon = CanvasObjectModel.createElement('image', { position: [0, -80], origin: [10,80], angle: 45, size:[20,128], src: "./src/img/textures/characters/weapon/machingun.png" }),

  backpack = CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" }, src: "./src/img/textures/characters/gray_cloack/backpack.png" }),
  head = CanvasObjectModel.createElement('image', { position: [15, 0], size: [45, 45], origin: "center", angle:-45, src: "./src/img/textures/characters/gray_cloack/head.png" });

character.insert(body);
handL1.insert(handL2);
body.insert(handL1);
handR2.insert(weapon);
handR1.insert(handR2);
body.insert(backpack);
body.insert(handR1);
body.insert(head);

let map = new class {
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
  canvas.insert(character);
});


//Загрузка карты
map.loadMap({
  tiles: {
    defaultTile: "./src/img/tiles/grass1.jpg",
    rangeTiles: [
      { fromX: -2, toX: 21, fromY: -5, toY: 5, src: "./src/img/tiles/planks.jpg" },
      { fromX: -4, toX: 0, fromY: -3, toY: 7, src: "./src/img/tiles/planks.jpg" },
    ]
  },
  solid: [
    //----ROOM 0x0
    //Walls
    { type: 'rectangle', properties: { position: [-200, -500], size: [10, 200], color: "black", //corner left
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } }, 
    { type: 'rectangle', properties: { position: [-400, -300], size: [210, 10], color: "black", //corner top
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } }, 
    { type: 'rectangle', properties: { position: [-200, -500], size: [2300, 10], color: "black", //top
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } }, 
    { type: 'rectangle', properties: { position: [-400, -300], size: [10, 800], color: "black", //left
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } },
    { type: 'rectangle', properties: { position: [500, -500], size: [10, 200], color: "black", //right 1
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } },
    { type: 'rectangle', properties: { position: [500, -100], size: [10, 610], color: "black", //right 2
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } },
    { type: 'rectangle', properties: { position: [-400, 500], size: [200, 10], color: "black", //bottom 1
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } },
    { type: 'rectangle', properties: { position: [0, 500], size: [1000, 10], color: "black", //bottom 2
    shadow:{x: 0, y: 0, color: "#000", blur: 30} } },

    { type: 'rectangle', properties: { position: [-100, -500], size: [100, 10], color: "#fff8", //top window 1
    shadow:{x: 0, y: 30, color: "white", blur: 40} } }, 
    { type: 'rectangle', properties: { position: [100, -500], size: [100, 10], color: "#fff8", //top window 2
    shadow:{x: 0, y: 30, color: "white", blur: 40} } }, 
    { type: 'rectangle', properties: { position: [300, -500], size: [100, 10], color: "#fff8", //top window 3
    shadow:{x: 0, y: 30, color: "white", blur: 40} } }, 

    //----ROOM 1x0
  ]
});



//{ type: 'image', properties: { position: [600, 100], size: [100, 100], shadow:{x: 20, y: 20, color: "#0008", blur: 10}, src: "./src/img/textures/box.jpg" } },
//{ type: 'rectangle', properties: { position: [-500, -500], size: [1100, 5], color: "black" } },














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
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = true;
  if (e.keyCode === 16) shift = true;
});


document.addEventListener('keyup', e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = false;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = false;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = false;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = false;
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
  if (!map.hittTest(playerPosition.x + addX - 25, playerPosition.y - 25, 50, 50)) playerPosition.x += addX;
  if (!map.hittTest(playerPosition.x - 25, playerPosition.y + addY - 25, 50, 50)) playerPosition.y += addY;
  mainController.canvas.rerenderChangeTimeout(() => {
    map.changePosition(playerPosition);
    character.angle = playerAngle;
  })
  return window.requestAnimationFrame(gameLoop)
}; window.requestAnimationFrame(gameLoop);

document.addEventListener('mousemove', e => {
  playerAngle = -(180 / Math.PI * Math.atan2(character.x + character.width / 2 - e.clientX, character.y + character.height / 2 - e.clientY));
});