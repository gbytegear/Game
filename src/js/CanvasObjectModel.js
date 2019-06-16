/* //Содержание по классам
 * MainController / Body
 * Canvas JSON Object Model (COM)
 * COM Canavas
 * COM Item Elements
 * COM Rectangle Element
 * COM Image Element
 * COM Tiled Map Element
 * Definition of Elements
 */

/* //TODO
 * 
 */




















// ---------------------------------------------------------------------------------- MainController / Body
customElements.define('main-controller', class MainController extends HTMLBodyElement {
    constructor() {
        super();
        window.mainController = this;
    }
}, { extends: "body" });




















// ---------------------------------------------------------------------------------- Canvas JSON Object Model


class CanvasObjectModel extends Array {
    constructor(canvas) {
        super();
        this.canvas = canvas;
    }

    static defineObject(name, prototype) {
        CanvasObjectModel.prototype.typeList[name] = prototype;
    }

    static defineObjects(objects) {
        for (let name in objects)
            CanvasObjectModel.prototype.typeList[name] = objects[name];
    }

    createElement(name, properties = {}) { return new this.typeList[name](properties); }

    static createElement(name, properties = {}) { return new CanvasObjectModel.prototype.typeList[name](properties); }

    parse(json) {
        const elementWallker = (elementList, answerList = new Array) => {
            elementList.forEach(element => {
                let newElement = new this.typeList[element.type](element.properties);
                // if(element.childs)
            });
        }
    }
};

CanvasObjectModel.prototype.typeList = new Object;




















// ---------------------------------------------------------------------------------- COM Canvas


customElements.define('com-canvas', class extends HTMLCanvasElement {
    constructor() {
        super();

        this.context = this.getContext('2d');
        this.ObjectModel = new CanvasObjectModel(this);

        this.renderBlock = false;

        this.width = document.body.offsetWidth;
        this.height = document.body.offsetHeight;
        document.body.onresize = () => {
            this.width = document.body.offsetWidth;
            this.height = document.body.offsetHeight;
            this.rerender();
        };

        Object.defineProperty(this, "children", { get: () => this.ObjectModel });
    }

    insert(element) {
        this.ObjectModel.push(element);
        element.changeParent(this);
        this.rerender();
    }

    connectedCallback() {
        if (mainController.canvas) return this.remove();
        mainController.canvas = this;
    }

    rerender() {
        if (this.renderBlock) return;

        this.context.resetTransform();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        this.render();
    }

    rerenderChangeTimeout(callback) {
        this.renderBlock = true;
        callback(this);
        this.renderBlock = false;
        this.rerender();
    }

    rerenderChangeStop(callback) {
        this.renderBlock = true;
        callback(this);
        this.renderBlock = false;
    }

    render() {
        this.ObjectModel.forEach(element => {
            this.context.resetTransform();
            element.render(this.context)
        });
        this.context.closePath();
    }

    removeChild(element) {

    }
}, { extends: "canvas" });




















// ---------------------------------------------------------------------------------- COM Item Elements

