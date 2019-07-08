"use strict"
/* //Содержание по классам
 * Loop Controller
 * Canvas JSON Object Model (COM)
 * COM Canavas
 * COM Item Element - PROTOTYPE OF ALL COM ELEMENTS
 * COM Rectangle Element
 * COM Tiled Map Element
 * Definition of Elements
 */

/* //TODO
 * 
 */

// ---------------------------------------------------------------------------------- LoopController
class LoopController {
    constructor() {
        let functionStack = new Array
            , block = true
            , loop = () => ((!block) ? (functionStack.forEach(func => func())) : undefined,
                window.requestAnimationFrame(loop));
        window.requestAnimationFrame(loop);

        this.insertFunction = (func) => {
            functionStack.push(func);
            return functionStack.length - 1;
        };

        this.insertBackFunction = (func) => {
            functionStack.unshift(func);
        };

        this.removeFunctionByIndex = (index) => {
            functionStack.splice(index, 1);
        };

        this.clear = () => functionStack = new Array;

        this.executeNow = () => functionStack.forEach(func => func());

        Object.defineProperties(this, {
            block: {
                set: value => block = value,
                get: () => block
            }
        });
    }
};



















// ---------------------------------------------------------------------------------- Canvas JSON Object Model
class CanvasObjectModel extends Array {
    constructor(canvas) {
        super();
        this.canvas = canvas;
    }

    static defineObject(name, prototype) {
        CanvasObjectModel.prototype.typeList[name] = prototype;
        prototype.type = name;
    }

    static defineObjects(objects) {
        for (let name in objects)
            this.defineObject(name, objects[name]);
    }

    static createElement(type, properties = {}) {
        if (!this.prototype.typeList[type]) return console.error(`Element with name "${type}" isn't exist!`);
        return new this.prototype.typeList[type](properties);
    }

    static defineTemplate(name, json) {
        this.prototype.templates[name] = json;
    }

    static createElementByTemplate(template) {
        let element = this.createElement(this.prototype.templates[template].type, this.prototype.templates[template].properties);
        if (this.prototype.templates[template].childs) this.parse(this.prototype.templates[template].childs, element);
        return element;
    }

    static parse(json, parent) {
        json = (typeof (json) == 'string') ? JSON.parse(json) : json;
        const wallker = (json, parent) => {
            let element = null;
            if (typeof (json) == "string") {
                json = json.split('.');
                element = this.createElementByTemplate(json[0]);
                element.name = json[1];
            } else element = this.createElement(json.type, json.properties);
            if (json.childs)
                json.childs.forEach(json => wallker(json, element));
            parent.insert(element);
        }
        json.forEach(json => wallker(json, parent));
        return parent;
    }

    static query(path, searchIn = canvas) {
        let selectPath = path.split('/');
        let container = searchIn.children;
        for (let i = 0; i < container.length; i++)
            if (container[i].name == selectPath[0]) {
                selectPath.splice(0, 1);
                if (selectPath.length == 0) return container[i];
                container = container[i].children;
                i = -1;
            }
        return null;
    }

};

CanvasObjectModel.prototype.typeList = new Object;
CanvasObjectModel.prototype.templates = new Object;




















// ---------------------------------------------------------------------------------- COM Canvas


customElements.define('com-canvas', class extends HTMLCanvasElement {
    constructor() {
        super();

        this.context = this.getContext('2d');
        this.ObjectModel = new CanvasObjectModel(this);
        this.width = document.body.offsetWidth;
        this.height = document.body.offsetHeight;
        this.loop = new LoopController;
        document.body.onresize = () => {
            this.width = document.body.offsetWidth;
            this.height = document.body.offsetHeight;
        };


        this.loop.insertFunction(() => this.rerender());
        Object.defineProperties(this, {
            children: { get: () => this.ObjectModel },
            innerJSON: {
                set: json => (this.children.splice(0, this.children.length), CanvasObjectModel.parse(json, this)),
                get: () => {
                    let json = new Array;
                    this.children.forEach(child => {
                        json.push(child.outerJSON);
                    });
                    return json;
                }
            }
        });
    }

    query(path) { return CanvasObjectModel.query(path, this) }

    insert(element) {
        this.ObjectModel.push(element);
        element.inserted(this);
        return element;
    }

    connectedCallback() {
        if (document.canvas) return this.remove();
        window.canvas = this;
        this.loop.block = false;
    }

    rerender() {
        this.context.resetTransform();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        this.render();
    }

    render() {
        this.ObjectModel.forEach(element => {
            this.context.resetTransform();
            element.render(this.context)
        });
        this.context.closePath();
    }

    removeChild(element) {
        let index = this.ObjectModel.indexOf(element);
        this.ObjectModel.splice(index, 1);
        if (this.ObjectModel.length > index) for (; index < this.children.length; ++index)
            this.ObjectModel[index].changeIndex();
    } //TODO
}, { extends: "canvas" });




















