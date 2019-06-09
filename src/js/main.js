
customElements.define('game-controller', class MainController extends HTMLBodyElement {
    constructor() {
        super();
        window.gameController = this;
    }
}, { extends: "body" });














class CanvasObjectModel extends Array { //Canvas JSON Object Model
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




customElements.define('game-area', class extends HTMLCanvasElement {
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
        if (gameController.canvas) return this.remove();
        gameController.canvas = this;
    }

    rerender() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        this.render();
    }

    render() {
        this.ObjectModel.forEach(element => element.draw(this.context));
    }

    removeChild(element) {

    }
}, { extends: "canvas" });




/*  Item-element
    visible = true - draw all;
    visible = false - hide all;
    visible = only - draw only this element;
    visible = content - draw only content elements;
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
        this.parent.rerender();
    }

    render(ctx) {
        ctx.moveTo(this.x, this.y);
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


class COMRectangleElement extends COMElement {
    constructor(properties) {
        super();
        let width = 0,
        height = 0,
        color = "#000";

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
            }
        })

        this.setProperties(properties);
    }

    draw(ctx){
        ctx.rect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


CanvasObjectModel.defineObjects({
    item: COMElement,
    rectangle: COMRectangleElement
})


// // Элементы
// class Rectangle {
//     constructor(properties = {}, parent = null){
//         let width = 0,
//         height = 0,
//         x = 0,
//         y = 0,
//         color = "#000";

//         this.parent = parent;

//         const child = new Array;

//         Object.defineProperties(this, {
//             width:{
//                 get: () => width,
//                 set: newWidth => {width = newWidth;this.render();}
//             },
//             height:{
//                 get: () => height,
//                 set: newHeight => {height = newHeight;this.render();}
//             },
//             x:{
//                 get: () => x,
//                 set: newX => {x = newX;this.render();}
//             },
//             y:{
//                 get: () => y,
//                 set: newY => {y = newY;this.render();}
//             },
//             color:{
//                 get: () => color,
//                 set: newColor => {color = newColor;this.render();}
//             }
//         })
//         this.change(properties);
//     }

//     render(){(this.parent)?this.parent.render():undefined;}

//     darw(ctx){
//         ctx.beginPath();
//         ctx.rect(this.x, this.y, this.width, this.height);
//         ctx.fillStyle = this.color;
//         ctx.fill();
//         ctx.closePath()
//     }

//     change(properties){
//         for(let prop in properties)
//             this[prop] = properties[prop];
//     }
// }