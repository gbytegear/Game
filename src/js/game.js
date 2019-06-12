let character = CanvasObjectModel.createElement('item', {size: [105, 70], origin: "center", anchors: {position: "center"}}),
    body = CanvasObjectModel.createElement('image', { position: [0, 0], anchors: {size: "fill"}, src: "./src/img/textures/characters/gray_cloack/body.png" }),
    head = CanvasObjectModel.createElement('image', { position: [20, 0], size: [60, 60], origin: "center", src: "./src/img/textures/characters/gray_cloack/head.png" })
character.insert(body);
character.insert(head);

let tilemap = CanvasObjectModel.createElement('tiledMap', { position: [0, 0], size: [400, 400], tileSize: [51, 51], src: "./src/img/tiles/grass.jpg" })

mainController.canvas.rerenderChangeTimeout(canvas => {
    canvas.insert(tilemap);
    canvas.insert(character);
});

let up = false,
    right = false,
    down = false,
    left = false,
    playerPosition = {x:0, y:0};

document.addEventListener('keydown',e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ )up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */)right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */)down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ )left = true;
});


document.addEventListener('keyup',e => {
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ )up = false;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */)right = false;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */)down = false;
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ )left = false;
});

const gameLoop = () => {
  if (up)playerPosition.y -= 10;
  if (right)playerPosition.x += 10;
  if (down)playerPosition.y += 10;
  if (left)playerPosition.x -= 10;
  mainController.canvas.rerenderChangeTimeout(() => {
    tilemap.x = -playerPosition.x + document.body.offsetWidth / 2;
    tilemap.y = -playerPosition.y + document.body.offsetHeight / 2;
  })
  return window.requestAnimationFrame(gameLoop)
};window.requestAnimationFrame(gameLoop);

document.addEventListener('mousemove', e => {
    character.angle = -(180 / Math.PI * Math.atan2(character.x + character.width / 2 - e.clientX, character.y + character.height / 2 - e.clientY)) ;
});