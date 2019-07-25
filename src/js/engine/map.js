"use strict"
class MapController {
    constructor() {
        let position = [0, 0];
        this.action_layer = new Array;
        Object.defineProperties(this, {
            position: {
                get: () => position,
                set: newPosition => {
                    position = newPosition;
                    this.tile_layer.anchors.offsetPosition = this.position;
                    this.background_layer.anchors.offsetPosition = this.position;
                    this.solid_layer.anchors.offsetPosition = this.position;
                    this.foreground_layer.anchors.offsetPosition = this.position;
                }
            }
        });
    }

    static initLayer() { MapController.prototype[this.name] = this; }

    static hitTest(obj1, obj2){
        if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y)
            return true;
        return false;
    }

    hitSolid(obj){
        if (this.solid_layer.children.length == 0)return false;
        for (let i = 0; i < this.solid_layer.children.length; i++)
            if(MapController.hitTest(obj, this.solid_layer.children[i]))return true;
        return false;
    }

    hitAction(obj, target){
        target = target?target:obj;
        if (this.action_layer.length == 0)return false;
        let actionStack = new Array;
        this.action_layer.forEach(action => (MapController.hitTest(obj, action))?actionStack.push(action.fx):undefined);
        return actionStack;
    }

    get inited() {
        return Boolean(
            MapController.prototype.tile_layer &&
            MapController.prototype.background_layer &&
            MapController.prototype.solid_layer &&
            MapController.prototype.foreground_layer
        );
    }

    clear() {
        this.tile_layer.default_tile = 'transparent';
        this.tile_layer.clearTileRange();
        this.background_layer.innerJSON = [];
        this.solid_layer.innerJSON = [];
        this.foreground_layer.innerJSON = [];
        this.action_layer = new Array;
    }

    load(map_descriptor) {
        this.clear();
        for (let layer in map_descriptor) switch (layer) {
            case 'tiles':
                this.tile_layer.setProperties(map_descriptor[layer]);
                break; case 'foreground':
                map_descriptor[layer].forEach(properties => {
                    this.foreground_layer.insert(CanvasObjectModel.createElement('rectangle', properties));
                });
                break; case 'solid':
                map_descriptor[layer].forEach(properties => {
                    this.solid_layer.insert(CanvasObjectModel.createElement('rectangle', properties));
                });
                break; case 'background':
                map_descriptor[layer].forEach(properties => {
                    this.background_layer.insert(CanvasObjectModel.createElement('rectangle', properties));
                });
                break; case 'actions':
                this.action_layer = map_descriptor[layer];
        }
    }
}

CanvasObjectModel.defineTemplate('map_object_layer', {
    type: "item",
    properties: {
        oninsert: MapController.initLayer,
        anchors: {
            position: 'center',
        }
    }
})

CanvasObjectModel.defineTemplate('map_tile_layer', {
    type: 'tiled_map',
    properties: {
        oninsert: MapController.initLayer,
        tile_size: [100, 100],
        default_tile: "transparent",
        name: 'tiles',
        anchors: {
            position: 'center',
        }
    }
});

CanvasObjectModel.defineTemplate('map_object', {
    type: 'rectangle'
})


// TEST
const empty_map = {
    tiles: {
        default_tile: "transparent",
        range_tiles: []
    },
    background: [],
    solid: [],
    foreground: []
}