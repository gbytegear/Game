const menu = document.querySelector('.menu');

menu.querySelector('header').addEventListener('click', e => {
    let  target = e.target,
    carriage = menu.querySelector('.carriage');
    carriage.style.marginLeft = `${target.offsetLeft + target.offsetWidth/2}px`;
})