// ---------------------------------------------------------------------------------- COM Item Elements - PROTOTYPE OF ALL COM ELEMENTS

class COMElement {
    constructor(properties) {
        let index = null, parent = null,
            x = 0, y = 0,
            width = 0, height = 0,
            visible = "true",
            origin_point = { x: 0, y: 0 }, angle = 0,
            anchors = new Object,
            shadowProperties = null,
            renderFunction = () => { },
            insertFunction = () => { };
        this.children = new Array;
        this.name = '';





        // ФУНКЦИИ С ПРЯМЫМ ДОСТУПОМ К СВОЙСТВАМ
        this.changeIndex = () => {
            index = null;
            if (this.parent) index = parent.children.indexOf(this);
        }

        this.changeParent = newParent => {
            if (this.parent) this.parent.removeChild(this);
            parent = newParent;
            index = null;

        }

        this.relativeProcessing = () => {
            if (anchors.size && parent) switch (anchors.size) {
                case "fill":
                    width = parent.width; height = parent.height;
                    break; case "fill_width":
                    width = parent.width;
                    break; case "fill_height":
                    height = parent.height;
            };

            if (anchors.offsetSize) ([anchors.offsetWidth, anchors.offsetHeight] = [anchors.offsetSize[0], anchors.offsetSize[1]], delete anchors.offsetSize);
            if (anchors.offsetWidth) width += anchors.offsetWidth;
            if (anchors.offsetHeight) height += anchors.offsetHeight;

            if (anchors.position && parent) switch (anchors.position) {
                case "left_top":
                    x = 0; y = 0;
                    break; case "right_top":
                    x = parent.width - width; y = 0;
                    break; case "left_bottom":
                    x = 0; this.y = parent.height - height;
                    break; case "right_bottom":
                    x = parent.width - width; y = parent.height - height;
                    break; case "center":
                    x = parent.width / 2 - width / 2; y = parent.height / 2 - height / 2;
            };

            if (anchors.offsetPosition)
                ([anchors.offsetX, anchors.offsetY] = [anchors.offsetPosition[0], anchors.offsetPosition[1]], delete anchors.offsetPosition);
            if (anchors.offsetX) x += anchors.offsetX;
            if (anchors.offsetY) y += anchors.offsetY;

            if (anchors.origin) switch (anchors.origin) {
                case "center":

            };
            if (anchors.disposable) anchors = new Object;
        }





        // СВОЙСТВА
        Object.defineProperties(this, {
            changeIndex: { enumerable: false },
            changeParent: { enumerable: false },
            relativeProcessing: { enumerable: false },
            children: { enumerable: false },

            //Position
            x: {
                set: newX => x = newX,
                get: () => x
            },
            y: {
                set: newY => y = newY,
                get: () => y
            },
            position: {
                get: () => [x, y],
                set: position => {
                    x = position[0];
                    y = position[1];
                }
            },

            //Size
            width: {
                get: () => width,
                set: newWidth => width = newWidth
            },
            height: {
                get: () => height,
                set: newHeight => height = newHeight
            },
            size: {
                get: () => [width, height],
                set: size => {
                    width = size[0];
                    height = size[1];
                }
            },

            // Visibility
            visible: {
                get: () => visible,
                set: newVisible => {
                    if (newVisible != "true" && newVisible != "false" && newVisible != "only_content" && newVisible != "only_this")
                        return console.error(`${newVisible} is invalid visibility value!`);
                    visible = newVisible;
                }
            },

            // Technical
            parent: {
                get: () => parent
            },
            index: {
                get: () => index
            },

            // Transform Origin
            originX: {
                get: () => origin_point.x,
                set: newOriginX => origin_point.x = newOriginX
            },
            originY: {
                get: () => origin_point.y,
                set: newOriginY => origin_point.y = newOriginY
            },
            origin: {
                get: () => origin_point,
                set: newOrigin => {
                    if (typeof (newOrigin) == "string") return (() => {
                        if (newOrigin == 'center') {
                            origin_point.x = this.width / 2;
                            origin_point.y = this.height / 2;
                        }
                    })();
                    origin_point.x = newOrigin[0];
                    origin_point.y = newOrigin[1];
                }
            },

            // Rotate Origin
            angle: {
                get: () => angle,
                set: newAngle => angle = newAngle
            },

            //Shadow
            shadow: {
                get: () => shadowProperties,
                set: newShadowProperties => {
                    if (typeof (newShadowProperties) != "object") return shadowProperties = null;
                    if (!shadowProperties) shadowProperties = new Object;
                    if (newShadowProperties.x) shadowProperties.x = newShadowProperties.x;
                    if (newShadowProperties.y) shadowProperties.y = newShadowProperties.y;
                    if (newShadowProperties.color) shadowProperties.color = newShadowProperties.color;
                    if (newShadowProperties.blur) shadowProperties.blur = newShadowProperties.blur;
                }
            },

            // Relative processing
            anchors: {
                get: () => anchors,
                set: newAnchors => anchors = newAnchors
            },

            // Stage Functions
            onrender: {
                get: () => renderFunction,
                set: newRenderFunction =>
                    (typeof (newRenderFunction) == "function")
                        ? renderFunction = newRenderFunction
                        : (typeof (newRenderFunction) == "string")
                            ? renderFunction = eval(newRenderFunction)
                            : undefined
            },
            oninsert: {
                get: () => insertFunction,
                set: newInsertFunction =>
                    (typeof (newInsertFunction) == "function")
                        ? insertFunction = newInsertFunction
                        : (typeof (newInsertFunction) == "string")
                            ? insertFunction = eval(newInsertFunction)
                            : undefined
            },

            //JSON
            innerJSON: {
                set: json => (this.children.splice(0, this.children.length), CanvasObjectModel.parse(json, this)),
                get: () => {
                    let json = new Array;
                    this.children.forEach(child => {
                        json.push(child.outerJSON);
                    });
                    return json;
                }
            },

            outerJSON: {
                get: () => {
                    let json = new Object;
                    json.type = this.constructor.type;
                    json.properties = {
                        position: this.position,
                        size: this.size,
                        visible: this.visible,
                        origin: this.origin,
                        angle: this.angle,
                        anchors: this.anchors,
                        onrender: this.onrender.toString(),
                        oninsert: this.onrender.toString()
                    }
                    for (let prop in this) json.properties[prop] = this[prop];
                    json.childs = this.innerJSON;
                    return json;
                }
            }
        });

        this.setProperties(properties);
    }





