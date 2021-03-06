async function getBaseAddress() {
    const response = await fetch('/api/video/ck');
    return response.text();
}

function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

/**/
let baseUri;
const toast = document.querySelector('custom-toast');

function initializeMenu() {
    window.menu.attach(document.querySelector('.menu'));
    window.menu.eventHandler = async (what, href, element) => {
        if (what === 1) { //复制链接到剪切板
            if (href.startsWith("http://") || href.startsWith("https://"))
                writeText(href);
            else
                // http://57ck.cc/ 频繁更换域名，需要通过接口获取当前域名
                writeText(baseUri + href);
        } else if (what === 2) {
            // 删除无效的视频，可能的原因是该视频已被源网站移除
            // 譬如91porn某些视频往往一天之内便失效
            // 该功能需要管理员登录获取认证Cookie
            {
                try {
                    const response = await fetch(`/api/video?id=${href}`, {
                        method: 'DELETE'
                    });
                    toast.setAttribute('message', 'Success.');
                } catch (e) {

                }

            }
            // 调用 Android Java 代码下载视频
        } else if (what === 3) {
                if (href.startsWith("http://") || href.startsWith("https://"))
                    window.JInterface.download(href, element.querySelector('h3').textContent);
                else
                    window.JInterface.download(baseUri + href, element.querySelector('h3').textContent);
            }else if (what === 5) {
                writeText(href.querySelector('h3').textContent);
            }
        }
}

function onItemClick(largeMediaItem) {
    largeMediaItem.addEventListener('click', async ev => {
        const href = largeMediaItem.getAttribute('data-href');
        const id = largeMediaItem.getAttribute('data-id');
        //await fetch(`/api/video/record?id=${id}`)
        if (window.JInterface) {
            if (href.startsWith("http://") || href.startsWith("https://"))
                window.JInterface.handleRequest(href,id);
            else
                window.JInterface.handleRequest(baseUri + href,id);
        }
        /*else {
            if (href.startsWith("https://www.xvideos.com/") )
                window.location.href = `/video.html?q=${encodeURIComponent(new URL(href).pathname)}&t=${encodeURIComponent(largeMediaItem.querySelector('h3').textContent)}&id=${id}`;
            else
                window.location.href = `/video.html?q=${encodeURIComponent(href)}&t=${encodeURIComponent(largeMediaItem.querySelector('h3').textContent)}&id=${id}`;
        }
*/

    });
}

function onContextItem(largeMediaItemMenu) {
    largeMediaItemMenu.addEventListener('click', ev => {
        ev.stopPropagation();
        let parent = ev.currentTarget;
        while (parent && parent.className !== 'large-media-item') {
            parent = parent.parentNode;
        }
        window.menu.show(parent);
    });
}

/**/

async function initialize() {
    baseUri = await getBaseAddress();
    initializeMenu();
}

initialize().then(r => {

}).catch(res => {
    toast.setAttribute('message', '无法加载页面');
});


// Set video options menu

function render(videos) {
    const documentFragment = document.createDocumentFragment();

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        documentFragment.appendChild(makeItem(video));
    }
    container.appendChild(documentFragment);
}

