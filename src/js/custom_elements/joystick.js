customElements.define('gm-joystick', class extends HTMLElement {
    constructor() {
        super();
        let touchPointStart, touchIndex;
        this.handle = document.createElement('div');
        this.handle.className = "handle";
        this.percent = 0;
        let value = { x: 0, y: 0, touched: false, out: false, angle: 0 };
        this.onout = function(){};
        this.onin = function(){};
        this.onmove = function(){};

        this.addEventListener("touchstart", e => {
            touchIndex = e.touches.length - 1;
            touchPointStart = { x: e.touches[touchIndex].clientX - this.offsetLeft - this.offsetWidth / 2, y: e.touches[touchIndex].clientY - this.offsetTop - this.offsetHeight / 2 };
            value.touched = true;
        });
        this.addEventListener("touchmove", e => {
            let touchPointCurrent = { x: e.touches[touchIndex].clientX - this.offsetLeft - this.offsetWidth / 2, y: e.touches[touchIndex].clientY - this.offsetTop - this.offsetHeight / 2 },
                outOfBounds = !(Math.pow(touchPointCurrent.x - touchPointStart.x, 2) + Math.pow(touchPointCurrent.y - touchPointStart.y, 2) <
                    (this.offsetWidth / 2 - this.handle.offsetWidth / 2) * (this.offsetHeight / 2 - this.handle.offsetHeight / 2));
            value.angle = Math.atan2(touchPointCurrent.y - touchPointStart.y, touchPointCurrent.x - touchPointStart.x);
            if (outOfBounds) touchPointCurrent = { x: Math.cos(value.angle) * (this.offsetWidth / 2 - this.handle.offsetWidth / 2), y: Math.sin(value.angle) * (this.offsetHeight / 2 - this.handle.offsetHeight / 2) };
            this.handle.style.marginLeft = touchPointCurrent.x + "px";
            this.handle.style.marginTop = touchPointCurrent.y + "px";
            this.value.x = touchPointCurrent.x / this.percent;
            this.value.y = touchPointCurrent.y / this.percent;
            this.value.out = outOfBounds;
            if(outOfBounds){this.onout()}else{this.onin()}
            this.onmove(value);
        });
        this.addEventListener("touchend", e => {
            this.handle.style.marginLeft = 0 + "px";
            this.handle.style.marginTop = 0 + "px";
            value.touched = false;
            this.value.x = 0;
            this.value.y = 0;
            this.value.out = false;
            this.onin();
            this.onmove(value);
        });
        Object.defineProperties(this, {
            value: {
                get: () => value
            }
        })
    }

    static get observedAttributes() {
        return ['onout', 'onin', 'onmove'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name == "onout")this.onout = eval(`()=>{${newValue}}`);
        if(name == "onin")this.onin = eval(`()=>{${newValue}}`);
        if(name == "onmove")this.onmove = eval(`(value)=>{${newValue}}`);
    }

    connectedCallback() {
        this.appendChild(this.handle)
        this.percent = (this.offsetWidth - this.handle.offsetWidth) / 2;
    }
});

let style = document.createElement('style');

document.head.appendChild(style);

style.textContent = `
    gm-joystick {
        display: block;
        width: 150px; height: 150px;
        background-color: #060917dd;
        border-radius: 75px;
    }

    gm-joystick>.handle{
        width: 50px;
        height: 50px;
        background-color: #e8f6f9dd;
        border-radius: 25px;
        position: absolute;
        left: 50px; top: 50px;
    }
`