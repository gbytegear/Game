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
                    }
            }
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

            //Right arm
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
                    },
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