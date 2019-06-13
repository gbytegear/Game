let character = CanvasObjectModel.createElement('item', { size: [78.75, 52.5], origin: "center", anchors: { position: "center" } }),
  body = CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" }, src: "./src/img/textures/characters/gray_cloack/body.png" }),
  head = CanvasObjectModel.createElement('image', { position: [15, 0], size: [45, 45], origin: "center", src: "./src/img/textures/characters/gray_cloack/head.png" })
character.insert(body);
character.insert(head);

let map = new class {
  constructor() {
    this.tiles = CanvasObjectModel.createElement('tiledMap', {
      position: [0, 0],
      tileSize: [100, 100],
      defaultTile: "./src/img/tiles/sand.jpg"
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

//Загрузка карты
map.loadMap({
  tiles: {
    rangeTiles: [
      { fromX: -5, toX: 5, fromY: -5, toY: 5, src: "./src/img/tiles/metal.jpg" },
      { fromX: 5, toX: 10, fromY: -1, toY: 1, src: "./src/img/tiles/metal.jpg" },
    ]
  },
  solid: [
    { type: 'image', properties: { position: [100, 100], size: [100, 100], src: "./src/img/textures/box.jpg" } },
    //Walls
    { type: 'rectangle', properties: { position: [-500, -500], size: [1100, 5], color: "black" } },
    { type: 'rectangle', properties: { position: [-500, -500], size: [5, 1100], color: "black" } },
    { type: 'rectangle', properties: { position: [-500, 600], size: [1100, 5], color: "black" } },
    { type: 'rectangle', properties: { position: [600, -500], size: [5, 400], color: "black" } },
    { type: 'rectangle', properties: { position: [600, 200], size: [5, 400], color: "black" } }
  ]
})


mainController.canvas.rerenderChangeTimeout(canvas => {
  canvas.insert(map.tiles);
  canvas.insert(map.backgroundDecorations);
  canvas.insert(map.solidObjects);
  canvas.insert(map.foregroundDecorations);
  canvas.insert(character);
});

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