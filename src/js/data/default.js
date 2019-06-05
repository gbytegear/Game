localStorage.setItem("map", JSON.stringify({
    "0x0": {
        tiles: 
        [
            {  src: "./src/img/tiles/grass.jpg", size: {width:80, height: 80} }
        ],
        objects: [
            { type: "textured", position: {x: 100, y: 400}, size: {width:200, height:200}, texture: "./src/img/textures/box.jpg" }
        ]
    },
    "1x0": {
        tiles: 
        [
            {  src: "./src/img/tiles/grass.jpg", size: {width:80, height: 80} }
        ]
    }
}));