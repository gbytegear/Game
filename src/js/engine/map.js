class MapController {
    constructor() {
        let position = [0, 0];
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

    static initLayer(self) { MapController.prototype[self.name] = self; }

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
    }

    load(obj) {
        this.clear();
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