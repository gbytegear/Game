window.json = {
    pos: {
        "x": 0,
        "y": null
    },
    list: ["String", 0, null, undefined],
};


customElements.define('json-cell', class extends HTMLElement {
    constructor() {
        super();
        this.ptr = null;
        this.name = null;
        this.type = null;
        this.parent = null;
    }

    load(ptr, parent = null, name = undefined) {
        this.ptr = ptr;
        this.parent = parent;
        this.type = typeof (ptr);
        if (name) this.name = name;


        if (this.type == "object") {
            if (this.ptr != null) {
                this.type = this.ptr.constructor.name;
                for (let name in ptr) {
                    this.appendChild(document.createElement('json-cell').load(ptr[name], this, name));
                }
            } else {
                this.type = "null";
            }
        } else {
            if (this.type != "undefined") this.innerText += this.ptr;
        }

        if (this.name) this.setAttribute('name', this.name);
        this.setAttribute('type', this.type);
        return this;
    }

    reload() {
        this.innerHTML = "";
        this.load(this.ptr, this.parent, this.name);
    }

    change(property, value) {
        switch (property) {
            case "name":
                let name = prompt(`New name of ${this.name}`);
                if (this.parent.type == "Array") name = (isNaN(Number(name))) ? name : parseFloat(name);
                this.parent.ptr[name] = this.ptr;
                delete this.parent.ptr[this.name];
                this.parent.reload();
                break;
            case "value":
                if (this.type == "null" || this.type == "undefined") return alert(`Varaible with type "${this.type}" can't be changed!`);
                let lastValue = this.ptr;
                try { lastValue = JSON.stringify(this.ptr) } catch (e) { }
                let value = prompt(`New value of ${this.name}`, lastValue);
                if (value == null) return;
                switch (this.type) {
                    case "number":
                        value = parseFloat(value);
                    case "string":
                        this.parent.ptr[this.name] = value;
                        this.innerText = value;
                        break;
                    case "Object":
                    case "Array":
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            return alert(e);
                        }
                        this.parent.ptr[this.name] = value;
                }
                this.ptr = this.parent.ptr[this.name];
                this.reload();
                break;
            case "type":
                let type = prompt(`New type of ${this.name}`);
                switch (type) {
                    case "number":
                        this.parent.ptr[this.name] = parseFloat(this.ptr);
                        break; case "string":
                        if (this.type == "Object" || this.type == "Array") {
                            this.parent.ptr[this.name] = JSON.stringify(this.ptr)
                        } else if (this.type != "null" && this.type != "undefined" && this.ptr.toString) {
                            this.parent.ptr[this.name] = this.ptr.toString();
                        } else this.parent.ptr[this.name] = "";
                        break; case "object":
                        let newValue = new Object;
                        if (this.type == 'string') try {
                            newValue = JSON.parse(this.ptr);
                        } catch (e) { }
                        this.parent.ptr[this.name] = newValue;
                        break; case "array":
                        this.parent.ptr[this.name] = new Array(this.ptr);
                }
                this.ptr = this.parent.ptr[this.name];
                this.reload();
        }
    }

    delete(){
        delete this.parent.ptr[this.name];
        this.remove();
    }

    connectedCallback() { }
})











customElements.define('json-editor', class extends HTMLElement {
    constructor() {
        super();
        this.ptr = json;
        this.oncontextmenu = () => false;
    }
    static get observedAttributes() {
        return ['path'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'path':
                let ptr = window;
                newValue.split('.').forEach(str => ptr = ptr[(isNaN(Number(str))) ? str : parseInt(str)]);
                this.ptr = ptr;
                this.load(ptr);
        }
    }

    load(root) {
        this.ptr = root;
        this.innerHTML = "";
        this.appendChild(document.createElement('json-cell').load(this.ptr, this, 'root'));
    }

    reload(){
        this.load(this.ptr);
    }

    connectedCallback() {
        this.reload();
        this.addEventListener('contextmenu', e => {
            if (e.target.nodeName == "JSON-CELL")
                this.appendChild(document.createElement('json-context').call(e.clientX - this.offsetLeft + this.scrollLeft, e.clientY - this.offsetTop + this.scrollTop, e.target));
        })
    }
})











customElements.define('json-context', class extends HTMLElement {
    constructor() {
        super();
        this.options = ['Change value', 'Change type', 'Change name', 'delete'];
        this.selected = null;
        this.pos = [0, 0]
    }

    call(x, y, selected) {
        this.pos = [x, y];
        this.selected = selected;
        document.addEventListener('click', () => this.close());
        return this;
    }

    close() {
        document.removeEventListener('click', () => this.close());
        this.remove();
    }

    execute(name) {
        if (/Change/.test(name))
            return this.selected.change(name.replace('Change ', ""));
        switch(name){
            case 'delete':
                this.selected.delete();
        }
    }

    connectedCallback() {
        this.options.forEach(optionName => {
            let option = document.createElement('div');
            option.innerText = optionName;
            this.appendChild(option);
        })
        this.style.position = `absolute`;
        this.style.left = `${this.pos[0]}px`;
        this.style.top = `${this.pos[1]}px`;

        this.addEventListener('click', e => {
            this.execute(e.target.innerText);
        })
    }
})











let style = document.createElement('style');

document.head.appendChild(style);

style.textContent = `
    json-editor{
        display: block;
        position: fixed;
        background-color: #202020;
        font-family: Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;
        color: white;
        max-height: 100vh;
        overflow-y: scroll;
        overflow-x: scroll;
    }

    json-editor::before{
        display: block;
        position: sticky;
        top: 0;
        content: "Strictly Typed JSON Tree Editor";
        text-align: center;
        background-color: #404040;
        border-bottom: .2px solid white;
    }

    json-cell{
        display: block;
        transition: .3s;
    }

    json-cell json-cell{
        padding-left: 1em;
        border-left: 2px solid #f44336;
    }
    
    json-cell json-cell::before{
        content: attr(name)': ';
        color: #ff8080;
        margin-left: -.5em;
    }
    json-cell::after{
        content: ' ['attr(type)']';
        color: #8080ff;
    }
    json-cell json-cell:hover{
        padding-left: 2em;
        background-color: #fff1;
    }

    json-cell json-cell{border-color: #E91E63}
    json-cell json-cell json-cell{border-color: #9C27B0}
    json-cell json-cell json-cell json-cell{border-color: #673AB7}
    json-cell json-cell json-cell json-cell json-cell{border-color: #3F51B5}
    json-cell json-cell json-cell json-cell json-cell json-cell{border-color: #2196F3}




    json-context {
        background-color: #202020;
        font-family: Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;
        border: 1px solid white;
    }

    json-context>*:hover{
        background-color: #fff1;
        cursor: pointer;
    }
`;



