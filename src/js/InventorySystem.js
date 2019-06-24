class Item {
    constructor(name = "empty", property = new Object) {
        let data = JSON.parse(localStorage.getItem('equipment'))[name] || {};
        Object.defineProperties(this, {
            name: {
                get: () => name,
                set: value => (name = value, data = JSON.parse(localStorage.getItem('equipment'))[name])
            },
            type: {get: () => data.type},
            textures: {get: () => data.textures},
            properties: {get: () => data.properties},
            animation: {get: () => data.animation},
            json: {
                get: () => JSON.stringify({ name: this.name, type: this.type, textures: this.textures, properties: this.properties }),
                set: json => (this.name = json.name, data.properties = json.properties)
            }
        })
    }
}

customElements.define('inv-cell', class InvCell extends HTMLElement {
    constructor() {
        super();
        this.draggable = false;
        this.type = undefined;

        this.item = null;


        let containdeItem = new Item(),
            selected = false;



        Object.defineProperties(this, {
            item: {
                get: () => containdeItem,
                set: value => {
                    containdeItem = value;
                    this.itemChanged();
                    if (this.type) player.equipment[this.type] = this.item;
                }
            },
            selected: {
                get: () => selected,
                set: value => (selected)
                    ? (value)
                        ? undefined
                        : (this.unselect(), selected = value)
                    : (value)
                        ? (this.select(), selected = value)
                        : undefined
            }
        });
    }

    static get observedAttributes() {
        return ['path', 'index', 'type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!newValue) return;
        switch (name) {
            case 'path':
                let obj = ObjectList;
                newValue.split('/').forEach(str => obj = obj[(isNaN(Number(str))) ? str : parseInt(str)]);
                this.container = obj;

                break; case 'index':
                if (!this.container) break;
                this.index = (isNaN(Number(newValue))) ? newValue : parseInt(newValue);
                if (this.container[this.index]) this.item = this.container[this.index];

                break; case 'type':
                this.type = newValue;
        }
    }

    connectedCallback() {
        this.addEventListener('click', () => this.selected = !this.selected);
    }

    select() {
        if (InvCell.selectedCell) {
            this.replaceItem(InvCell.selectedCell);
            InvCell.selectedCell.selected = false;
        }
        this.classList.add('selected');
        InvCell.selectedCell = this;
    }

    unselect() {
        this.classList.remove('selected');
        InvCell.selectedCell = null;
    }

    replaceItem(cell) {
        if (((this.type) ? cell.item.type != this.type && cell.item.name != "empty" : false) ||
            ((cell.type) ? this.item.type != cell.type && this.item.name != "empty" : false)) return;
        [this.item, cell.item] = [cell.item, this.item];
    }

    itemChanged() {
        this.style.backgroundImage = `url(./src/img/icons/items/${this.item.name}.png)`;
        if (this.container) this.container[this.index] = this.item;
    }
});