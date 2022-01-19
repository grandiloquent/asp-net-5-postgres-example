(function () {
    /*<script src="topbar-renderer.js"></script>*/
    const searchButton = document.querySelector('.topbar-header-content > button:nth-child(2)');
    const menuButton = document.querySelector('.topbar-header-content > button:nth-child(3)');
    const topbarHeader = document.querySelector('.topbar-header');
    const topbarBackArrow = document.querySelector('.topbar-back-arrow');
    const topbarHeaderEndpoint = document.querySelector('.topbar-header-endpoint');
    const topbarHeaderContent = document.querySelector('.topbar-header-content');
    const searchbox = document.querySelector('.searchbox');
    const c3Overlay = document.querySelector('c3-overlay');
    const menuContainer = document.querySelector('.menu-container');
    const menuC3Overlay = document.querySelector('.menu-container c3-overlay');

    menuButton.addEventListener('click', ev => {
        ev.stopPropagation();
        menuContainer.removeAttribute('hidden');
    });
    if (menuC3Overlay) {
        menuC3Overlay.addEventListener('click', ev => {
            ev.stopPropagation();
            menuContainer.setAttribute('hidden', '');
        });
    }

    function close() {
        topbarHeader.removeAttribute('data-mode');
        c3Overlay.setAttribute('hidden', '');
        topbarBackArrow.setAttribute('hidden', '');
        searchbox.setAttribute('hidden', '');
        topbarHeaderEndpoint.removeAttribute('hidden');
        topbarHeaderContent.removeAttribute('hidden');
    }

    if (c3Overlay) {
        c3Overlay.addEventListener('click', ev => {
            ev.stopPropagation();
            close();
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', ev => {
            ev.stopPropagation();
            topbarHeader.setAttribute('data-mode', 'searching');
            topbarHeaderEndpoint.setAttribute('hidden', '');
            topbarHeaderContent.setAttribute('hidden', '');
            c3Overlay.removeAttribute('hidden');
            topbarBackArrow.removeAttribute('hidden');
            searchbox.removeAttribute('hidden');
        });
    }
    if (topbarBackArrow) {
        topbarBackArrow.addEventListener('click', ev => {
            ev.stopPropagation();
            close();
        });
    }
    topbarHeaderEndpoint.addEventListener('click', ev => {
        ev.stopPropagation();
        window.location.href = '/';
    })

    const topbarTitle = document.querySelector('.topbar-title');
    topbarTitle.addEventListener('click', ev => {
        ev.stopPropagation();
        window.location.href = '/';
    })
    window.close = close;


})()