class COMElement {
    constructor(properties) {
        let index = null, parent = null,
            x = 0, y = 0,
            width = 0, height = 0,
            visible = "true",
            originPoint = { x: 0, y: 0 }, angle = 0,
            anchors = new Object,
            renderBlock = false,
            shadowProperties = null;

        this.children = new Array;

        this.changeParent = newParent => {
            if (this.parent) this.parent.removeChild(this);
            parent = newParent;
            index = parent.children.indexOf(this);
        }

        Object.defineProperties(this, {
            //Position
            x: {
                set: newX => { x = newX; if (this.parent) this.rerender() },
                get: () => x
            },
            y: {
                set: newY => { y = newY; if (this.parent) this.rerender() },
                get: () => y
            },
            position: {
                get: () => [x, y],
                set: position => {
                    x = position[0];
                    y = position[1];
                    this.rerender();
                }
            },

            //Size
            width: {
                get: () => width,
                set: newWidth => { width = newWidth; this.rerender(); }
            },
            height: {
                get: () => height,
                set: newHeight => { height = newHeight; this.rerender(); }
            },
            size: {
                get: () => [width, height],
                set: size => {
                    width = size[0];
                    height = size[1];
                    this.rerender();
                }
            },

            // Visibility
            visible: {
                get: () => visible,
                set: newVisible => {
                    if (newVisible != "true" && newVisible != "false" && newVisible != "only_content" && newVisible != "only_this")
                        return console.error(`${newVisible} is invalid visibility value!`);
                    visible = newVisible;
                    this.rerender();
                }
            },

            // Technical
            parent: {
                get: () => parent
            },
            index: {
                get: () => index
            },
            rerenderIsBlocked: { get: () => renderBlock },

            // Transform Origin
            originX: {
                get: () => originPoint.x,
                set: newOriginX => { originPoint.x = newOriginX; this.rerender(); }
            },
            originY: {
                get: () => originPoint.y,
                set: newOriginY => { originPoint.y = newOriginY; this.rerender(); }
            },
            origin: {
                get: () => originPoint,
                set: newOrigin => {
                    if (typeof (newOrigin) == "string") return (() => {
                        if (newOrigin == 'center') {
                            originPoint.x = this.width / 2;
                            originPoint.y = this.height / 2;
                        }
                    })();
                    originPoint.x = newOrigin[0];
                    originPoint.y = newOrigin[1];
                    this.rerender();
                }
            },

            // Rotate Origin
            angle: {
                get: () => angle,
                set: newAngle => { angle = newAngle; this.rerender(); }
            },

            //Shadow
            shadow: {
                get: () => shadowProperties,
                set: newShadowProperties => {
                    if (typeof (newShadowProperties) != "object") return shadowProperties = null;
                    if(!shadowProperties)shadowProperties = new Object;
                    if (newShadowProperties.x) shadowProperties.x = newShadowProperties.x;
                    if (newShadowProperties.y) shadowProperties.y = newShadowProperties.y;
                    if (newShadowProperties.color) shadowProperties.color = newShadowProperties.color;
                    if (newShadowProperties.blur) shadowProperties.blur = newShadowProperties.blur;
                    this.rerender();
                }
            },

            // Relative processing
            anchors: {
                get: () => anchors,
                set: newAnchors => { anchors = newAnchors; this.rerender(); }
            }
        });

        this.relativeProcessing = () => {
            renderBlock = true;
            if (anchors.size || parent) switch (anchors.size) {
                case "fill":
                    this.width = parent.width; this.height = parent.height;
                    break; case "fill_width":
                    this.width = parent.width;
                    break; case "fill_height":
                    this.height = parent.height;
            };

            if (anchors.position || parent) switch (anchors.position) {
                case "left_top":
                    this.x = 0; this.y = 0;
                    break; case "right_top":
                    this.x = parent.width - this.width; this.y = 0;
                    break; case "left_bottom":
                    this.x = 0; this.y = parent.height - this.height;
                    break; case "right_bottom":
                    this.x = parent.width - this.width; this.y = parent.height - this.height;
                    break; case "center":
                    this.x = parent.width / 2 - this.width / 2; this.y = parent.height / 2 - this.height / 2;
            };

            renderBlock = false;
        }

        this.setProperties(properties);
    }

    rerender() {
        if (this.parent && !this.rerenderIsBlocked)
            this.parent.rerender();
    }

    insert(element) {
        // element.index = this.children.length;
        this.children.push(element);
        element.changeParent(this);
        if (this.parent) this.parent.rerender();
    }

    preDrawProcessing(ctx) {
        ctx.translate(this.originX, this.originY);
        ctx.rotate(this.angle * Math.PI / 180);

        if (this.shadow) {
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur;
            ctx.shadowOffsetX = this.shadow.x;
            ctx.shadowOffsetY = this.shadow.y;
        }

        this.relativeProcessing();
        if(this.visible == "true" || this.visible == "only_this")this.draw(ctx);

        if (this.shadow) {
            ctx.shadowColor = 0;
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // ctx.rotate(-(this.angle * Math.PI / 180));
        ctx.translate(-this.originX, -this.originY);
        if(this.visible == "true" || this.visible == "only_content")this.drawChilds(ctx);

        ctx.translate(this.originX, this.originY);
        ctx.rotate(-this.angle * Math.PI / 180);
        ctx.translate(-this.originX, -this.originY);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        this.preDrawProcessing(ctx);
        ctx.translate(-this.x, -this.y);
    }

    draw(ctx) { }

    drawChilds(ctx) { this.children.forEach(element => element.render(ctx)); }

    setProperties(properties) {
        for (let prop in properties)
            this[prop] = properties[prop];
    }

    removeChild(element) {

    }
};




















// ---------------------------------------------------------------------------------- COM Rectangle Element

class COMRectangleElement extends COMElement {
    constructor(properties) {
        super();
        let color = "transparent";

        Object.defineProperties(this, {
            color: {
                get: () => color,
                set: newColor => { color = newColor; this.rerender(); }
            }
        })

        this.setProperties(properties);
    }

