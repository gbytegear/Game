localStorage.setItem('map', JSON.stringify({
  home: {
    tiles: {
      defaultTile: "./src/img/tiles/grass1.jpg",
      rangeTiles: [
        { fromX: -2, toX: 21, fromY: -5, toY: 5, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
        { fromX: -4, toX: 0, fromY: -3, toY: 7, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
        { fromX: -4, toX: -2, fromY: 7, toY: 10, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
        { fromX: -6, toX: 1, fromY: 10, toY: 20, src: "./src/img/tiles/planks.jpg" }, //planks.jpg
      ]
    },

    foreground: [],
    background: [],

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
          position: [500, -500], size: [10, 250], color: "black", //right 1
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
          position: [-50, 500], size: [1050, 10], color: "black", //bottom 2
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


      {
        type: 'rectangle', properties: {
          position: [-200, 500], size: [150, 10], color: "#954d33", //door bottom
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
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










      //----ROOM 0x2 left-top(-400,500)
      {
        type: 'rectangle', properties: {
          position: [-600, 1000], size: [210, 10], color: "black", //top 1
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
      {
        type: 'rectangle', properties: {
          position: [-200, 1000], size: [310, 10], color: "black", //top 2
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
      {
        type: 'rectangle', properties: {
          position: [-600, 1000], size: [10, 1010], color: "black", //left
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
      {
        type: 'rectangle', properties: {
          position: [100, 1000], size: [10, 200], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },

      {
        type: 'rectangle', properties: {
          position: [100, 1400], size: [10, 200], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },

      {
        type: 'rectangle', properties: {
          position: [100, 1800], size: [10, 210], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },

      {
        type: 'rectangle', properties: {
          position: [-600, 2000], size: [700, 10], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
    ]
  },















  dead_home: {
    tiles: {
      defaultTile: "./src/img/tiles/dirt.jpg",
      rangeTiles: [
        { fromX: -2, toX: 21, fromY: -5, toY: 5, src: "./src/img/tiles/planks_gs.jpg" }, //planks.jpg
        { fromX: -4, toX: 0, fromY: -3, toY: 7, src: "./src/img/tiles/planks_gs.jpg" }, //planks.jpg
        { fromX: -4, toX: -2, fromY: 7, toY: 10, src: "./src/img/tiles/planks_gs.jpg" }, //planks.jpg
        { fromX: -6, toX: 1, fromY: 10, toY: 20, src: "./src/img/tiles/planks_gs.jpg" }, //planks.jpg
      ]
    },

    foreground: [],
    background: [
      {
        type: 'image', properties: {
          position: [-195, 400], size: [140, 237], src: "./src/img/textures/objects/door_gs.jpg", //door bottom
          shadow: { x: 0, y: 0, color: "#000", blur: 10 }
        }
      },
    ],

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
          position: [500, -500], size: [10, 250], color: "black", //right 1
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
          position: [-50, 500], size: [1050, 10], color: "black", //bottom 2
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










      //----ROOM 0x2 left-top(-400,500)
      {
        type: 'rectangle', properties: {
          position: [-600, 1000], size: [210, 10], color: "black", //top 1
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
      {
        type: 'rectangle', properties: {
          position: [-200, 1000], size: [310, 10], color: "black", //top 2
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
      {
        type: 'rectangle', properties: {
          position: [-600, 1000], size: [10, 1010], color: "black", //left
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
      {
        type: 'rectangle', properties: {
          position: [100, 1000], size: [10, 200], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },

      {
        type: 'rectangle', properties: {
          position: [100, 1400], size: [10, 200], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },

      {
        type: 'rectangle', properties: {
          position: [100, 1800], size: [10, 210], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },

      {
        type: 'rectangle', properties: {
          position: [-600, 2000], size: [700, 10], color: "black", //right
          shadow: { x: 0, y: 0, color: "#000", blur: 30 }
        }
      },
    ]
  }
}));



localStorage.setItem('equipment', JSON.stringify({
  //Clothes
  clth_empty: {
    type: "body",
    textures: {
      body: "./src/img/textures/characters/clothes_empty/body.png",
      handL1: "./src/img/textures/characters/clothes_empty/handL1.png",
      handL2: "./src/img/textures/characters/clothes_empty/handL2.png",
      handR1: "./src/img/textures/characters/clothes_empty/handR1.png",
      handR2: "./src/img/textures/characters/clothes_empty/handR2.png",
    },
    properties: {
      defence: 0
    }
  },

  clth_gray_cloack: {
    type: "body",
    textures: {
      body: "./src/img/textures/characters/gray_cloack/body.png",
      handL1: "./src/img/textures/characters/gray_cloack/handL1.png",
      handL2: "./src/img/textures/characters/gray_cloack/handL2.png",
      handR1: "./src/img/textures/characters/gray_cloack/handR1.png",
      handR2: "./src/img/textures/characters/gray_cloack/handR2.png",
    },
    properties: {
      defence: 10
    }
  },

  //Backpacks
  bp_empty: {
    type: "backpack",
    textures: {
      backpack: ""
    }
  },
  bp_small: {
    type: "backpack",
    textures: {
      backpack: "./src/img/textures/characters/gray_cloack/backpack.png"
    }
  },

  //Weapon
  wpn_empty: {
    type: "rhand",
    textures: {
      weapon: "",
    },
    animation: "noweapon",
    properties: {
      armed: false
    }
  },
  wpn_machinegun: {
    type: "rhand",
    textures: {
      weapon: "./src/img/textures/characters/weapon/machingun.png",
    },
    animation: "rifle",
    properties: {
      bulletSpeed: 40,
      armed: true
    }
  }
}));


localStorage.setItem('animations', JSON.stringify({
  noweapon: [{
    head: { angle: 0 },
    body: { angle: 0 },
    handL1: { angle: -20, visible: 'false' },
    handL2: { angle: 60 },
    handR1: { angle: 30, visible: 'false' },
    handR2: { angle: -90 },
  }],
  rifle: [{
    head: { angle: -45 },
    body: { angle: 45 },
    handL1: { angle: -15, visible: 'true' },
    handL2: { angle: 50 },
    handR1: { angle: 20, visible: 'true' },
    handR2: { angle: -100 },
    weapon: { angle: 38 }
  }],
}));