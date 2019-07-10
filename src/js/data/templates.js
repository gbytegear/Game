CanvasObjectModel.defineTemplate('character', {
    type: 'item',
    properties: {
        name: "character",
        size: [80, 50],
        origin: "center",
        oninsert: self => {
            self.setTextures = textures => {
                for (let texture in textures)
                    switch (texture) {
                        case 'body': self.query('body').src = textures.body;
                        break; case 'head': self.query('body/head').src = textures.head;
                        break; case 'backpuck': self.query('body/backpuck').src = textures.backpuck;
                        break; case 'left_arm': self.query('body/left_arm').src = textures.left_arm;
                        break; case 'left_forearm': self.query('body/left_arm/forearm').src = textures.left_forearm;
                        break; case 'right_arm': self.query('body/right_arm').src = textures.right_arm;
                        break; case 'right_forearm': self.query('body/right_arm/forearm').src = textures.right_forearm;
                        break; case 'weapon': self.query('body/right_arm/forearm/weapon').src = textures.weapon;
                    }
            }

            self.setAnimationFarme = frame => {
                for (let body_part in frame)
                    switch (body_part) {
                        case 'body': self.query('body').angle = frame.body;
                        break; case 'head': self.query('body/head').angle = frame.head;
                        break; case 'backpuck': self.query('body/backpuck').angle = frame.backpuck;
                        break; case 'left_arm': self.query('body/left_arm').angle = frame.left_arm;
                        break; case 'left_forearm': self.query('body/left_arm/forearm').angle = frame.left_forearm;
                        break; case 'right_arm': self.query('body/right_arm').angle = frame.right_arm;
                        break; case 'right_forearm': self.query('body/right_arm/forearm').angle = frame.right_forearm;
                        break; case 'weapon': self.query('body/right_arm/forearm/weapon').angle = frame.weapon;
                    }
            }

            self.stats = {
                hp: 1000,
                max_hp: 1000,
                movement_speed: 10
            };

            Object.defineProperties(self, {
                body: {get: ()=>self.query('body')},
                head: {get: ()=>self.query('body/head')},
                backpuck: {get: ()=>self.query('body/backpuck')},
                left_arm: {get: ()=>self.query('body/left_arm')},
                left_forearm: {get: ()=>self.query('body/left_arm/forearm')},
                right_arm: {get: ()=>self.query('body/right_arm')},
                right_forearm: {get: ()=>self.query('body/right_arm/forearm')},
                weapon: {get: ()=>self.query('body/right_arm/forearm/weapon')}
            });
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