    //ОТРИСОВКА
    render(ctx) {
        ctx.beginPath();
        this.onrender(this);
        ctx.translate(this.x, this.y);
        ctx.translate(this.originX, this.originY);
        ctx.rotate(this.angle * Math.PI / 180);

        if (this.shadow) {
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur;
            ctx.shadowOffsetX = this.shadow.x;
            ctx.shadowOffsetY = this.shadow.y;
        }

        this.relativeProcessing();
        if (this.visible == "true" || this.visible == "only_this") this.draw(ctx);

        if (this.shadow) {
            ctx.shadowColor = 0;
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // ctx.rotate(-(this.angle * Math.PI / 180));
        ctx.translate(-this.originX, -this.originY);
        if (this.visible == "true" || this.visible == "only_content") this.drawChilds(ctx);

        ctx.translate(this.originX, this.originY);
        ctx.rotate(-this.angle * Math.PI / 180);
        ctx.translate(-this.originX, -this.originY);
        ctx.translate(-this.x, -this.y);
    }

    draw(ctx) { }

    drawChilds(ctx) { this.children.forEach(element => element.render(ctx)); }





    //УСТАНОВКА СВОЙСТВ ИЗ JSON-ОБЪЕКТА
    setProperties(properties) {
        for (let prop in properties)
            this[prop] = properties[prop];
    }




    // ПОИСК/ВСТАВКА/УДАЛЕНИЕ ЭЛЕМЕНТОВ
    query(path) { return CanvasObjectModel.query(path, this) }

    inserted(parent) {
        this.oninsert(this, parent);
        this.changeParent(parent)
    }

    insert(element) {
        this.children.push(element);
        element.inserted(this);
        return element;
    }

    removeChild(element) {
        let index = this.children.indexOf(element);
        this.children.splice(index, 1);
        if (this.children.length > index) for (; index < this.children.length; ++index)
            this.children[index].changeIndex();
    }

    removeChildByIndex(index) {
        this.children.splice(index, 1);
        if (this.children.length > index) for (; index < this.children.length; ++index)
            this.children[index].changeIndex();
    }

    remove() {
        if (this.parent) this.parent.removeChild(this);
    }
};
const hitTest = (obj1, obj2) => {
    if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y)
        return true;
    return false;
};



















