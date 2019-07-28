const ge = new class GameEngine {
    constructor() {
        this.loop = canvas.loop.insertBack(new ProcedureStack, this);
        this.map = new MapController;
        this.buildGameSceneStructure();
        this.playerCharacterProcessing();
        // TEST
        this.player.setTextures(data.items.clth_empty);
        this.player.setTextures(data.heads.player);
        this.map.load(data.maps[data.start_map]);
        this.constrols_data = {
            angle: 0,
            movement: [0, 0],
            using: false,
            attack: false
        };
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
                (async ()=>document.querySelector('.hitbar').style.setProperty('--hp', (this.player.stats._hp / (this.player.stats.max_hp / 100)) + "%"))();
                return this.player.stats._hp;
            },
            get: () => this.player.stats._hp
        });
        this.player.stats.hp = this.player.stats.max_hp;
        delete this.constructor.prototype.playerCharacterProcessing;
    }

    controlsProcessing(){
        this.map.position = [
            this.map.position[0] + (this.map.hitSolid({
                x: -this.map.position[0] - this.constrols_data.movement[0] - 20,
                y: -this.map.position[1] - 20,
                width: 40,
                height: 40,
            })
            ?0
            :add[0]),
    
            this.map.position[1] + (this.map.hitSolid({
                x: -this.map.position[0] - 20,
                y: -this.map.position[1] - this.constrols_data.movement[1] - 20,
                width: 40,
                height: 40,
            })
            ?0
            :add[1])
        ];
    }
}