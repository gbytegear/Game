

customElements.define('game-cube',

    class Cube extends HTMLElement {
        constructor() {
            super();

            let sidePrototype = document.createElement('div');

            sidePrototype.style.position = "absolute";

            this.front = sidePrototype;
            this.back = sidePrototype.cloneNode();

            this.left = sidePrototype.cloneNode();
            this.right = sidePrototype.cloneNode();
            this.top = sidePrototype.cloneNode();
            this.bottom = sidePrototype.cloneNode();

            this.left.style.left = "0px";
            // this.left.style.transform = "rotateY(90deg)";
            // this.left.style.transformOrigin = "0";
            this.right.style.right = "0px";
            this.top.style.top = "0px";
            this.bottom.style.bottom = "0px";

            this.depth = 0;

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
                    set: textureList => {
                        this.front.style.background = textureList.front;
                        this.back.style.background = textureList.back;
                        this.left.style.background = textureList.left;
                        this.right.style.background = textureList.right;
                        this.top.style.background = textureList.top;
                        this.bottom.style.background = textureList.bottom;
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

            this.appendChild(this.back);
            this.appendChild(this.bottom);
            this.appendChild(this.left);
            this.appendChild(this.right);
            this.appendChild(this.top);
            this.appendChild(this.front);

            this.setPosition(50, 50);
        }

        changePerspective(x, y) { //
            let d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            let angle1 = 180 / Math.PI * Math.acos((Math.pow(x, 2) + Math.pow(y, 2) - Math.pow(d, 2)) / 2 * y * x);
            let angle2 = 180 / Math.PI * Math.acos((Math.pow(x, 2) + Math.pow(y, 2) - Math.pow(d, 2)) / 2 * y * x);
            // let angle3 = 

            this.front.style.transform = `translate(${x}px, ${y}px)`;
            this.left.style.width = x + 'px';
            this.left.style.transform = `skewY(${(180 / Math.PI * Math.acos((Math.pow(x, 2) + Math.pow(y, 2) - Math.pow(d, 2)) / 2 * y * x)) / 2}deg) translateY(${y / 2}px)`
        }

        setPosition(x, y) {
            this.style.left = x + "px";
            this.style.top = y + "px";
        }


    }

);



/*

function conver_gtr(e) {
    return e / (180 / Math.PI)
}
function conver_rtg(e) {
    return 180 / Math.PI * e
}
case 1:
this.side_3 = parseFloat(document.form_triangle.side_3.value);
this.angle_1 = parseFloat(document.form_triangle.angle_1.value);
this.angle_3 = parseFloat(document.form_triangle.angle_3.value);
if (180 <= this.angle_1 + this.angle_3) {
    oForm.error_msg(2)
} else {
    this.angle_2 = 180 - this.angle_1 - this.angle_3;
    this.side_2 = this.side_3 * (Math.sin(conver_gtr(this.angle_1)) / Math.sin(conver_gtr(this.angle_2)));
    this.side_1 = this.side_3 * (Math.sin(conver_gtr(this.angle_3)) / Math.sin(conver_gtr(this.angle_2)))
}
break;
        case 2:
this.angle_2 = parseFloat(document.form_triangle.angle_2.value);
this.side_1 = parseFloat(document.form_triangle.side_1.value);
this.side_2 = parseFloat(document.form_triangle.side_2.value);
if (180 <= this.angle_2) {
    oForm.error_msg(3)
} else {
    this.side_3 = Math.sqrt(this.side_2 * this.side_2 + this.side_1 * this.side_1 - 2 * this.side_2 * this.side_1 * Math.cos(conver_gtr(this.angle_2)));
    this.angle_1 = conver_rtg(Math.acos((this.side_1 * this.side_1 + this.side_3 * this.side_3 - this.side_2 * this.side_2) / (2 * this.side_1 * this.side_3)));
    this.angle_3 = 180 - this.angle_2 - this.angle_1
}
break;
        case 3:
this.side_1 = parseFloat(document.form_triangle.side_1.value);
this.side_2 = parseFloat(document.form_triangle.side_2.value);
this.side_3 = parseFloat(document.form_triangle.side_3.value);
if (this.side_1 + this.side_2 <= this.side_3 || this.side_1 + this.side_3 <= this.side_2 || this.side_2 + this.side_3 <= this.side_1) {
    oForm.error_msg(4)
} else {
    this.angle_1 = conver_rtg(Math.acos((this.side_1 * this.side_1 + this.side_3 * this.side_3 - this.side_2 * this.side_2) / (2 * this.side_1 * this.side_3)));
    this.angle_3 = conver_rtg(Math.acos((this.side_2 * this.side_2 + this.side_3 * this.side_3 - this.side_1 * this.side_1) / (2 * this.side_2 * this.side_3)));
    this.angle_2 = 180 - this.angle_1 - this.angle_3
}
break
        }


* /