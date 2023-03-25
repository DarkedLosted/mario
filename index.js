const mario = document.querySelector('.mario')
const canvas = document.querySelector('.canvas')

let docLoaded = false;
let bgMusic = null;

const HOOKAH_EFFECT_MS = 11000;
let underHookahEffect = false;

let playing = true;
let tiresCount = Number.parseInt(localStorage.getItem("tires")) || 0;
let gameSpeed = 300;
const music = new Audio('https://itc.yananas.com/git/mario/assets/overworld.mp3');
const tiresCountElem = document.querySelector('.tires-count');

// init values
tiresCountElem.innerHTML = "Tires count: " + tiresCount;

document.addEventListener('keydown', e => {
    if (!playing) {
        location.reload()
    }

    if (!docLoaded) {
        bgMusic = new Audio('./audio/music/tyagi-bg.mp3');
        bgMusic.play();

        docLoaded = true;
    }

    if (!mario.className.includes('jump')) {
        audio = new Audio('https://itc.yananas.com/git/mario/assets/jump.wav');
        audio.play();
        mario.classList.add('jump')
        setTimeout(() => {
            mario.classList.remove('jump')
        }, 500)
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
            if (!underHookahEffect) {
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

                document.querySelectorAll('.hookah').forEach(hookah => {
                    const hookahPosition = hookah.offsetLeft
                    hookah.style.animation = 'none'
                    hookah.style.left = hookahPosition + 'px'
                })

                audio = new Audio('https://itc.yananas.com/git/mario/assets/die.wav');
                audio.play();
                music.pause();

                playing = false;
                clearInterval(checkForCollision)
                clearInterval(newPipes)
                clearInterval(newTires)
                clearInterval(newHookahs)
            } else {
                function generateRandomInteger(min, max) {
                    return Math.floor(min + Math.random()*(max - min + 1))
                }
                pipe.style.transform = `translate(3000px, ${generateRandomInteger(-1000, 0)}px)`;
                setTimeout(() => {
                    pipe.remove();
                }, 500);
            }
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

    document.querySelectorAll('.hookah').forEach(hookah => {
        const tirePosition = hookah.offsetLeft
        if (hookah.offsetLeft < 5) hookah.remove()

        if (tirePosition < 70 && tirePosition > 20 && marioPosition < 65) {
            bgMusic.pause();
            hookah.remove();
            tiresCount++;

            tiresCountElem.innerHTML = "Tires count: " + tiresCount;
            audio = new Audio('./audio/music/barhat.mp3');
            audio.play();

            document.querySelectorAll('.hookah').forEach(hookah => hookah.remove());

            underHookahEffect = true;

            mario.src = './images/pikachu-running.gif'

            document.querySelector('.hookah-effect').style.display = 'flex';

            setTimeout(() => {
                document.querySelector('.hookah-effect').style.display = 'none';
                mario.src = './images/mario.gif';
                audio.pause();
                bgMusic.play();
                underHookahEffect = false;
            }, HOOKAH_EFFECT_MS);

            // document.querySelectorAll('.pipe').forEach(pipe => {
            //     const pipePosition = pipe.offsetLeft
            //     tire.style.animation = 'none'
            //     tire.style.left = pipePosition + 'px'
            // })
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

const newHookahs = setInterval(() => {
    if (Math.random() < .3 && !underHookahEffect) {
        const newPipe = document.createElement('img')
        newPipe.src = './images/hookah.png'
        newPipe.classList.add('hookah')
        newPipe.style.animationDuration = window.innerWidth / gameSpeed + 's'

        canvas.appendChild(newPipe)
    }
}, 2000)

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