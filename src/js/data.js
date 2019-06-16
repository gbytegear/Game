localStorage.setItem('map',JSON.stringify({
    home:{
        tiles: {
          defaultTile: "./src/img/tiles/grass1.jpg",
          rangeTiles: [
            { fromX: -2, toX: 21, fromY: -5, toY: 5, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
            { fromX: -4, toX: 0, fromY: -3, toY: 7, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
            { fromX: -4, toX: -2, fromY: 7, toY: 10, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
          ]
        },
        solid: [
          //----ROOM 0x0 left-top(-400,-500)
          //Walls
          {
            type: 'rectangle', properties: {
              position: [-200, -500], size: [10, 200], color: "black", //corner left
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [-400, -300], size: [210, 10], color: "black", //corner top
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [-200, -500], size: [2300, 10], color: "black", //top
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [-400, -300], size: [10, 1300], color: "black", //left
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [500, -500], size: [10, 200], color: "black", //right 1
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [500, -100], size: [10, 610], color: "black", //right 2
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [-400, 500], size: [200, 10], color: "black", //bottom 1
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [0, 500], size: [1000, 10], color: "black", //bottom 2
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
      
          {
            type: 'rectangle', properties: {
              position: [-100, -500], size: [100, 10], color: "#fff8", //top window 1
              shadow: { x: 0, y: 30, color: "white", blur: 40 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [100, -500], size: [100, 10], color: "#fff8", //top window 2
              shadow: { x: 0, y: 30, color: "white", blur: 40 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [300, -500], size: [100, 10], color: "#fff8", //top window 3
              shadow: { x: 0, y: 30, color: "white", blur: 40 }
            }
          },
      
          //----ROOM 0x1 left-top(-400,500)
          {
            type: 'rectangle', properties: {
              position: [0, 500], size: [10, 200], color: "black", //right 1
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [-200, 700], size: [10, 300], color: "black", //right 2
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },
          {
            type: 'rectangle', properties: {
              position: [-200, 700], size: [210, 10], color: "black", //bottom
              shadow: { x: 0, y: 0, color: "#000", blur: 30 }
            }
          },

          //----ROOM 0x1 left-top(-400,500)
          
        ]
      }
}));



localStorage.setItem('equipment',JSON.stringify({
    //Clothes
    grayCloack: {
        body:"./src/img/textures/characters/gray_cloack/body.png",
        handL1:"./src/img/textures/characters/gray_cloack/handL1.png",
        handL2:"./src/img/textures/characters/gray_cloack/handL2.png",
        handR1:"./src/img/textures/characters/gray_cloack/handR1.png",
        handR2:"./src/img/textures/characters/gray_cloack/handR2.png",
    },
    //Weapon
    machinegun: {
        weapon: "./src/img/textures/characters/weapon/machingun.png"
    }
}));


localStorage.setItem('animations',JSON.stringify({
    noWeapon: [{
        head:{angle: 0},
        body:{angle: 0},
        handL1:{angle: -20},
        handL2:{angle: 60},
        handR1:{angle: 30},
        handR2:{angle: -90},
    }],
    machinegun: [{
        head:{angle: -45},
        body:{angle: 45},
        handL1:{angle: -15},
        handL2:{angle: 50},
        handR1:{angle: 20},
        handR2:{angle: -100},
        weapon:{angle: 38}
    }],
}));

// character = CanvasObjectModel.createElement('item', { size: [78.75, 52.5], origin: "center", anchors: { position: "center" } }),
// body = CanvasObjectModel.createElement('image', { position: [0, 0], origin: "center", angle: 45, anchors: { size: "fill" }, src: "./src/img/textures/characters/gray_cloack/body.png" }),
// handL1 = CanvasObjectModel.createElement('image', { position: [0, -15], origin: [10, 45], angle: -15, size: [19, 50], src: "./src/img/textures/characters/gray_cloack/handL1.png" }),
// handL2 = CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], angle: 50, size: [19, 50], src: "./src/img/textures/characters/gray_cloack/handL2.png" }),
// handR1 = CanvasObjectModel.createElement('image', { position: [59.75, -15], origin: [10, 45], angle: 20, size: [19, 50], src: "./src/img/textures/characters/gray_cloack/handL1.png" }),
// handR2 = CanvasObjectModel.createElement('image', { position: [0, -37], origin: [10, 45], angle: -100, size: [19, 50], src: "./src/img/textures/characters/gray_cloack/handL2.png" }),
// weapon = CanvasObjectModel.createElement('image', { position: [0, -80], origin: [10, 80], angle: 38, size: [20, 128], src: "./src/img/textures/characters/weapon/machingun.png" }),
// backpack = CanvasObjectModel.createElement('image', { position: [0, 0], anchors: { size: "fill" }, src: "./src/img/textures/characters/gray_cloack/backpack.png" }),
// head = CanvasObjectModel.createElement('image', { position: [15, 0], size: [45, 45], origin: "center", angle: -45, src: "./src/img/textures/characters/gray_cloack/head.png" });