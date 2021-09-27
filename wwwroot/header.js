(function () {

    class Header {
        constructor() {
            this.initializeTemplate();
            const c3Overlay = this.root.querySelector('c3-overlay');
            this.c3Overlay = c3Overlay;
            const topbarHeader = this.root.querySelector('.topbar-header');
            this.topbarHeader = topbarHeader;
            const iconButton = this.root.querySelector('.topbar-header-content .icon-button');
            const topbarBackArrow = this.root.querySelector('.topbar-back-arrow');
            this.searchboxInput = this.root.querySelector('.searchbox-input');
            const searchboxForm = this.root.querySelector('.searchbox-form');

            if (searchboxForm) {
                searchboxForm.addEventListener('submit', ev => {
                    ev.preventDefault();
                    if (this.submitCallabck)
                        this.submitCallabck(this.searchboxInput.value);
                });
            }

            if (this.searchboxInput) {
                this.searchboxInput.addEventListener('click', ev => {

                });
            }

            if (topbarBackArrow) {
                topbarBackArrow.addEventListener('click', ev => {
                    this.hide();
                });
            }

            if (iconButton) {
                iconButton.addEventListener('click', ev => {
                    this.show();
                });
            }

            if (c3Overlay) {
                c3Overlay.addEventListener('click', ev => {
                    this.hide();
                });
            }

        }

        set placeholder(value) {
            this.searchboxInput.placeholder = value;
        }

        set submit(callback) {
            this.submitCallabck = callback;
        }

        initializeTemplate() {
            const template = document.createElement('template');
            template.innerHTML = `
<style>
button
{
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    text-transform: inherit;
    color: inherit;
    background: transparent;
}
button, select, [role="button"], input[type="checkbox"]
{
    cursor: pointer;
}
.topbar-header-endpoint
{
    display: flex;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    height: 48px;
    text-align: left;
}
.topbar-renderer
{
    position: fixed;
    padding: 0;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    display: block;
    background-color: rgba(255,255,255,.98);
    -ms-flex: 0 1 auto;
}
.in
{
    top: 0;
    -webkit-transition: transform 225ms cubic-bezier(0,0,.2,1);
    transition: transform 225ms cubic-bezier(0,0,.2,1);
    -webkit-transition-property: all;
    transition-property: all;
}
.topbar-header
{
    position: relative;
    z-index: 2;
    -webkit-box-shadow: 0 4px 2px -2px rgb(0/20%);
    box-shadow: 0 4px 2px -2px rgb(0/20%);
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    height: 48px;
    -ms-flex: 0 1 auto;
}
.topbar-header-content
{
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    color: #606060;
    min-width: 0;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.icon-button
{
    border: none;
    background: transparent;
    width: 40px;
    height: 40px;
    padding: 8px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.topbar-header-content .icon-button
{
    padding: 12px;
    height: 48px;
    width: 48px;
}
c3-icon
{
    display: inline-block;
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke: none;
}
c3-overlay
{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    cursor: pointer;
    background-color: rgba(0,0,0,.8);
}
.topbar-renderer c3-overlay
{
    z-index: 3;
}
.topbar-header[data-mode="searching"]
{
    z-index: 3;
    background-color: #f1f1f1;
}
[data-mode="searching"] .topbar-header-content
{
    display: none;
}
[data-mode="searching"] .searchbox
{
    display: flex;
}
[data-mode="searching"] .topbar-back-arrow
{
    display: block;
}
.topbar-back-arrow
{
    color: #606060;
    padding: 12px;
    display: none;
}
.searchbox
{
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    color: #606060;
    min-width: 0;
    display: none;
}
.searchbox-form
{
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin: 0;
}
.searchbox-input-wrapper
{
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
}
input
{
    background-color: transparent;
    padding-bottom: 4px;
    outline: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: none;
    -webkit-border-radius: 0;
    border-radius: 0;
    margin-bottom: 1px;
    font: inherit;
    color: #030303;
}
input
{
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #737373;
    text-overflow: ellipsis;
}
.title
{
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    margin: 0;
    font-size: 1.5rem;
    font-weight: normal;
}
.searchbox-input.title
{
    width: 100%;
    margin-top: 4px;
    outline: none;
}
</style>

    <div class="topbar-renderer in">
      <c3-overlay style="display: none">
        <button class="hidden-button" aria-label="关闭搜索功能">
        </button>
      </c3-overlay>
      <header class="topbar-header">
        <button aria-label="关闭搜索功能" class="topbar-back-arrow">
          <c3-icon class="undefined" flip-for-rtl>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" width="24">
              <path d="M21,11v1H5.64l6.72,6.72l-0.71,0.71L3.72,11.5l7.92-7.92l0.71,0.71L5.64,11H21z">
              </path>
            </svg>
          </c3-icon>
        </button> <button class="topbar-header-endpoint">
        </button>
        <div class="topbar-header-content">
          <button class="icon-button">
            <c3-icon>
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z">
                </path>
              </svg>
            </c3-icon>
          </button>
        </div>
        <div class="searchbox">
          <form class="searchbox-form">
            <div class="searchbox-input-wrapper">
              <input class="searchbox-input title" name="search" placeholder="在 YouTube 中搜索" autocomplete="off" autocorrect="off" spellcheck="false" type="text" aria-haspopup="false" role="combobox" aria-autocomplete="list" dir="ltr" style="outline: none;" />
            </div>
            <input type="submit" hidden="" /><button class="icon-button" aria-label="在 YouTube 中搜索" aria-haspopup="false">
              <c3-icon>
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z">
                  </path>
                </svg></c3-icon>
            </button>
          </form>
        </div>
      </header>
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
            this.c3Overlay.style.display = 'none';
            this.topbarHeader.removeAttribute('data-mode');
        }

        show() {
            this.c3Overlay.style.display = 'block';
            this.topbarHeader.setAttribute('data-mode', 'searching');
        }


    }

    window.header = new Header();
})()