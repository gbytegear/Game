class MapController {
    constructor() {
        this.positon = [0, 0];
    }

    static initLayer(self) { MapController.prototype[self.name] = self; }
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
    }
});