function makeItem(video) {
    const largeMediaItem = document.createElement('DIV');
    largeMediaItem.setAttribute('class', 'large-media-item');
    largeMediaItem.setAttribute('data-id', video.id);
    largeMediaItem.setAttribute('data-href', video.url);
    const a = document.createElement('A');
    const videoThumbnailContainerLarge = document.createElement('DIV');
    videoThumbnailContainerLarge.setAttribute('class', 'video-thumbnail-container-large');
    const videoThumbnailBg = document.createElement('DIV');
    videoThumbnailBg.setAttribute('class', 'video-thumbnail-bg cover');
    videoThumbnailContainerLarge.appendChild(videoThumbnailBg);
    const cover = document.createElement('IMG');
    cover.setAttribute('class', 'cover');
    cover.setAttribute('src', video.thumbnail);
    videoThumbnailContainerLarge.appendChild(cover);
    const videoThumbnailOverlayBottomGroup = document.createElement('DIV');
    videoThumbnailOverlayBottomGroup.setAttribute('class', 'video-thumbnail-overlay-bottom-group');
    const thumbnailOverlayTimeStatusRenderer = document.createElement('DIV');
    thumbnailOverlayTimeStatusRenderer.setAttribute('class', 'thumbnail-overlay-time-status-renderer');
    thumbnailOverlayTimeStatusRenderer.appendChild(document.createTextNode(formatDuration(video.duration)));
    videoThumbnailOverlayBottomGroup.appendChild(thumbnailOverlayTimeStatusRenderer);
    videoThumbnailContainerLarge.appendChild(videoThumbnailOverlayBottomGroup);
    a.appendChild(videoThumbnailContainerLarge);
    largeMediaItem.appendChild(a);
    const details = document.createElement('DIV');
    details.setAttribute('class', 'details');
    const largeMediaChannel = document.createElement('DIV');
    largeMediaChannel.setAttribute('class', 'large-media-channel');
    const channelThumbnailIcon = document.createElement('DIV');
    channelThumbnailIcon.setAttribute('class', 'channel-thumbnail-icon');
    channelThumbnailIcon.style.fontSize = '8px!important';
    channelThumbnailIcon.style.display = 'flex';
    channelThumbnailIcon.style.alignItems = 'center';
    channelThumbnailIcon.style.justifyContent = 'center';
    channelThumbnailIcon.appendChild(document.createTextNode(video.type === 3 ? '57' : (video.type === 1 ? '91' : "XV")));
    largeMediaChannel.appendChild(channelThumbnailIcon);
    details.appendChild(largeMediaChannel);
    const largeMediaItemInfo = document.createElement('DIV');
    largeMediaItemInfo.setAttribute('class', 'large-media-item-info');
    const largeMediaItemMetadata = document.createElement('DIV');
    largeMediaItemMetadata.setAttribute('class', 'large-media-item-metadata');
    const a1 = document.createElement('A');
    const largeMediaItemHeadline = document.createElement('H3');
    largeMediaItemHeadline.setAttribute('class', 'large-media-item-headline');
    largeMediaItemHeadline.appendChild(document.createTextNode(video.title));
    a1.appendChild(largeMediaItemHeadline);
    largeMediaItemMetadata.appendChild(a1);
    largeMediaItemInfo.appendChild(largeMediaItemMetadata);
    const largeMediaItemMenu = document.createElement('DIV');
    largeMediaItemMenu.setAttribute('class', 'large-media-item-menu');
    const iconButton = document.createElement('BUTTON');
    iconButton.setAttribute('class', 'icon-button');
    const c3Icon = document.createElement('DIV');
    c3Icon.setAttribute('class', 'c3-icon');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('enable-background', 'new 0 0 24 24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z');
    svg.appendChild(path);
    c3Icon.appendChild(svg);
    iconButton.appendChild(c3Icon);
    largeMediaItemMenu.appendChild(iconButton);
    largeMediaItemInfo.appendChild(largeMediaItemMenu);
    details.appendChild(largeMediaItemInfo);
    largeMediaItem.appendChild(details);

    onItemClick(largeMediaItem);

    onContextItem(largeMediaItemMenu);

    return largeMediaItem;
}

const container = document.querySelector('.container');


const spinner = document.querySelector('.spinner');
window.spinner.inject(spinner);


async function loadVideos(keyword, factor) {
    if (/\d+:\d+/.test(keyword)) {
        keyword = "tj:" + hmsToSecondsOnly(keyword);
    }
    const res = await fetch(
        keyword ? `/api/video/query?keyword=${keyword}&factor=${factor}&region=${region}` :
            `/api/video?count=40&factor=${factor}&order=${order}&region=${region}`);
    const items = await res.json();

    if (items.length < 20) {
        stop();
    }
    const videos = keyword === '*' || keyword === '91' || keyword === '-91'|| keyword === '51'|| keyword === '1' || !keyword || keyword.startsWith("tj:") ?
        items
        : items.filter(i => fuzzysearch(keyword, i.title));

    render(videos);
}

let keyword;
let factor = 0;
let stopped = false;
let order = 2;
let region = 0;
let loading = false;

function stop() {
    stopped = true;
    spinner.style.display = 'none';
    toast.setAttribute('message', '已全部加载');
}

const observer = new IntersectionObserver(async callback => {
    if (callback[0].isIntersecting && !loading) {
        if (stopped) return;
        try {
            loading = true;
            await loadVideos(keyword, factor);
            factor++;
        } catch (e) {
            stop();
        }
        loading = false;
    }
});
observer.observe(spinner);

let keywords;
if (window.localStorage) {
    const keywordsString = window.localStorage.getItem("keywords");
    keywords = keywordsString ? JSON.parse(keywordsString) : [];
    if (keywords.length > 8)
        keywords = keywords.slice(0, 8);
    window.header.appendKeywords(keywords);
}

window.header.placeholder = "搜索";
window.header.submit = async (value) => {
    window.header.hide();
    spinner.removeAttribute('style');
    keyword = value;
    factor = 0;
    stopped = false;
    container.innerHTML = '';
    if (keyword && keywords) {
        if (keywords.length > 8)
            keywords.pop();
        keywords.unshift(value);
        keywords = [...new Set(keywords)];
        window.localStorage.setItem('keywords', JSON.stringify(keywords));
        window.header.appendKeywords(keywords);
    }
}
// Set filter options
window.filter.callback = async (value) => {
    factor = 0;
    stopped = false;
    order = value;
    container.innerHTML = '';
}
window.filter.regionCallback = async (value) => {
    factor = 0;
    stopped = false;
    region = 3;
    container.innerHTML = '';
    await tryUpdateVideos();
}
// Set filter options

// Try to update the videos
async function tryUpdateVideos() {
    const response = await fetch('/api/video/57ck');
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.text();
}
