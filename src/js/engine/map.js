CanvasObjectModel.defineTemplate('map_object_layer', {
    type: "item",
    properties: {
        oninsert: self => MapController.prototype[self.name] = self,
        anchors: {
            position: 'center',
        }
    }
})

CanvasObjectModel.defineTemplate('map_tile_layer', {
    type: 'tiled_map',
    properties: {
        tile_size: [100, 100],
        default_tile: "transparent",
        name: 'tiles',
        oninsert: self => MapController.prototype[self.name] = self
    }
});

class MapController {
    constructor() {
        this.positon = [0, 0];
    }
}