    draw(ctx) {
        ctx.rect(-this.originX, -this.originY, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};




















// ---------------------------------------------------------------------------------- COM Image Element

class COMImageElement extends COMElement {
    constructor(properties) {
        super();
        let src = null,
            texture = new Image;

        Object.defineProperties(this, {
            src: {
                get: () => src,
                set: newSrc => {
                    src = newSrc;
                    texture.src = src;
                }
            },
            image: { get: () => texture }
        })

        texture.onload = () => this.rerender();

        this.setProperties(properties);
    }

    draw(ctx) {
        ctx.drawImage(this.image, -this.originX, -this.originY, this.width, this.height);
    }
};




















// ---------------------------------------------------------------------------------- COM Tiled Map Element

class MultiDimensionRangeArray {
    constructor() {
        let ranges = new Array, defaultReturn = null;

        this.setDefault = value => defaultReturn = value;

        this.createRange = (rangesArray, value) => {
            ranges.push({range: rangesArray, value});
        }

        this.getBy = indexes => {
            for(let i = ranges.length-1; i > -1; i--){
                let finded = true;
                ranges[i].range.forEach((range, i) => {
                    if(range.from > indexes[i] || range.to <= indexes[i])finded = false;
                });
                if(finded)return ranges[i].value;
            }
            return defaultReturn;
        }

        this.clearRanges = () => ranges = new Array;

        Object.defineProperty(this,"ranges",{get:()=>ranges});
    }
}

class COMTiledMapElement extends COMElement {
    constructor(properties) {
        super();
        let tileSize = { width: 0, height: 0 },
            tileStorage = new MultiDimensionRangeArray;

        this.clearTileRange = tileStorage.clearRanges;

        Object.defineProperties(this, {

            defaultTile: {
                set: src => {
                    let image = new Image();
                    image.src = src;
                    tileStorage.setDefault(image);
                    this.rerender();
                }
            },
            rangeTile: {
                set: range => { //{fromX,toX,fromY,toY, src}
                    let image = new Image();
                    image.src = range.src;
                    tileStorage.createRange([{ from: range.fromX, to: range.toX }, { from: range.fromY, to: range.toY }], image);
                }
            },
            rangeTiles: {
                set: ranges => { //[{fromX,toX,fromY,toY, src}...
                    ranges.forEach(range => {
                        let image = new Image();
                        image.src = range.src;
                        tileStorage.createRange([{ from: range.fromX, to: range.toX }, { from: range.fromY, to: range.toY }], image);
                    });
                }
            },
            tileStorage: { get: () => tileStorage },



            tileWidth: {
                get: () => tileSize.width,
                set: newTileWidth => {
                    tileSize.width = newTileWidth;
                    this.rerender();
                }
            },
            tileHeight: {
                get: () => tileSize.height,
                set: newTileHeight => {
                    tileSize.height = newTileHeight;
                    this.rerender();
                }
            },
            tileSize: {
                get: () => tileSize,
                set: newTileSize => {
                    tileSize.width = newTileSize[0];
                    tileSize.height = newTileSize[1];
                    this.rerender();
                }
            }
        });


        // texture.onload = () => this.rerender();

        this.setProperties(properties);
    }

    draw(ctx) {
        let start = { ix: Math.floor(-this.x / this.tileSize.width), iy: Math.floor(-this.y / this.tileSize.height) };
        let end = { ix: Math.ceil((-this.x + document.body.offsetWidth) / this.tileSize.width), iy: Math.ceil((-this.y + document.body.offsetHeight) / this.tileSize.width) };
        for (let iy = start.iy; iy < end.iy; iy++)
            for (let ix = start.ix; ix < end.ix; ix++)
                ctx.drawImage(this.tileStorage.getBy([ix, iy]), this.tileWidth * ix, this.tileHeight * iy, this.tileWidth, this.tileHeight);
    }
}




















// ---------------------------------------------------------------------------------- Definition of Elements

CanvasObjectModel.defineObjects({
    item: COMElement,
    rectangle: COMRectangleElement,
    image: COMImageElement,
    tiledMap: COMTiledMapElement
});
