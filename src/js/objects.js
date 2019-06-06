// --------------------------------------------------------------------------- ЗОНА ИГРЫ
customElements.define('gm-area',

    class Area extends HTMLElement {
        constructor() {
            super();

            this.chunks = new Object;
            this.chunkSize = 500;

            this.map = JSON.parse(localStorage.getItem('map'));

            this.currentChunk = Math.floor(gameController.playerPosition.x / this.chunkSize) + "x" + Math.floor(gameController.playerPosition.y / this.chunkSize);
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

        getChunkByCoordinats(coordinats){
            return this.chunks[coordinats]
        }

        getCurrentChunk(){
            return this.getChunkByCoordinats(this.currentChunk);
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
                    let object = document.createElement(`gm-${objectInfo.type}-object`);
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






// --------------------------------------------------------------------------- АБСТРАКТНЫЙ КЛАСС ОБЪЕКТОВ
class GMObject extends HTMLElement {
    constructor() {
        super();

        Object.defineProperties(this, {
            x: {
                get: () => (this.style.position == "absolute") ? Number(this.style.left.match(/\d+/)[0]) : Number(this.style.marginLeft.match(/\d+/)[0]),
                set: x => (this.style.position == "absolute") ? this.style.left = x + "px" : this.style.marginLeft = x + "px",
            },
            y: {
                get: () => (this.style.position == "absolute") ? Number(this.style.top.match(/\d+/)[0]) : Number(this.style.marginTop.match(/\d+/)[0]),
                set: y => (this.style.position == "absolute") ? this.style.top = y + "px" : this.style.marginTop = y + "px",
            }
        });
    }
}






// --------------------------------------------------------------------------- ТЕКСТУРИРОВАННЫЙ ОБЪЕКТ
customElements.define('gm-textured-object', class Tile extends GMObject {
    constructor() {
        super();

        this.init = (properties) => {
            this.style.display = "block";

            this.style.position = "absolute";
            this.x = properties.position.x;
            this.y = properties.position.y;

            this.style.backgroundImage = `url(${properties.texture})`;
            this.style.backgroundSize = `100% 100%`;
            this.style.backgroundRepeat = "norepeat";

            this.style.width = `${properties.size.width}px`;
            this.style.height = `${properties.size.height}px`;
        }
    }
});





// --------------------------------------------------------------------------- СКЕЛЕТНЫЙ ОБЪЕКТ
customElements.define('gm-skeleton-object', class Skeleton extends GMObject {
    constructor() {
        super();
        this.boneTree = new Object;

        this.init = (properties) => {
            this.style.display = "block";

            this.style.position = "absolute";
            this.x = `${properties.position.x}px`;
            this.y = `${properties.position.y}px`;
        };
    }

    addBone(boneTree) {

    }
});

//Кость
customElements.define('gm-skeleton-bone', class Bone extends HTMLElement {
    constructor() {
        super();
        this.skeleton = null;
    }

    init(skeleton, width, height, texture, originX, originY) {
        this.skeleton = skeleton;

        this.style.width = width + "px";
        this.style.height = height + "px";

        this.style.backgroundImage = `url(${texture})`;
        this.style.backgroundSize = `100% 100%`;
        this.style.backgroundRepeat = "norepeat";

        this.style.position = "absolute";
    }
});






// --------------------------------------------------------------------------- ТРЁХМЕРНЫЙ КУБ
customElements.define('gm-cube-object', class Cube extends GMObject {
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
                get: () => Number(this.front.style.width.match(/\d+/)[0]),
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
                    this.front.style.background = `url(${textures.front})`;
                    this.back.style.background = `url(${textures.back})`;
                    this.left.style.background = `url(${textures.left})`;
                    this.right.style.background = `url(${textures.right})`;
                    this.top.style.background = `url(${textures.top})`;
                    this.bottom.style.background = `url(${textures.bottom})`;
                    textureList = textures;
                }
            },
            texture: {
                set: texture => {
                    this.front.style.backgroundImage = `url(${texture})`;
                    this.back.style.backgroundImage = `url(${texture})`;
                    this.left.style.backgroundImage = `url(${texture})`;
                    this.right.style.backgroundImage = `url(${texture})`;
                    this.top.style.backgroundImage = `url(${texture})`;
                    this.bottom.style.backgroundImage = `url(${texture})`;
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

        this.init = (properties) => {
            this.style.display = "block";
            this.width = properties.size.width;
            this.height = properties.size.height;
            this.depth = properties.size.depth;

            this.style.position = "absolute";
            this.x = properties.position.x;
            this.y = properties.position.y;

            this.texture = properties.texture;
        };
    }

    connectedCallback() {
        this.style.display = "block";
        this.style.position = "absolute";

        // if (this.getAttribute('width')) this.width = this.getAttribute('width');
        // if (this.getAttribute('height')) this.height = this.getAttribute('height');
        // if (this.getAttribute('depth')) this.depth = this.getAttribute('depth');
        // if (this.getAttribute('textures')) this.textures = JSON.parse(this.getAttribute('textures'));
        // if (this.getAttribute('texture')) this.texture = this.getAttribute('texture');

        this.appendChild(this.back);
        this.appendChild(this.bottom);
        this.appendChild(this.left);
        this.appendChild(this.right);
        this.appendChild(this.top);
        this.appendChild(this.front);
    }

    changePerspective(x, y) {
        x = (x > this.width / 2) ?
            x - this.width / 2
            : (x < -this.width / 2) ?
                x + this.width / 2 : 0;
        y = (y > this.height / 2) ?
            y - this.height / 2
            : (y < -this.height / 2) ?
                y + this.height / 2
                : 0;

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