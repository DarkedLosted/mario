const mario = document.querySelector('.mario')
const canvas = document.querySelector('.canvas')

let playing = true;
let tiresCount = Number.parseInt(localStorage.getItem("tires")) || 0;
let gameSpeed = 300;
const music = new Audio('https://itc.yananas.com/git/mario/assets/overworld.mp3');
const tiresCountElem = document.querySelector('.tires-count');

// init values
tiresCountElem.innerHTML = "Tires count: " + tiresCount;

document.addEventListener('keydown', e => {
    if (!playing) location.reload();

    if (!mario.className.includes('jump')) {
        audio = new Audio('https://itc.yananas.com/git/mario/assets/jump.wav');
        audio.play();

        mario.classList.add('jump');
   
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
})

const getStyleValue = (element, param) => {
    return Number.parseFloat(window.getComputedStyle(element)[param].slice(0, -2));
}

const checkForCollision = setInterval(() => {
    const marioPosition = +window.getComputedStyle(mario).bottom.slice(0, -2)

    document.querySelectorAll('.pipe').forEach(pipe => {
        const pipePosition = pipe.offsetLeft
        if (pipe.offsetLeft < -75) pipe.remove()

        if (pipePosition < 70 && pipePosition > 0 && marioPosition < 65) {
            pipe.style.animation = 'none'
            pipe.style.left = pipePosition + 'px'

            mario.style.animation = 'none'
            mario.style.bottom = marioPosition + 'px'
            mario.src = './images/dead.png'
            mario.style.width = '45px'
            mario.style.marginLeft = '25px'

            document.querySelectorAll('.pipe').forEach(pipe => {
                const pipePosition = pipe.offsetLeft
                pipe.style.animation = 'none'
                pipe.style.left = pipePosition + 'px'
            });

            document.querySelectorAll('.tire').forEach(tire => {
                const tirePosition = tire.offsetLeft
                tire.style.animation = 'none'
                tire.style.left = tirePosition + 'px'
            })

            audio = new Audio('https://itc.yananas.com/git/mario/assets/die.wav');
            audio.play();
            music.pause();

            playing = false;
            clearInterval(checkForCollision)
            clearInterval(newPipes)
            clearInterval(newTires)
        }
    });

    document.querySelectorAll('.tire').forEach(tire => {
        const tirePositionX = tire.offsetLeft;
        const tirePositionY = getStyleValue(tire, 'bottom');
        const marioPositionX = mario.offsetLeft;
        const marioPositionY = getStyleValue(mario, 'bottom');
        if (tire.offsetLeft < 5) tire.remove()

        if (((marioPositionX < (tirePositionX + tire.width)) && ((marioPositionX + mario.width) > tirePositionX)) && ((marioPositionY < (tirePositionY + tire.height)) && ((marioPositionY + mario.height) > tirePositionY))) {
            tire.remove();
            tiresCount++;
            localStorage.setItem("tires", tiresCount);

            tiresCountElem.innerHTML = "Tires count: " + tiresCount;
            audio = new Audio('https://itc.yananas.com/git/mario/assets/coin.mp3');
            audio.play();
        }
    });

}, 10)

const newPipes = setInterval(() => {
    if (Math.random() < .4) {
        const newPipe = document.createElement('img')
        newPipe.src = './images/pipe.png'
        newPipe.classList.add('pipe')
        newPipe.style.animationDuration = window.innerWidth / gameSpeed + 's'

        canvas.appendChild(newPipe)
    }
}, 500)

const newTires = setInterval(() => {
    if (Math.random() < .5) {
        const newTire = document.createElement('img')
        newTire.src = './images/tire.png'
        newTire.classList.add('tire')
        newTire.style.bottom = Math.random() * 100 + 'px';
        newTire.style.animationDuration = window.innerWidth / gameSpeed + 's'

        canvas.appendChild(newTire)
    }
}, 500);