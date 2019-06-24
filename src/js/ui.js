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