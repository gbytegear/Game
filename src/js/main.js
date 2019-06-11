
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












// ---------------------------------------------------------------------------------- Canvas


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



















// ---------------------------------------------------------------------------------- Item of COM Elements

/*  Item-element
    visible = true - draw all;
    visible = false - hide all;
    visible = only_this - draw only this element;
    visible = only_content - draw only content elements;
*/

class COMElement {
    constructor(properties) {
        let index = null, parent = null,
            x = 0, y = 0,
            width = 0, height = 0,
            visible = "true",
            originPoint = { x: 0, y: 0 }, angle = 0;

        this.children = new Array;

        this.changeParent = newParent => {
            if (this.parent) this.parent.removeChild(this);
            parent = newParent;
            index = parent.children.indexOf(this);
        }

        Object.defineProperties(this, {
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

            visible: {
                get: () => visible,
                set: newVisible => {
                    if (newVisible != "true" && newVisible != "false" && newVisible != "only_content" && newVisible != "only_this")
                        return console.error(`${newVisible} is invalid visibility value!`);
                    visible = newVisible;
                    this.rerender();
                }
            },


            parent: {
                get: () => parent
            },
            index: {
                get: () => index
            },


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
            angle: {
                get: () => angle,
                set: newAngle => { angle = newAngle; this.rerender(); }
            }
        })

        this.setProperties(properties);
    }

    rerender() {
        if (this.parent)
            this.parent.rerender();
    }

    insert(element) {
        // element.index = this.children.length;
        this.children.push(element);
        element.changeParent(this);
        if (this.parent) this.parent.rerender();
    }

    transformAndDraw(ctx) {
        ctx.translate(this.originX, this.originY);
        ctx.rotate(this.angle * Math.PI / 180);

        this.draw(ctx);

        ctx.translate(-this.originX, -this.originY);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        switch (this.visible) {
            case "true":
                this.transformAndDraw(ctx);
                this.drawChilds(ctx);
                break;
            case "only_content":
                this.drawChilds(ctx);
                break;
            case "only_this":
                this.transformAndDraw(ctx);
                break;
            case "false":
                return;
                break;
        };
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




















// ---------------------------------------------------------------------------------- Rectangle COM Element

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







// ---------------------------------------------------------------------------------- Image COM Element

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





// ---------------------------------------------------------------------------------- Tiled Map COM Element

class COMTiledMapElement extends COMElement {
    constructor(properties) {
        super();
        let tileSize = { width: 0, height: 0 },
            src = null,
            texture = new Image;

        Object.defineProperties(this, {
            src: {
                get: () => src,
                set: newSrc => {
                    src = newSrc;
                    texture.src = src;
                }
            },
            image: { get: () => texture },


            tileWidth:{
                get: () => tileSize.width,
                set: newTileWidth => {
                    tileSize.width = newTileWidth;
                    this.rerender();
                }
            },
            tileHeight:{
                get: () => tileSize.height,
                set: newTileHeight => {
                    tileSize.height = newTileHeight;
                    this.rerender();
                }
            },
            tileSize:{
                get: () => tileSize,
                set: newTileSize => {
                    tileSize.width = newTileSize[0];
                    tileSize.height = newTileSize[1];
                    this.rerender();
                }
            }
        });


        texture.onload = () => this.rerender();

        this.setProperties(properties);
    }

    draw(ctx) {
        let start = { ix: Math.floor(-this.x / this.tileSize.width), iy: Math.floor(-this.y / this.tileSize.height) };
        let end = { ix: Math.ceil((-this.x + document.body.offsetWidth) / this.tileSize.width), iy: Math.ceil((-this.y + document.body.offsetHeight) / this.tileSize.width) };
        for (let iy = start.iy; iy < end.iy; iy++)
            for (let ix = start.ix; ix < end.ix; ix++)
                ctx.drawImage(this.image, this.tileWidth * ix, this.tileHeight * iy, this.tileWidth, this.tileHeight);
    }
}



// ---------------------------------------------------------------------------------- Definition of Elements

CanvasObjectModel.defineObjects({
    item: COMElement,
    rectangle: COMRectangleElement,
    image: COMImageElement,
    tiledMap: COMTiledMapElement
});
