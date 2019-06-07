(() => {
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
            CanvasObjectModel.typeList[name] = prototype;
        }

        static defineObjects(objects) {
            for (let name in objects)
                CanvasObjectModel.typeList[name] = objects[name];
        }

        parse(json) {
            const elementWallker = (elementList, answerList = new Array) => {
                elementList.forEach(element => {
                    let newElement = new this.typeList[element.type](element.properties);
                    // if(element.childs)
                });
            }
        }
    };



    CanvasObjectModel.typeList = new Object;




    customElements.define('game-area', class extends HTMLCanvasElement {
        constructor() {
            super();

            this.ObjectModel = new CanvasObjectModel(this);

            this.width = document.body.offsetWidth;
            this.height = document.body.offsetHeight;
            document.body.onresize = () => {
                this.width = document.body.offsetWidth;
                this.height = document.body.offsetHeight;
                this.render();
            };
        }

        connectedCallback() {
            if (gameController.canvas) return this.remove();
            gameController.canvas = this;
        }

        render() {

        }
    }, { extends: "canvas" });




    /*
        visible = true - draw all;
        visible = false - hide all;
        visible = only - draw only this element;
        visible = content - draw only content elements;
    */

    class COMElement {
        constructor(properties, parent = null) {
            this.x = 0;
            this.y = 0;
            this.visible = "true"; // true/false/content/only

            this.children = new Array;
        }

        rerender(){if(this.parent)this.parent.rerender();}

        set x(x){this.x = x;if(this.parent)this.parent.rerender()}

        set y(y){this.y = y;if(this.parent)this.parent.rerender()}

        set children(element){this.children.push(element);if(this.parent)this.parent.rerender()}

        render(){
            switch(this.visible){
                case "true":
                    this.draw();
                    this.drawChilds();
                break;
                case "content":
                    this.drawChilds();
                break;
                case "only":
                    this.draw();
                break;
                case "false":
                    return;
                break;
            };
        }

        draw(){}

        drawChilds(){this.children.forEach(element => element.render());}
    }

    CanvasObjectModel.defineObjects({
        item: COMElement
    })


})();

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