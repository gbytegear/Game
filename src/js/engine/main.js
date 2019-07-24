const ge = new class GameEngine {
    constructor() {
        this.loop = canvas.loop;
        this.map = new MapController;
        this.buildGameSceneStructure();
        this.playerCharacterProcessing();
        // TEST
        this.player.setTextures(data.items.clth_empty);
        this.player.setTextures(data.heads.player);
        this.map.load(data.maps[data.start_map]);
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
        delete this.constructor.prototype.buildGameSceneStructure;
    }

    playerCharacterProcessing(){
        Object.defineProperty(this.player.stats, 'hp', {
            set: hp => {
                this.player.stats._hp = hp;
                return new Promise(()=>document.querySelector('.hitbar').style.setProperty('--hp', (this.player.stats._hp / (this.player.stats.max_hp / 100)) + "%"))
            },
            get: () => this.player.stats._hp
        });
        this.player.stats.hp = this.player.stats.max_hp;
        delete this.constructor.prototype.playerCharacterProcessing;
    }
}