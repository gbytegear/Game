// --------------------------------------------------------------------------- ЗОНА ИГРЫ
customElements.define('gm-area',

    class Area extends HTMLElement {
        constructor() {
            super();

            this.chunks = new Object;
            this.chunkSize = 1000;

            this.shift = { left: document.body.offsetWidth / 2, top: document.body.offsetHeight / 2 };

            this.map = JSON.parse(localStorage.getItem('map'));

            this.currentChunk = Math.floor(gameController.playerPosition.x / this.chunkSize) + "x" + Math.floor(gameController.playerPosition.y / this.chunkSize);
        }

        move(x, y) {
            this.style.left = -x + "px";
            this.style.top = -y + "px";
            let calculatedChunk = Math.floor(gameController.playerPosition.x / this.chunkSize) + "x" + Math.floor(gameController.playerPosition.y / this.chunkSize)
            if (this.currentChunk != calculatedChunk) {
                this.currentChunk = calculatedChunk;
                this.loadCurrentChunk();
                console.log(this.currentChunk);
            }
        }

        connectedCallback() {
            if (window.gameController.area) return this.remove();
            window.gameController.area = this;

            document.body.onresize = () => {
                this.style.marginLeft = document.body.offsetWidth / 2 + "px";
                this.style.marginTop = document.body.offsetHeight / 2 + "px";
            };

            this.style.display = "block";
            this.style.position = 'absolute';
            this.style.marginLeft = document.body.offsetWidth / 2 + "px";
            this.style.marginTop = document.body.offsetHeight / 2 + "px";

            this.loadCurrentChunk();
        }

        loadCurrentChunk() {
            if (!this.map[this.currentChunk] || this.chunks[this.currentChunk]) return;
            this.insertChunk(this.currentChunk, this.map[this.currentChunk])
        }

        insertChunk(coordinats = "0x0", properties = {}) {
            let chunk = document.createElement('gm-area-chunk');
            chunk.init(this.chunkSize, properties, coordinats);
            this.chunks[coordinats] = chunk;
            this.appendChild(chunk);
        }

    }
);





// --------------------------------------------------------------------------- ЧАНК
customElements.define('gm-area-chunk', class Chunk extends HTMLElement {
    constructor() {
        super();
        this.titles = new Array;
        this.objects = new Array;

        this.init = (size = 0, properties = {}, index2D) => {
            this.style.display = "block";
            this.style.width = `${size}px`;
            this.style.height = `${size}px`;

            if (properties.props) {
                for (let prop in properties.props)
                    this[prop] = properties.props[prop];
            };

            if (properties.tiles) {
                properties.tiles.forEach(tileInfo => {
                    let tile = document.createElement('gm-chunk-tile');
                    tile.init(tileInfo.size, tileInfo.src);
                    this.appendChild(tile);
                });
            }

            if (properties.objects) {
                properties.objects.forEach(objectInfo => {
                    let object = document.createElement(`gm-chunk-${objectInfo.type}object`);
                    object.init(objectInfo);
                    this.appendChild(object);
                });
            }

            this.style.position = 'absolute';
            this.style.left = size * Number(index2D.split('x')[0]) + "px";
            this.style.top = size * Number(index2D.split('x')[1]) + "px";
        }
    }

    connectedCallback() {

    }
});






// --------------------------------------------------------------------------- ТАЙЛ
customElements.define('gm-chunk-tile', class Tile extends HTMLElement {
    constructor() {
        super();
        this.size = { width: 0, height: 0 };
        this.clipPath = undefined;

        this.init = (size = { width: 0, height: 0 }, src) => {
            this.style.display = "block";
            this.style.backgroundImage = `url(${src})`;
            this.style.backgroundSize = `${size.width}px ${size.height}px`;
            this.style.backgroundRepeat = "repaet";
            this.style.width = "100%";
            this.style.height = "100%";
        }
    }
});






// --------------------------------------------------------------------------- ТЕКСТУРИРОВАННЫЙ ОБЪЕКТ
customElements.define('gm-chunk-texturedobject', class Tile extends HTMLElement {
    constructor() {
        super();

        this.init = (properties) => {
            this.style.display = "block";

            this.style.position = "absolute";
            this.style.left = `${properties.position.x}px`;
            this.style.top = `${properties.position.y}px`;

            this.style.backgroundImage = `url(${properties.texture})`;
            this.style.backgroundSize = `100% 100%`;
            this.style.backgroundRepeat = "norepeat";

            this.style.width = `${properties.size.width}px`;
            this.style.height = `${properties.size.height}px`;
        }
    }
});






// --------------------------------------------------------------------------- ТРЁХМЕРНЫЙ КУБ
customElements.define('gm-cube', class Cube extends HTMLElement {
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
                        front: texture,
                        back: texture,
                        left: texture,
                        right: texture,
                        top: texture,
                        bottom: texture
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
        } else if (x < 0) {
            this.left.style.display = 'none';
            this.right.style.display = 'block';
            this.right.style.width = -x + 'px';
            this.right.style.transform = `skewY(${180 / Math.PI * Math.atan(y / x)}deg) translateY(${y / 2}px)`;

        } else {
            this.right.style.display = 'none';
            this.left.style.display = 'none';
        }

        if (y > 0) {
            this.bottom.style.display = 'none';
            this.top.style.display = 'block';
            this.top.style.height = y + 'px';
            this.top.style.transform = `skewX(${180 / Math.PI * Math.atan(x / y)}deg) translateX(${x / 2}px)`;
        } else if (y < 0) {
            this.top.style.display = 'none';
            this.bottom.style.display = 'block';
            this.bottom.style.height = -y + 'px';
            this.bottom.style.transform = `skewX(${180 / Math.PI * Math.atan(x / y)}deg) translateX(${x / 2}px)`;
        } else {
            this.top.style.display = 'none';
            this.bottom.style.display = 'none';
        }
    }

    dropLightByAngle(angle = 0, intensity = 15) {
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
});