// ---------------------------------------------------------------------------------- COM Rectangle Element

class COMRectangleElement extends COMElement {
    constructor(properties) {
        super();
        let color = "transparent",
            src = null,
            texture = null;

        Object.defineProperties(this, {
            color: {
                get: () => color,
                set: newColor => color = newColor
            },
            src: {
                get: () => src,
                set: newSrc => {
                    if (!newSrc) texture = null;
                    let image = new Image;
                    src = newSrc;
                    image.src = src;
                    texture = image;
                }
            },
            image: { get: () => texture }
        })

        this.setProperties(properties);
    }

    draw(ctx) {
        if (this.width == 0 || this.height == 0) return;
        if (this.color != "transparent") {
            ctx.rect(-this.originX, -this.originY, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        if (this.image ? this.image.complete : false) {
            ctx.drawImage(this.image, -this.originX, -this.originY, this.width, this.height);
        }
    }
};




















// ---------------------------------------------------------------------------------- COM Tiled Map Element

class MultiDimensionRangeArray {
    constructor() {
        let ranges = new Array, defaultReturn = null;

        this.setDefault = value => defaultReturn = value;

        this.createRange = (rangesArray, value) => {
            ranges.push({ range: rangesArray, value });
        }

        this.getBy = indexes => {
            for (let i = ranges.length - 1; i > -1; i--) {
                let finded = true;
                ranges[i].range.forEach((range, i) => {
                    if (range.from > indexes[i] || range.to <= indexes[i]) finded = false;
                });
                if (finded) return ranges[i].value;
            }
            return defaultReturn;
        }

        this.clearRanges = () => ranges = new Array;

        Object.defineProperty(this, "ranges", { get: () => ranges });
    }
}

class COMTiledMapElement extends COMElement {
    constructor(properties) {
        super();
        let tile_size = { width: 0, height: 0 },
            tile_storage = new MultiDimensionRangeArray;

        this.clearTileRange = tile_storage.clearRanges;

        Object.defineProperties(this, {

            default_tile: {
                set: src => {
                    if (src != "transparent") {
                        let image = new Image();
                        image.src = src;
                        tile_storage.setDefault(image);
                    } else tile_storage.setDefault("transparent");
                }
            },
            range_tile: {
                set: range => { //{fromX,toX,fromY,toY, src}
                    if (range.src != "transparent") {
                        let image = new Image();
                        image.src = range.src;
                        tile_storage.createRange([{ from: range.fromX, to: range.toX }, { from: range.fromY, to: range.toY }], image);
                    } else tile_storage.createRange([{ from: range.fromX, to: range.toX }, { from: range.fromY, to: range.toY }], "transparent");
                }
            },
            range_tiles: {
                set: ranges => { //[{fromX,toX,fromY,toY, src}...
                    ranges.forEach(range => this.range_tile = range);
                }
            },
            tile_storage: { get: () => tile_storage },



            tile_width: {
                get: () => tile_size.width,
                set: new_tile_width => {
                    tile_size.width = new_tile_width;
                }
            },
            tile_height: {
                get: () => tile_size.height,
                set: new_tile_height => {
                    tile_size.height = new_tile_height;
                }
            },
            tile_size: {
                get: () => tile_size,
                set: new_tile_size => {
                    tile_size.width = new_tile_size[0];
                    tile_size.height = new_tile_size[1];
                }
            },
        });

        this.setProperties(properties);
    }

    draw(ctx) {
        let start = { ix: Math.floor(-this.x / this.tile_size.width), iy: Math.floor(-this.y / this.tile_size.height) };
        let end = { ix: Math.ceil((-this.x + document.body.offsetWidth) / this.tile_size.width), iy: Math.ceil((-this.y + document.body.offsetHeight) / this.tile_size.width) };
        for (let iy = start.iy; iy < end.iy; iy++)
            for (let ix = start.ix; ix < end.ix; ix++)
                if (this.tile_storage.getBy([ix, iy]) != "transparent") ctx.drawImage(this.tile_storage.getBy([ix, iy]), this.tile_width * ix, this.tile_height * iy, this.tile_width, this.tile_height);
    }
}




















// ---------------------------------------------------------------------------------- Definition of Elements

CanvasObjectModel.defineObjects({
    item: COMElement,
    rectangle: COMRectangleElement,
    tiled_map: COMTiledMapElement
});
