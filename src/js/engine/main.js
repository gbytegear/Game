const ge = new class GameEngine {
    
    loop = canvas.loop.insertBack(new ProcedureStack, this);
    map = new MapController;
    player = null;
    constrols_data = {
        angle: 0,
        movement: [0, 0],
        using: false,
        attack: false
    };

    constructor() {
        this.buildGameSceneStructure();
        this.playerCharacterProcessing();
        // TEST
        this.player.setTextures(data.items.clth_empty);
        this.player.setTextures(data.heads.player);
        this.map.load(data.maps[data.start_map]);
        // delete this.constructor.prototype;
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
                if(this.player.stats._hp<0)this.player.stats._hp = 0;
                (async ()=>document.querySelector('.hitbar').style.setProperty('--hp', (this.player.stats._hp / (this.player.stats.max_hp / 100)) + "%"))();
                return this.player.stats._hp;
            },
            get: () => this.player.stats._hp
        });
        this.player.stats.hp = this.player.stats.max_hp;
        delete this.constructor.prototype.playerCharacterProcessing;
        this.loop.insert(this.controlsProcessing);
        delete this.constructor.prototype.controlsProcessing;
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
            :this.constrols_data.movement[0]),
    
            this.map.position[1] + (this.map.hitSolid({
                x: -this.map.position[0] - 20,
                y: -this.map.position[1] - this.constrols_data.movement[1] - 20,
                width: 40,
                height: 40,
            })
            ?0
            :this.constrols_data.movement[1])
        ];

        ge.player.angle = this.constrols_data.angle;
    }
}