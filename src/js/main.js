
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

        this.width = document.body.offsetWidth;
        this.height = document.body.offsetHeight;
        document.body.onresize = () => {
            this.width = document.body.offsetWidth;
            this.height = document.body.offsetHeight;
            this.render();
        };

        Object.defineProperty(this,"children",{get:()=>this.ObjectModel});
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
            visible = "true"; // true/false/only_content/only_this

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
            position:{
                get: () => [x,y],
                set: position => {
                    x = position[0];
                    y = position[1];
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
                get: () => index,
                // set: newIndex => index = newIndex
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
        if(this.parent)this.parent.rerender();
    }

    render(ctx) {
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        switch (this.visible) {
            case "true":
                this.draw(ctx);
                this.drawChilds(ctx);
                break;
            case "only_content":
                this.drawChilds(ctx);
                break;
            case "only_this":
                this.draw(ctx);
                break;
            case "false":
                return;
                break;
        };
    }

    draw(ctx) {}

    drawChilds(ctx) { this.children.forEach(element => element.render(ctx)); }

    setProperties(properties){
        for(let prop in properties)
            this[prop] = properties[prop];
    }

    removeChild(element) {

    }

}




















// ---------------------------------------------------------------------------------- Rectangle COM Element

class COMRectangleElement extends COMElement {
    constructor(properties) {
        super();
        let width = 0,
        height = 0,
        color = "transparent";

        Object.defineProperties(this,{
            width:{
                get: () => width,
                set: newWidth => {width = newWidth; this.rerender();}
            },
            height:{
                get: () => height,
                set: newHeight => {height = newHeight; this.rerender();}
            },
            color:{
                get: () => color,
                set: newColor => {color = newColor; this.rerender();}
            },
            size:{
                get: () => [width,height],
                set: size => {
                    width = size[0];
                    height = size[1];
                    this.rerender();
                }
            }
        })

        this.setProperties(properties);
    }

    draw(ctx){
        ctx.rect(0,0,this.width,this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}







// ---------------------------------------------------------------------------------- Image COM Element

class COMImageElement extends COMElement {
    constructor(properties) {
        super();
        let width = 0,
        height = 0,
        src = null,
        texture = new Image();

        Object.defineProperties(this,{
            width:{
                get: () => width,
                set: newWidth => {width = newWidth; this.rerender();}
            },
            height:{
                get: () => height,
                set: newHeight => {height = newHeight; this.rerender();}
            },
            src:{
                get: () => src,
                set: newSrc => {
                    src = newSrc;
                    texture.src = src;}
            },
            size:{
                get: () => [width,height],
                set: size => {
                    width = size[0];
                    height = size[1];
                    this.rerender();
                }
            },
            image:{get:()=>texture}
        })

        texture.onload = ()=>this.rerender();

        this.setProperties(properties);
    }

    draw(ctx){
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
    }
}




// ---------------------------------------------------------------------------------- Definition of Elements

CanvasObjectModel.defineObjects({
    item: COMElement,
    rectangle: COMRectangleElement,
    image: COMImageElement
})
