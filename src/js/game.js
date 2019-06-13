let character = CanvasObjectModel.createElement('item', { size: [105, 70], origin: "center", anchors: { position: "center" } }),
  body = CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" }, src: "./src/img/textures/characters/gray_cloack/body.png" }),
  head = CanvasObjectModel.createElement('image', { position: [20, 0], size: [60, 60], origin: "center", src: "./src/img/textures/characters/gray_cloack/head.png" })
character.insert(body);
character.insert(head);

let map = new class {
  constructor(){
    this.tiles = CanvasObjectModel.createElement('tiledMap', {
      position: [0, 0],
      size: [400, 400],
      tileSize: [100, 100],
      defaultTile: "./src/img/tiles/sand.jpg",
      rangeTiles: [
        {fromX:10,toX:30,fromY:10,toY:20, src:"./src/img/tiles/metal.jpg"}
      ]
    });

    this.solidObjects = CanvasObjectModel.createElement('item', {anchors: { position: "center" } });
  }

  changePosition(position){
    this.tiles.x = -position.x + document.body.offsetWidth / 2;
    this.tiles.y = -position.y + document.body.offsetHeight / 2;
    this.solidObjects.x = -position.x + document.body.offsetWidth / 2;
    this.solidObjects.y = -position.y + document.body.offsetHeight / 2;
  }

  hittTest(x,y, width, height){
    if(this.solidObjects.children.length == 0)return false;
    for(let i = 0;i < this.solidObjects.children.length; i++)
      if(
        this.solidObjects.children[i].x < x+width &&
        this.solidObjects.children[i].x + this.solidObjects.children[i].width > x &&
        this.solidObjects.children[i].y < y+height &&
        this.solidObjects.children[i].y + this.solidObjects.children[i].height > y
      )return true;
    return false; 
  }
};

mainController.canvas.rerenderChangeTimeout(canvas => {
  canvas.insert(map.tiles);
  canvas.insert(map.solidObjects);
  canvas.insert(character);
});

// map.solidObjects.insert(CanvasObjectModel.createElement('image', { position: [100, 100], size: [100, 100], src: "./src/img/textures/box.jpg" }));
// map.solidObjects.insert(CanvasObjectModel.createElement('image', { position: [50, 50], size: [100, 100], src: "./src/img/textures/box.jpg" }));
map.solidObjects.insert(CanvasObjectModel.createElement('rectangle',{
  position:[1000,1000],
  size:[21 * 100,5],
  color:"black"
}));
map.solidObjects.insert(CanvasObjectModel.createElement('rectangle',{
  position:[3100,1000],
  size:[5,1100],
  color:"black"
}));
map.solidObjects.insert(CanvasObjectModel.createElement('rectangle',{
  position:[1000,2100],
  size:[2105,5],
  color:"black"
}));

let up = false,
  right = false,
  down = false,
  left = false,
  shift = false
  playerPosition = { x: 0, y: 0 },
  playerAngle = 0,
  playerWalkingSpeed = 10,
  playerRunningSpeed = 10;

document.addEventListener('keydown', e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = true;
  if (e.keyCode === 16)shift = true;
});


document.addEventListener('keyup', e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) up = false;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) right = false;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) down = false;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) left = false;
  if (e.keyCode === 16)shift = false;
});

const gameLoop = () => {

  // if(!up && !down && !left && !right)return;
  let addX = 0, addY = 0, speed = playerWalkingSpeed;
  if(shift)speed += playerRunningSpeed;
  if (up) addY -= speed;
  if (right) addX += speed;
  if (down) addY += speed;
  if (left) addX -= speed;
  if(!map.hittTest(playerPosition.x + addX - 35, playerPosition.y - 35 , 70, 70))playerPosition.x += addX;
  if(!map.hittTest(playerPosition.x - 35, playerPosition.y + addY - 35 , 70, 70))playerPosition.y += addY;
  mainController.canvas.rerenderChangeTimeout(() => {
    map.changePosition(playerPosition);
    character.angle = playerAngle;
  })
  return window.requestAnimationFrame(gameLoop)
}; window.requestAnimationFrame(gameLoop);

document.addEventListener('mousemove', e => {
  playerAngle = -(180 / Math.PI * Math.atan2(character.x + character.width / 2 - e.clientX, character.y + character.height / 2 - e.clientY));
});