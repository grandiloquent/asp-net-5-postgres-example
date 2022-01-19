/************************/
/********** 功能 ********/

function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}

function undercore(value) {
    if (!value) return null;
    return value.replaceAll(/ +/g, '_').toLowerCase().replaceAll(/[^a-z0-9A-Z_]+/g, "");
}

// 测试元素是否位于屏幕可见区
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

/************************/
/********** 功能 ********/

;(function () {


    /************************/
    /********** 方法 ********/

    function initializeSearch() {
        const searchboxForm = document.querySelector('.searchbox-form');
        const searchboxInput = document.querySelector('.searchbox-input');

        searchboxForm.addEventListener('submit', async ev => {
            ev.preventDefault();
            const needle = searchboxInput.value.trim();
            if (!needle) return;
            if (!searchData) {
                searchData = await loadSearchData();
            }
            const results = searchData.filter(video => {
                return fuzzysearch(needle, video.ChineseTitle) || fuzzysearch(needle, video.Title)
            });
            window.close();
            if (!results || !results.length) {
                toast.setAttribute('message', `没有找到与 "${needle}" 相关的结果`)
                return;
            }
            document.querySelectorAll('.rich-item-renderer').forEach(element => element.remove());
            const container = document.createDocumentFragment();
            results.forEach(video => {
                container.appendChild(makeRichItem(video));
            });
            const div = document.createElement('div');
            div.appendChild(container);
            topbar.insertAdjacentElement('afterend', div);
        })
    }

    function makeRichItem(video) {
        let uri = `${undercore(video.Title)}_${video.UniqueId}`;
        const richItemRenderer = document.createElement('DIV');
        richItemRenderer.setAttribute('class', 'rich-item-renderer');
        const largeMediaItem = document.createElement('DIV');
        largeMediaItem.setAttribute('class', 'large-media-item');
        const a = document.createElement('A');
        a.setAttribute('href', `videos/${uri}`);
        const videoThumbnailContainerLarge = document.createElement('DIV');
        videoThumbnailContainerLarge.setAttribute('class', 'video-thumbnail-container-large');
        const cover = document.createElement('DIV');
        cover.setAttribute('class', 'cover video-thumbnail-bg');
        videoThumbnailContainerLarge.appendChild(cover);
        const cover1 = document.createElement('IMG');
        cover1.setAttribute('class', 'cover');
        cover1.setAttribute('alt', video.Title);
        cover1.setAttribute('data-src', `//static.lucidu.cn/images/${uri}.jpg`);
        imageObserver.observe(cover1);
        videoThumbnailContainerLarge.appendChild(cover1);
        a.appendChild(videoThumbnailContainerLarge);
        largeMediaItem.appendChild(a);
        const details = document.createElement('DIV');
        details.setAttribute('class', 'details');
        const largeMediaChannel = document.createElement('DIV');
        largeMediaChannel.setAttribute('class', 'large-media-channel');
        const profileIcon = document.createElement('DIV');
        profileIcon.setAttribute('class', 'profile-icon');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.width = '24px';
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.width = '24px';
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M17.016 10.5l3.984-3.984v10.969l-3.984-3.984v3.516q0 0.422-0.305 0.703t-0.727 0.281h-12q-0.422 0-0.703-0.281t-0.281-0.703v-10.031q0-0.422 0.281-0.703t0.703-0.281h12q0.422 0 0.727 0.281t0.305 0.703v3.516z');
        svg.appendChild(path);
        profileIcon.appendChild(svg);
        largeMediaChannel.appendChild(profileIcon);
        details.appendChild(largeMediaChannel);
        const largeMediaItemInfo = document.createElement('DIV');
        largeMediaItemInfo.setAttribute('class', 'large-media-item-info');
        const largeMediaItemMetadata = document.createElement('DIV');
        largeMediaItemMetadata.setAttribute('class', 'large-media-item-metadata');
        const a1 = document.createElement('A');
        a1.setAttribute('href', `videos/${uri}`);
        const largeMediaItemHeadline = document.createElement('H3');
        largeMediaItemHeadline.setAttribute('class', 'large-media-item-headline');
        largeMediaItemHeadline.appendChild(document.createTextNode(video.ChineseTitle));
        a1.appendChild(largeMediaItemHeadline);
        largeMediaItemMetadata.appendChild(a1);
        largeMediaItemInfo.appendChild(largeMediaItemMetadata);
        const largeMediaItemMenu = document.createElement('DIV');
        largeMediaItemMenu.setAttribute('class', 'large-media-item-menu');
        const iconButton = document.createElement('BUTTON');
        iconButton.setAttribute('class', 'icon-button ');
        iconButton.setAttribute('aria-label', '操作菜单');
        iconButton.setAttribute('aria-haspopup', 'true');
        const c3Icon = document.createElement('C3-ICON');
        const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg1.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg1.setAttribute('enable-background', 'new 0 0 24 24');
        svg1.setAttribute('height', '24');
        svg1.setAttribute('viewBox', '0 0 24 24');
        svg1.setAttribute('width', '24');
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z');
        svg1.appendChild(path1);
        c3Icon.appendChild(svg1);
        iconButton.appendChild(c3Icon);
        largeMediaItemMenu.appendChild(iconButton);
        largeMediaItemInfo.appendChild(largeMediaItemMenu);
        details.appendChild(largeMediaItemInfo);
        largeMediaItem.appendChild(details);
        richItemRenderer.appendChild(largeMediaItem);
        return richItemRenderer;
    }

    function initializeLazyLoadImages(elements) {
        imageObserver = new IntersectionObserver(entries => {
            Array.prototype.forEach.call(entries, function (entry) {
                if (entry.isIntersecting) {
                    imageObserver.unobserve(entry.target);
                    if (entry.target.dataset.src) {
                        entry.target.src = entry.target.dataset.src;
                        entry.target.removeAttribute('data-src');
                    }
                }
            });
        });
        elements.forEach((element) => {
            imageObserver.observe(element);
        });
    }

    async function loadSearchData() {
        const response = await fetch('../search_data.json');
        if (response.ok) return await response.json();
        throw new Error(`${response.statusText}`);
    }

    /************************/
    /********** 全局变量 ********/
    const elements = document.querySelectorAll('img.cover');
    let searchData, imageObserver;
    const topbar = document.querySelector('.topbar');
    const toast = document.querySelector('#toast');
   

    /************************/
    /********** 语句 ********/
    addEventListener('DOMContentLoaded', () => {
        elements.forEach((element, x) => {
            if (element.dataset.src && isElementInViewport(element)) {
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
            }
        });
    }, false);
    /************************/
    /********** 调用方法 ********/
    initializeSearch();
    initializeLazyLoadImages(elements);


})();