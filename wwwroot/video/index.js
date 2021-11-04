const ytpAutohide = document.querySelector('.ytp-autohide');
ytpAutohide.addEventListener('click', ev => {
    video.removeAttribute('muted');
    video.muted = false;
    ytpAutohide.style.display = 'none';
})


const player = document.querySelector('#player');
player.addEventListener('click', ev => {
    if (video.paused) return;
    playerControlOverlay.style.display = 'block';
    playerControlOverlay.className = playerControlOverlay.className + ' fadein';

    timer = setTimeout(() => {
        playerControlOverlay.style.display = 'none';
    }, 5000);
})


playerControlPlayPauseIcon.addEventListener('click', ev => {
    ev.stopPropagation();
    if (!video.paused) {
        video.pause();
        clearTimeout(timer);
        playing = false;
        playerControlPlayPauseIcon.querySelector('svg')
            .innerHTML = `<g>
                                        <path d="M6,4l12,8L6,20V4z"></path>
                                    </g>`;
    } else {
        video.play();
        timer = setTimeout(() => {
            playerControlOverlay.style.display = 'none';
        }, 5000)
        playerControlPlayPauseIcon.querySelector('svg')
            .innerHTML = `<path d="M9,19H7V5H9ZM17,5H15V19h2Z"></path>`;
    }
})


const iconButton = document.querySelector('.full-screen');
iconButton.addEventListener('click', async ev => {
    ev.stopPropagation();
    try {
        await video.requestFullscreen();//webkitRequestFullscreen();
        if (screen.orientation.lock)
            screen.orientation.lock("landscape");
    } catch (e) {
    }
})






