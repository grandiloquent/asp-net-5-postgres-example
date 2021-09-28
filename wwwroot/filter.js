(function () {
    class Filter {
        constructor() {
            this.initializeTemplate();
        }

        initializeTemplate() {
            const template = document.createElement('template');
            template.innerHTML = `
<style>
.pro_filter_more {
    min-height: 50px;
    font-size: 12px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    z-index: 1;
    position: fixed;
    top:48px;
    left: 0;
    right: 0;
}
.show_more {
    overflow: hidden;
    overflow-x: auto;
    vertical-align: text-top;
    white-space: nowrap;
    z-index: 2;
    -ms-overflow-style: none;
    scrollbar-width: none;
    box-sizing: border-box;
    position: relative;
    padding: 10px;
    height: 50px;
    text-align: center;
    display: flex;
    
}

.item {
    width: 24%;
    padding-right: 6px;
}
.item>a {
    display: block;
    position: relative;
    padding: 2.5px 5px;
    height: 25px;
    line-height: 25px;
    color: #666;
    background-color: #f2f2f7;
    border-radius: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.item span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    max-width: 100%;
    padding-right: 13px;
}
.item span i {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -2px;
    width: 8px;
    height: 5px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKBAMAAABPkMOvAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUdwTMzMzMzMzM3NzczMzKqqqsvLy8vLy9LS0szMzMzMzMzMzMvLy8zMzMzMzMOayfkAAAAOdFJOUwDs1Sb6A72VEWhCpUBBhNlJeQAAAEdJREFUCNdj2PIODLwZ9CCMRwyGEIYwA5cfiH6ygIFhHojxkoGBgR3EKAAyWPPevXsWAGQwNL17pwGiGZjlHhqAGQwXZYAEAGG7KjzTWTeMAAAAAElFTkSuQmCC) no-repeat;
    background-size: 8px auto;
}
</style>
<div class="pro_filter_more">
    <div class="show_more">
        <div class="item">
            <a><span>1小时以上<i></i></span></a>
        </div>
    </div>
</div>
    `;
            document.body.appendChild(template);
            const container = document.createElement('div');
            const root = container.attachShadow({mode: 'open'});
            root.appendChild(template.content.cloneNode(true));
            this.root = root;
            document.body.appendChild(container);
        }

        hide() {

        }

        show() {

        }
    }

    window.filter = new Filter();
})()