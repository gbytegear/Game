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