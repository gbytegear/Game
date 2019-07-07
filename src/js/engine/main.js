const ge = new class GameEngine {
    constructor() {
        this.map = new MapController;
        this.buildGameSceneStructure();
        // TEST
        this.player.setTextures(data.items.clth_empty);
        this.player.setTextures(data.heads.player);
    }

    buildGameSceneStructure () {
        canvas.innerJSON = [
            'map_tile_layer.tile_layer', 
            'map_object_layer.background_layer', 
            'map_object_layer.solid_layer',
            'character.player',
            'map_object_layer.foreground_layer'];
        canvas.query('player').anchors = {position: 'center'};
        this.player = canvas.query('player');
    }
}