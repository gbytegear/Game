const menu = {
    header: document.querySelector('.header'),
    content: document.querySelector('.content')
};

const content = {
    inv: `
    <div class='equipment'>
        <inv-cell type="head"></inv-cell>
        <inv-cell type="body"></inv-cell>
        <inv-cell type="pants"></inv-cell>
        <inv-cell type="boots"></inv-cell>

        <inv-cell type="lhand"></inv-cell>
        <inv-cell type="rhand"></inv-cell>
    </div>
    <div class='inventory'></div>
    `, inv_processing: () => {

    },
    stat: `stat`,
    settings: `settings`
}

menu.header.addEventListener('click', e => {
    menu.content.innerHTML = content[e.target.dataset.button];
    content[e.target.dataset.button + "_processing"]();
});

document.oncontextmenu = () => false;

let selectedInvCell = null;

customElements.define('inv-cell', class extends HTMLElement {
    constructor(){
        super();
        this.draggable = false;
        this.type = undefined;
        let containdeItem = {
            name: 'empty',
            props: {}
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

    connectedCallback () {
        this.addEventListener('click', ()=> this.selected = !this.selected);
        if(this.getAttribute('type')){
            this.type = this.getAttribute('type');
            if(player.equipment[this.type]){
                this.item = player.equipment[this.type];
            }else{
                player.equipment[this.type] = this.item;
            }
        }
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
        let thisItem = Object.assign({}, this.item);
        this.item = cell.item;
        cell.item = thisItem;
    }

    itemChanged(){
        this.style.backgroundImage = `url(./src/img/icons/items/${this.item.name}.png)`;
    }
});