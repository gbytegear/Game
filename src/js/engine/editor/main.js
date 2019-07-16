const editor = new class EditorController {
    constructor() {
        this.loop = canvas.loop;
        this.map = new MapController;
        this.buildGameSceneStructure();
        this.map_json = {
            tiles: {
                default_tile: "./src/img/tiles/grass1.jpg",
                range_tiles: [
                    { from: [2, 2], to: [4, 4], src: 'transparent' }
                ]
            },
            solid: [
                { position: [195, 195], size: [210, 10], color: '#444' },
                { position: [195, 195], size: [10, 210], color: '#444' }
            ],
        };
        this.map.load(this.map_json);
    }

    buildGameSceneStructure () {
        canvas.innerJSON = [
            'map_tile_layer.tile_layer', 
            'map_object_layer.background_layer', 
            'map_object_layer.solid_layer',
            'map_object_layer.foreground_layer'];
    }
}

window.editor = editor;