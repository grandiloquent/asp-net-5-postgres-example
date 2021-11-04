(function () {
    class Filter {
        set callback(value) {
            this.handler = value;
        }

        set regionCallback(value) {
            this.regionHandler = value;
        }

        constructor() {
            this.initializeTemplate();
            const proFilterMask = this.root.querySelector('.pro_filter_mask');
            const itemOptions = this.root.querySelector('.item_options');
            const items = this.root.querySelectorAll('.item');

            if (proFilterMask) {
                proFilterMask.addEventListener('click', ev => {
                    proFilterMask.style.display = 'none';
                    itemOptions.style.display = 'none';
                    this.root.querySelector('.item.selected').className = 'item';
                });
            }

            if (itemOptions) {
                itemOptions.addEventListener('click', ev => {

                });
            }
            if (items) {
                items[0].addEventListener('click', ev => {
                    proFilterMask.style.display = 'block';
                    itemOptions.style.display = 'block';
                    ev.currentTarget.className = 'item selected';
                });
                items[1].addEventListener('click', ev => {
                    if (this.regionHandler)
                        this.regionHandler();
                });
            }
            const selections = itemOptions.querySelectorAll('.selection>div');

            if (selections) {
                selections.forEach(selection => selection.addEventListener('click', ev => {
                    selections.forEach(selection => {
                        selection.className = '';
                    });
                    ev.currentTarget.className = 'selected';
                    proFilterMask.style.display = 'none';
                    itemOptions.style.display = 'none';
                    this.root.querySelector('.item.selected').className = 'item';
                    if (this.handler)
                        this.handler(ev.currentTarget.dataset.order);
                }));
            }

        }

        initializeTemplate() {
            const template = document.createElement('template');
            template.innerHTML = `
<style>
.pro_filter_mask{
    display: none;
    height: 100%;
    background: rgba(0,0,0,.3);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}
.pro_filter {
    position: fixed;
    min-height: 45px;
    background-color: #fff;
    top: 48px;
    left: 0;
    right: 0;
}
.pro_filter_items:after{
    -webkit-transform: scaleY(.5);
    -webkit-transform-origin: 50% 100%;
    content: "";
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: #e5e5e5;
    height: 1px;
    left: 0;
    right: 0;
    bottom: 0;

}
.pro_filter_items {
    font-size: 14px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: relative;
    padding: 10px 0;
    height: 25px;
    line-height: 24px;
    text-align: center;
    background: #fff;
    z-index: 20;
}

.item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 0 5px;
    width: 100%;
}
.item.selected .icon_tri_up{
       transform: scaleY(-1);
   
   }
.item>div {
    padding-right: 5px;
}
.icon_tri_up{
    width: 8px;
    height: 5px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKBAMAAABPkMOvAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUdwTMzMzMzMzM3NzczMzKqqqsvLy8vLy9LS0szMzMzMzMzMzMvLy8zMzMzMzMOayfkAAAAOdFJOUwDs1Sb6A72VEWhCpUBBhNlJeQAAAEdJREFUCNdj2PIODLwZ9CCMRwyGEIYwA5cfiH6ygIFhHojxkoGBgR3EKAAyWPPevXsWAGQwNL17pwGiGZjlHhqAGQwXZYAEAGG7KjzTWTeMAAAAAElFTkSuQmCC) no-repeat;
    background-size: 8px auto;
    font-style: normal;
}
.item_options {
    display: none;
    position: relative;
    width: 100%;
    color: #333;
    background-color: #fff;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
}
.selection>div{
overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: #333;
        padding: 0 35px 0 10px;
        position: relative;
}
.selection>div:not(:last-child):before {
    content: "";
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: #e5e5e5;
    height: 1px;
    left: 0;
    right: 0;
    bottom: 0;
        -webkit-transform: scaleY(.5);
    -webkit-transform-origin: 50% 100%;
}
.selection>div.selected {
    color: #e4393c;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAMAAACgaw2xAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUdwTOQ6OtQqKuM4O+M4O/8AAOQ4POI4OuQ4O+Q4O+Q4O+M5POQ4O+M4O+U4OuU2POQ5PAz4v90AAAAQdFJOUwAvBpayAdwRzcRe9XvrRR2xw2ShAAAAaElEQVQY023PWxLAEBBEUQRDPNL7X22eKNLzNdX36yjFzsRId7WBhx3lYLtOqGwXj8x2Z2EdCxle2F6RNNuPgp3KArbvjVEmWTAtIAiVSRhllo2yylr5y75CZE+hsrtw2VW6bC1d9t4JrbEEXbm6PMwAAAAASUVORK5CYII=) right 10px bottom 15px no-repeat;
    background-size: 12px auto;
}

</style>

    <div class="pro_filter_mask">
    </div>
    <div class="pro_filter">
      <div class="pro_filter_items">
        <a class="item">
          <div>
            推荐
          </div>
          <i class="icon_tri_up">
            </i>
        </a>
        <a class="item">
          <div>
            国内
          </div>
        </a>
      </div>
      <div class="item_options">
        <div class="selection">
          <div class="selected" data-order="2">
            推荐
          </div>
          <div data-order="4">
          时间最长
          </div>
          <div data-order="5">
         播放最多
          </div>
           <div data-order="6">
         最新发布
          </div>
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
})();