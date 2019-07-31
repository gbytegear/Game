CanvasObjectModel.defineTemplate('character', {
    type: 'item',
    properties: {
        name: "character",
        size: [80, 50],
        origin: "center",
        oninsert: function() {

            Object.defineProperties(this, {
                body: {value: this.query('body'), writable: false, configurable: false},
                head: {value: this.query('body/head'), writable: false, configurable: false},
                backpuck: {value: this.query('body/backpuck'), writable: false, configurable: false},
                left_arm: {value: this.query('body/left_arm'), writable: false, configurable: false},
                left_forearm: {value: this.query('body/left_arm/forearm'), writable: false, configurable: false},
                right_arm: {value: this.query('body/right_arm'), writable: false, configurable: false},
                right_forearm: {value: this.query('body/right_arm/forearm'), writable: false, configurable: false},
                weapon: {value: this.query('body/right_arm/forearm/weapon'), writable: false, configurable: false}
            });

            this.setTextures = textures => {
                for (let texture in textures)
                    switch (texture) {
                        case 'body': this.body.src = textures.body;
                        break; case 'head': this.head.src = textures.head;
                        break; case 'backpuck': this.backpuck.src = textures.backpuck;
                        break; case 'left_arm': this.left_arm.src = textures.left_arm;
                        break; case 'left_forearm': this.left_forearm.src = textures.left_forearm;
                        break; case 'right_arm': this.right_arm.src = textures.right_arm;
                        break; case 'right_forearm': this.right_forearm.src = textures.right_forearm;
                        break; case 'weapon': this.weapon.src = textures.weapon;
                    }
            }

            this.setAnimationFarme = frame => {
                for (let body_part in frame)
                    switch (body_part) {
                        case 'body': this.body.angle = frame.body;
                        break; case 'head': this.head.angle = frame.head;
                        break; case 'left_arm': this.left_arm.angle = frame.left_arm;
                        break; case 'left_forearm': this.left_forearm.angle = frame.left_forearm;
                        break; case 'right_arm': this.right_arm.angle = frame.right_arm;
                        break; case 'right_forearm': this.right_forearm.angle = frame.right_forearm;
                        break; case 'weapon': this.weapon.angle = frame.weapon;
                    }
            }

            this.stats = {
                hp: 1000,
                max_hp: 1000,
                movement_speed: 15
            };

            
        }
    },
    childs: [{
        type: 'rectangle',
        properties: {
            name: 'body',
            origin: "center",
            anchors: { size: "fill" }
        },
        childs: [

            //Left arm
            {
                type: 'rectangle',
                properties: {
                    name: 'left_arm',
                    size: [20, 50],
                    origin: [10, 42.5],
                    anchors: { position: 'left_bottom', offsetY: -15 }
                },
                childs: [{
                    type: 'rectangle',
                    properties: {
                        name: 'forearm',
                        size: [20, 50],
                        origin: [10, 45],
                        anchors: { position: 'right_top', offsetY: -40 }
                    }
                }]
            },

            //Left arm
            {
                type: 'rectangle',
                properties: {
                    name: 'right_arm',
                    size: [20, 50],
                    origin: [10, 42.5],
                    anchors: { position: 'right_bottom', offsetY: -15 }
                },
                childs: [{
                    type: 'rectangle',
                    properties: {
                        name: 'forearm',
                        size: [20, 50],
                        origin: [10, 45],
                        anchors: { position: 'right_top', offsetY: -40 }
                    },
                    childs: [{
                        type: 'rectangle',
                        properties: {
                            name: 'weapon',
                            size: [10, 100],
                            origin: [5, 50],
                            anchors: { position: 'center_top', offsetY: -50},
                            // color: 'red'
                        }
                    }]
                }]
            },

            //Backpuck
            {
                type: 'rectangle',
                properties: {
                    name: 'backpuck',
                    anchors: { size: "fill" }
                }
            },

            //Head
            {
                type: 'rectangle',
                properties: {
                    name: 'head',
                    position: [12.5, -10],
                    size: [55, 55],
                    origin: 'center'
                }
            }
        ]
    }]
});