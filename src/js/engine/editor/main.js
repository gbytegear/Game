const editor = new class EditorController {
    constructor() {
        this.loop = canvas.loop;
        this.map = new MapController;
        this.buildGameSceneStructure();
        this.map_json = {
            tiles: {
                default_tile: "transparent",
                range_tiles: []
            },
            background: [],
            solid: [],
            foreground: []
        };
        this.map.load(this.map_json);
    }

    buildGameSceneStructure () {
        canvas.innerJSON = [
            'map_tile_layer.tile_layer', 
            'map_object_layer.background_layer', 
            'map_object_layer.solid_layer',
            'map_object_layer.foreground_layer',
            'map_object_layer.selection_layer'];
        canvas.query("selection_layer").innerJSON = [{type: 'rectangle', properties: {name: 'selection', color:"#88a7"}}],
        this.selection = canvas.query("selection_layer/selection");
    }
}

window.editor = editor;