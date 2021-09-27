window.header.placeholder = "搜索";
window.header.submit = (value) => {
    window.header.hide();

    const videos = value === '*' ?
        items.sort((x, y) => x.Duration - y.Duration)
        : items.filter(i => fuzzysearch(value, i.Title))
            .sort((x, y) => x.Duration - y.Duration);

    render(videos);
}
let baseUri;

function render(videos) {
    const results = [];
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const template = `<div class="large-media-item" data-href="${video.url}">
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
    container.innerHTML = results.join('');
    const largeMediaItems = document.querySelectorAll('.large-media-item');

    largeMediaItems.forEach(largeMediaItem => {
        largeMediaItem.addEventListener('click', ev => {
            const href = largeMediaItem.getAttribute('data-href');
            if (href.startsWith("http://") || href.startsWith("https://"))
                window.location.href = href;
            else
                window.location.href = baseUri + href;
        });
    });

}

const container = document.querySelector('.container');
let items;

fetch('/api/video')
    .then(res => res.json())
    .then(res => {
        items = res
            //.filter(x => x.Duration > 3600)
            .sort((x, y) => x.Duration - y.Duration);
        //render(items);
    })

fetch('/api/video/ck')
    .then(res => res.text())
    .then(res => {
        baseUri = res;
    })