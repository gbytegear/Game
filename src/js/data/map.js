localStorage.setItem('map', JSON.stringify({
    "street": {
        "tiles": {
            "defaultTile": "./src/img/tiles/grass1.jpg",
            "rangeTiles": [{
                "fromX": 5,
                "fromY": 15,
                "toX": 7,
                "toY": 24,
                "src": "./src/img/tiles/brick_road.png"
            }, {
                "fromX": -43,
                "fromY": 24,
                "toX": 61,
                "toY": 28,
                "src": "./src/img/tiles/asphalt.jpg"
            }]
        },
        "background": [],
        "solid": [{
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-320, 1470],
                "size": [820, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [470, 1460],
                "size": [30, 30]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [680, 1460],
                "size": [30, 30]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [680, 1470],
                "size": [1120, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1790, 100],
                "size": [10, 1380]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-320, 1190],
                "size": [10, 290]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-400, 1190],
                "size": [90, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-400, 700],
                "size": [10, 500]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-400, 700],
                "size": [110, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-300, 0],
                "size": [10, 710]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-300, 0],
                "size": [110, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-200, -100],
                "size": [10, 110]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-200, -100],
                "size": [1200, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [990, -100],
                "size": [10, 210]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [990, 100],
                "size": [810, 10]
            }
        }],
        "foreground": [],
        "actions": [{
            "x": 500,
            "y": 1420,
            "width": 180,
            "height": 40,
            "fx": "()=>{GameEngine.map.loadMapByName(\"home\")}"
        }]
    },
    "home": {
        "tiles": {
            "defaultTile": "./src/img/tiles/grass1.jpg",
            "rangeTiles": [{
                "fromX": -2,
                "fromY": -1,
                "toX": 2,
                "toY": 4,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": -3,
                "fromY": 0,
                "toX": 0,
                "toY": 5,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": -3,
                "fromY": 5,
                "toX": -1,
                "toY": 7,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": -4,
                "fromY": 7,
                "toX": 0,
                "toY": 12,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": -2,
                "fromY": 0,
                "toX": 1,
                "toY": 3,
                "src": "./src/img/tiles/bricks.jpg"
            }, {
                "fromX": 2,
                "fromY": -1,
                "toX": 10,
                "toY": 5,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": 10,
                "fromY": 1,
                "toX": 18,
                "toY": 4,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": 3,
                "fromY": 0,
                "toX": 9,
                "toY": 4,
                "src": "./src/img/tiles/bricks.jpg"
            }, {
                "fromX": -3,
                "fromY": 8,
                "toX": -1,
                "toY": 11,
                "src": "./src/img/tiles/bricks.jpg"
            }, {
                "fromX": 18,
                "fromY": 14,
                "toX": 13,
                "toY": 8,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": 14,
                "fromY": 8,
                "toX": 18,
                "toY": 13,
                "src": "./src/img/tiles/planks.jpg"
            }, {
                "fromX": 5,
                "fromY": 15,
                "toX": 7,
                "toY": 24,
                "src": "./src/img/tiles/brick_road.png"
            }]
        },
        "background": [],
        "solid": [{
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-200, -100],
                "size": [400, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-200, -100],
                "size": [10, 110]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-300, 0],
                "size": [110, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-300, 0],
                "size": [10, 700]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-290, 400],
                "size": [150, -10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [0, 390],
                "size": [-10, 110]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-110, 490],
                "size": [110, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-110, 490],
                "size": [10, 210]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-400, 700],
                "size": [110, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-400, 700],
                "size": [10, 500]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-10, 700],
                "size": [10, 500]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-400, 1190],
                "size": [290, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-20, 390],
                "size": [220, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [190, -100],
                "size": [10, 210]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [190, 210],
                "size": [10, 190]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [210, 390],
                "size": [-10, 110]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [200, 490],
                "size": [300, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [680, 490],
                "size": [320, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [190, -100],
                "size": [810, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [990, -100],
                "size": [10, 280]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [990, 280],
                "size": [10, 220]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1000, 100],
                "size": [800, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1790, 100],
                "size": [10, 300]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [990, 390],
                "size": [180, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1330, 390],
                "size": [60, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1540, 390],
                "size": [60, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1760, 390],
                "size": [40, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-320, 1190],
                "size": [10, 290]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-320, 1470],
                "size": [820, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1790, 390],
                "size": [10, 1090]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [680, 1470],
                "size": [1120, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [-110, 700],
                "size": [110, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [680, 480],
                "size": [30, 30]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [470, 480],
                "size": [30, 30]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [470, 1460],
                "size": [30, 30]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [680, 1460],
                "size": [30, 30]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1400, 800],
                "size": [400, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1400, 1290],
                "size": [400, 10]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1400, 800],
                "size": [10, 170]
            }
        }, {
            "type": "rectangle",
            "properties": {
                "color": "#000",
                "position": [1400, 1110],
                "size": [10, 190]
            }
        }],
        "foreground": [],
        "actions": [{
            "x": 500,
            "y": 1490,
            "width": 180,
            "height": 50,
            "fx": "()=>{GameEngine.map.loadMapByName(\"street\")}"
        }]
    }
}));
