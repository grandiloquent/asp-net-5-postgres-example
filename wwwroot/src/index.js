window.header.placeholder = "搜索";

let baseUri;
window.menu.attach(document.querySelector('.menu'));

function writeText(message) {
    const textarea = document.createElement("textarea");
    textarea.style.position = 'fixed';
    textarea.style.right = '100%';
    document.body.appendChild(textarea);
    textarea.value = message;
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

window.menu.eventHandler = (what, href) => {
    if (what === 1) {
        if (href.startsWith("http://") || href.startsWith("https://"))
            writeText(href);
        else
            writeText(baseUri + href);
    } else {
        fetch(`/api/video?id=${href}`, {
            method: 'DELETE'
        })
    }
}

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

    largeMediaItem.addEventListener('click', ev => {
        const href = largeMediaItem.getAttribute('data-href');
        const id = largeMediaItem.getAttribute('data-id');
        fetch(`/api/video/record?id=${id}`).then(res => res.text()).then(res => {
            console.log(res);
        })
        if (href.startsWith("http://") || href.startsWith("https://"))
            window.JInterface.handleRequest(href);
        else
            window.JInterface.handleRequest(baseUri + href);
    });
    largeMediaItemMenu.addEventListener('click', ev => {
        ev.stopPropagation();
        let parent = ev.currentTarget;
        while (parent && parent.className !== 'large-media-item') {
            parent = parent.parentNode;
        }
        window.menu.show(parent);
    });

    return largeMediaItem;
}

const container = document.querySelector('.container');


fetch('/api/video/ck')
    .then(res => res.text())
    .then(res => {
        baseUri = res;
    });

const spinner = document.querySelector('.spinner');
window.spinner.inject(spinner);

const toast = document.querySelector('custom-toast');

async function loadVideos(keyword, factor) {
    const res = await fetch(
        keyword ? `/api/video/query?keyword=${keyword}&factor=${factor}` :
            `/api/video?count=40&factor=${factor}&order=${order}&region=${region}`);
    const items = await res.json();

    if (items.length < 20) {
        stop();
    }
    const videos = keyword === '*' || !keyword ?
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
    await tryGetNewVideos();
}

async function tryGetNewVideos() {
    const response = await fetch('/api/video/57ck');
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.text();
}
