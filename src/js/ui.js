const menu = {
    header: document.querySelector('.header'),
    content: document.querySelector('.content')
};

const content = {
    inv: `
    <div class='equipment'>
        <inv-cell path="player/equipment" type="head" index="head"></inv-cell>
        <inv-cell path="player/equipment" type="body" index="body"></inv-cell>
        <inv-cell path="player/equipment" type="pants" index="pants"></inv-cell>
        <inv-cell path="player/equipment" type="boots" index="boots"></inv-cell>

        <inv-cell path="player/equipment" type="lhand" index="lhand"></inv-cell>
        <inv-cell path="player/equipment" type="rhand" index="rhand"></inv-cell>
    </div>
    <div class='inventory'>
    <inv-cell></inv-cell>
    </div>
    `, inv_processing: () => {

    },
    stat: `stat`,
    settings: `settings`
}

menu.header.addEventListener('click', e => {
    menu.content.innerHTML = content[e.target.dataset.button];
    // content[e.target.dataset.button + "_processing"]();
});

document.oncontextmenu = () => false;

let selectedInvCell = null;

customElements.define('inv-cell', class extends HTMLElement {
    constructor(){
        super();
        this.draggable = false;
        this.type = undefined;

        this.item = null;


        let containdeItem = {
            name: 'empty'
        },
        selected = false;



        Object.defineProperties(this, {
            item: {
                get: () => containdeItem,
                set: value => {
                    containdeItem = value;
                    this.itemChanged();
                    if(this.type)player.equipment[this.type] = this.item;
                }
            },
            selected: {
                get: () => selected,
                set: value => (selected)
                ?(value)
                ?undefined
                :(this.unselect(), selected = value)
                :(value)
                ?(this.select(), selected = value)
                :undefined
            }
        });
    }

    static get observedAttributes() {
        return ['path', 'index', 'type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(!newValue)return;
        switch(name){
            case 'path':
            let obj = ObjectList;
            newValue.split('/').forEach(str => obj = obj[(isNaN(Number(str)))? str : parseInt(str)]);
            this.container = obj;

            break; case 'index':
            if(!this.container)break;
            this.index = (isNaN(Number(newValue)))? newValue : parseInt(newValue);
            if(this.container[this.index])this.item = this.container[this.index];

            break; case 'type':
            this.type = newValue;
        }
    }

    connectedCallback () {
        this.addEventListener('click', ()=> this.selected = !this.selected);
        // if(this.getAttribute('type')){
        //     this.type = this.getAttribute('type');
        //     if(player.equipment[this.type]){
        //         this.item = player.equipment[this.type];
        //     }else{
        //         player.equipment[this.type] = this.item;
        //     }
        // }
    }

    select(){
        if(selectedInvCell){
            this.replaceItem(selectedInvCell);
            selectedInvCell.selected = false;
        }
        this.classList.add('selected');
        selectedInvCell = this;
    }

    unselect(){
        this.classList.remove('selected');
        selectedInvCell = null;
    }

    replaceItem(cell){
        if(((this.type)? cell.item.type != this.type && cell.item.name != "empty" : false) ||
        ((cell.type)? this.item.type != cell.type && this.item.name != "empty" : false)) return;
        [this.item, cell.item] = [cell.item, this.item];
    }

    itemChanged(){
        this.style.backgroundImage = `url(./src/img/icons/items/${this.item.name}.png)`;
        if(this.container)this.container[this.index] = this.item;
    }
});