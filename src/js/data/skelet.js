CanvasObjectModel.defineTemplate('character', {
    type: 'item',
    properties: {
        name: "character",
        size: [80, 50],
        origin: "center",
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
                    anchors: { positon: 'left_bottom' }
                },
                childs: [{
                    type: 'rectangle',
                    properties: {
                        name: 'forearm',
                        size: [20, 50],
                        positon: [0, -12.5]
                    },
                }]
            },
            //Left arm
            {
                type: 'rectangle',
                properties: {
                    name: 'right_arm',
                    size: [20, 50],
                    anchors: { positon: 'right_bottom' }
                },
                childs: [{
                    type: 'rectangle',
                    properties: {
                        name: 'forearm',
                        size: [20, 50],
                        positon: [0, -12.5]
                    },
                }]
            },
            //Backpuck
            {
                type: 'rectangle',
                properties: {
                    name: 'backpuck',
                    origin: "center",
                    anchors: { size: "fill" }
                }
            },
            //Head
            {
                type: 'rectangle',
                properties: {
                    name: 'head',
                    positon: [80 / 3, -((50 - (80 / 3)) / 2)],
                    size: [80 / 3, 80 / 3]
                }
            }
        ]
    }]
});