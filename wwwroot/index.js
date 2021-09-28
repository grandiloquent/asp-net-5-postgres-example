window.header.placeholder = "搜索";

let baseUri;

function render(videos) {
    const results = [];
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const template = `<div class="large-media-item" data-id="${video.id}" data-href="${video.url}">
        <a>
            <div class="video-thumbnail-container-large">
                <div class="video-thumbnail-bg cover">
                </div>
                <img class="cover" src="${video.thumbnail}">
                <div class="video-thumbnail-overlay-bottom-group">
                    <div class="thumbnail-overlay-time-status-renderer">
                        ${formatDuration(video.duration)}
                    </div>
                </div>
            </div>
        </a>
        <div class="details">
            <div class="large-media-channel" style="display: none">
                <div class="channel-thumbnail-icon">

                </div>
            </div>
            <div class="large-media-item-info">
                <div class="large-media-item-metadata">
                    <a>
                        <h3 class="large-media-item-headline">
                            ${video.title}
                        </h3>
                    </a>
                </div>
                <div class="large-media-item-menu" style="display: none">
                    <button class="icon-button">
                        <div class="c3-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24"
                                 viewBox="0 0 24 24" width="24">
                                <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"></path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>`
        results.push(template);
    }
    container.insertAdjacentHTML('beforeend', results.join(''));
    const largeMediaItems = document.querySelectorAll('.large-media-item');

    largeMediaItems.forEach(largeMediaItem => {
        largeMediaItem.addEventListener('click', ev => {
            const href = largeMediaItem.getAttribute('data-href');
            const id = largeMediaItem.getAttribute('data-id');
            fetch(`/api/video/record?id=${id}`).then(res => res.text()).then(res => {
                console.log(res);
            })
            if (href.startsWith("http://") || href.startsWith("https://"))
                window.location.href = href;
            else
                window.location.href = baseUri + href;
            
        });
    });

}

const container = document.querySelector('.container');


fetch('/api/video/ck')
    .then(res => res.text())
    .then(res => {
        baseUri = res;
    });

const spinner = document.querySelector('custom-spinner');
const toast = document.querySelector('custom-toast');

async function loadVideos(keyword, factor) {
    const res = await fetch(
        keyword ? `/api/video/query?keyword=${keyword}&factor=${factor}` :
            `/api/video?count=40&factor=${factor}`);
    const items = await res.json();

    if (items.length < 20) {
        stop();
    }
    const videos = keyword === '*' || !keyword ?
        items.sort((x, y) => x.duration - y.duration)
        : items.filter(i => fuzzysearch(keyword, i.title))
            .sort((x, y) => x.duration - y.duration);

    render(videos);
}

let keyword;
let factor = 0;
let stopped = false;

function stop() {
    stopped = true;
    spinner.style.display = 'none';
    toast.setAttribute('message', '已全部加载');
}

const observer = new IntersectionObserver(async callback => {
    if (callback[0].isIntersecting) {
        if (stopped) return;
        try {
            await loadVideos(keyword, factor);
        } catch (e) {
            console.log(e);
            stop();
        }
        factor++;
    }
});
observer.observe(spinner);

window.header.submit = async (value) => {
    window.header.hide();
    spinner.removeAttribute('style');
    keyword = value;
    factor = 0;
    stopped = false;
    container.innerHTML = '';
}