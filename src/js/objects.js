customElements.define('gm-area',

    class Area extends HTMLElement {
        constructor(){
            super();
            this.chunks = new Object;
            this.chunkSize = 800;
        }

        connectedCallback() {

        }

        insertChunk(coordinats = "0x0", properties = {}){
            let chunk = document.createElement('gm-chunk');
        }

    }
);

customElements.define('gm-chunk', 
class Chunk extends HTMLElement {
    constructor(){
        super();
        this.titles = new Array;
        this.objects = new Array;
        let width = 0,
        height = 0;

        Object.defineProperties()
    }

    init(size = [0, 0], properties = {}){
        this.width = size[0];
        this.height = size[1];
        if(properties.props){
            for(let prop in properties.props)
                this[prop] = properties.props[prop];
        }
    }
}
);

/*

{
    props: {}
    tiles: [{src: "./path/to/image", clip},
        ...
    ],
    objects: [
        {type:"object-type", width: 10, height: 10, src: "./path/to/image"},
        ...
    ]
}

*/


customElements.define('game-cube',

    class Cube extends HTMLElement {
        constructor() {
            super();

            let sidePrototype = document.createElement('div');

            sidePrototype.style.position = "absolute";
            sidePrototype.style.backgroundSize = "100% 100%";
            sidePrototype.style.backgroundPosition = "center";

            this.front = sidePrototype;
            this.back = sidePrototype.cloneNode();

            this.left = sidePrototype.cloneNode();
            this.right = sidePrototype.cloneNode();
            this.top = sidePrototype.cloneNode();
            this.bottom = sidePrototype.cloneNode();

            this.left.style.left = "0px";
            this.right.style.right = "0px";
            this.top.style.top = "0px";
            this.bottom.style.bottom = "0px";

            let width = 0,
            height = 0,
            depth = 0,
            textureList = new Object;

            Object.defineProperties(this, {
                width: {
                    get: () => width,
                    set: width => {
                        this.style.width = width + "px";
                        this.front.style.width = width + "px";
                        this.back.style.width = width + "px";
                        this.top.style.width = width + "px";
                        this.bottom.style.width = width + "px";
                    }
                },
                height: {
                    get: () => Number(this.front.style.height.match(/\d+/)[0]),
                    set: height => {
                        this.style.height = height + "px";
                        this.front.style.height = height + "px";
                        this.back.style.height = height + "px";
                        this.left.style.height = height + "px";
                        this.right.style.height = height + "px";
                    }
                },
                depth: {
                    get: () => Number(this.top.style.height.match(/\d+/)[0]),
                    set: depth => {
                        this.left.style.width = depth + "px";
                        this.right.style.width = depth + "px";
                        this.top.style.height = depth + "px";
                        this.bottom.style.height = depth + "px";
                    }
                },
                textures: {
                    get: () => textureList,
                    set: textures => {
                        this.front.style.background = textures.front;
                        this.back.style.background = textures.back;
                        this.left.style.background = textures.left;
                        this.right.style.background = textures.right;
                        this.top.style.background = textures.top;
                        this.bottom.style.background = textures.bottom;
                        textureList = textures;
                    }
                },
                texture: {
                    set: texture => {
                        this.front.style.background = texture;
                        this.back.style.background = texture;
                        this.left.style.background = texture;
                        this.right.style.background = texture;
                        this.top.style.background = texture;
                        this.bottom.style.background = texture;
                        textureList = {
                            front:texture,
                            back:texture,
                            left:texture,
                            right:texture,
                            top:texture,
                            bottom:texture
                        };
                    }
                }
            });
        }

        connectedCallback() {
            this.style.display = "block";
            this.style.position = "absolute";

            if (this.getAttribute('width')) this.width = this.getAttribute('width');
            if (this.getAttribute('height')) this.height = this.getAttribute('height');
            if (this.getAttribute('depth')) this.depth = this.getAttribute('depth');
            if (this.getAttribute('textures')) this.textures = JSON.parse(this.getAttribute('textures'));
            if (this.getAttribute('texture')) this.texture = this.getAttribute('texture');

            this.appendChild(this.back);
            this.appendChild(this.bottom);
            this.appendChild(this.left);
            this.appendChild(this.right);
            this.appendChild(this.top);
            this.appendChild(this.front);

            this.setPosition(50, 50);
        }

        changePerspective(x, y) {
            this.front.style.transform = `translate(${x}px, ${y}px)`;

            if (x > 0) {
                this.right.style.display = 'none';
                this.left.style.display = 'block';
                this.left.style.width = x + 'px';
                this.left.style.transform = `skewY(${180 / Math.PI * Math.atan(y / x)}deg) translateY(${y / 2}px)`;
            }else if(x < 0){
                this.left.style.display = 'none';
                this.right.style.display = 'block';
                this.right.style.width = -x + 'px';
                this.right.style.transform = `skewY(${180 / Math.PI * Math.atan(y / x)}deg) translateY(${y / 2}px)`;

            } else{
                this.right.style.display = 'none';
                this.left.style.display = 'none';
            }

            if (y > 0) {
                this.bottom.style.display = 'none';
                this.top.style.display = 'block';
                this.top.style.height = y + 'px';
                this.top.style.transform = `skewX(${180 / Math.PI * Math.atan(x / y)}deg) translateX(${x / 2}px)`;
            }else if(y < 0){
                this.top.style.display = 'none';
                this.bottom.style.display = 'block';
                this.bottom.style.height = -y + 'px';
                this.bottom.style.transform = `skewX(${180 / Math.PI * Math.atan(x / y)}deg) translateX(${x / 2}px)`;
            }else {
                this.top.style.display = 'none';
                this.bottom.style.display = 'none';
            }
        }

        dropLightByAngle(angle = 0, intensity = 15){
            let colors = {
                gradient: `#000${intensity.toString(16)}, transparent, #fff${intensity.toString(16)}`,
                fullDark: `#000${intensity.toString(16)}, #000${intensity.toString(16)}`,
                fullLight: `#fff${intensity.toString(16)}, #fff${intensity.toString(16)}`
            };
            this.front.style.background = `linear-gradient(${angle}deg,${colors['gradient']}), ` + this.textures.top;
            this.top.style.background = `linear-gradient(${180 - angle}deg,${colors['gradient']}), ` + this.textures.top;
            this.right.style.background = `linear-gradient(${360 - angle}deg,${colors['gradient']}), ` + this.textures.top;
        }

        setPosition(x, y) {
            this.style.left = x + "px";
            this.style.top = y + "px";
        }
    }
);


/* Тени
linear-gradient(-45deg, #000f, transparent, #fff8), url("./src/img/textures/box.jpg") center center / 100% 100%
*/