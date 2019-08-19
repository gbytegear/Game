const keys = [];

document.addEventListener('keydown', e => {
    if(keys.includes(e.keyCode))return;
    switch(e.keyCode){
        case 38: case 87: ge.constrols_data.movement[1] += ge.player.stats.movement_speed;break;
        case 39: case 68: ge.constrols_data.movement[0] -= ge.player.stats.movement_speed;break;
        case 40: case 83: ge.constrols_data.movement[1] -= ge.player.stats.movement_speed;break;
        case 37: case 65: ge.constrols_data.movement[0] += ge.player.stats.movement_speed;break;
        // case 27: ;break; //TODO: Open menu
    }
    keys.push(e.keyCode);

});

const switchClass = (element, _class) => element.classList.contains(_class)?element.classList.remove(_class) : element.classList.add(_class);

document.addEventListener('keyup', e => {
    switch(e.keyCode){
        case 38: case 87: ge.constrols_data.movement[1] -= ge.player.stats.movement_speed;break;
        case 39: case 68: ge.constrols_data.movement[0] += ge.player.stats.movement_speed;break;
        case 40: case 83: ge.constrols_data.movement[1] += ge.player.stats.movement_speed;break;
        case 37: case 65: ge.constrols_data.movement[0] -= ge.player.stats.movement_speed;break;
        case 27: switchClass(document.querySelector('.menu'), 'show');break; //TODO: Open menu
    }
    keys.splice(keys.indexOf(e.keyCode), 1);
});

document.addEventListener('mousemove', e => {
    ge.constrols_data.angle = -(180 / Math.PI * Math.atan2(ge.player.x + ge.player.width / 2 - e.clientX, ge.player.y + ge.player.height / 2 - e.clientY));
});

oncontextmenu = () => false;