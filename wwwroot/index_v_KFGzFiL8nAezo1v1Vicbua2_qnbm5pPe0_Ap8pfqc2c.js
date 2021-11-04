function fuzzysearch(n,t){var r=t.length,u=n.length,i,f,e;if(u>r)return!1;if(u===r)return n===t;n:for(i=0,f=0;i<u;i++){for(e=n.charCodeAt(i);f<r;)if(t.charCodeAt(f++)===e)continue n;return!1}return!0}function formatDuration(n){if(isNaN(n))return"0:00";n<0&&(n=-n);const t={hour:Math.floor(n/3600)%24,minute:Math.floor(n/60)%60,second:Math.floor(n)%60};return Object.entries(t).filter((n,t)=>t||n[1]).map(n=>(n[1]+"").padStart(2,"0")).join(":")}function writeText(n){const t=document.createElement("textarea");t.style.position="fixed";t.style.right="100%";document.body.appendChild(t);t.value=n;t.select();document.execCommand("copy");t.remove()}async function getBaseAddress(){const n=await fetch("/api/video/ck");return n.text()}function render(n){const t=document.createDocumentFragment();for(let i=0;i<n.length;i++){const r=n[i];t.appendChild(makeItem(r))}container.appendChild(t)}function makeItem(n){const t=document.createElement("DIV");t.setAttribute("class","large-media-item");t.setAttribute("data-id",n.id);t.setAttribute("data-href",n.url);const w=document.createElement("A"),u=document.createElement("DIV");u.setAttribute("class","video-thumbnail-container-large");const b=document.createElement("DIV");b.setAttribute("class","video-thumbnail-bg cover");u.appendChild(b);const s=document.createElement("IMG");s.setAttribute("class","cover");s.setAttribute("src",n.thumbnail);u.appendChild(s);const h=document.createElement("DIV");h.setAttribute("class","video-thumbnail-overlay-bottom-group");const c=document.createElement("DIV");c.setAttribute("class","thumbnail-overlay-time-status-renderer");c.appendChild(document.createTextNode(formatDuration(n.duration)));h.appendChild(c);u.appendChild(h);w.appendChild(u);t.appendChild(w);const f=document.createElement("DIV");f.setAttribute("class","details");const l=document.createElement("DIV");l.setAttribute("class","large-media-channel");const i=document.createElement("DIV");i.setAttribute("class","channel-thumbnail-icon");i.style.fontSize="8px!important";i.style.display="flex";i.style.alignItems="center";i.style.justifyContent="center";i.appendChild(document.createTextNode(n.type===3?"57":n.type===1?"91":"XV"));l.appendChild(i);f.appendChild(l);const e=document.createElement("DIV");e.setAttribute("class","large-media-item-info");const a=document.createElement("DIV");a.setAttribute("class","large-media-item-metadata");const k=document.createElement("A"),v=document.createElement("H3");v.setAttribute("class","large-media-item-headline");v.appendChild(document.createTextNode(n.title));k.appendChild(v);a.appendChild(k);e.appendChild(a);const o=document.createElement("DIV");o.setAttribute("class","large-media-item-menu");const y=document.createElement("BUTTON");y.setAttribute("class","icon-button");const p=document.createElement("DIV");p.setAttribute("class","c3-icon");const r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("xmlns","http://www.w3.org/2000/svg");r.setAttribute("enable-background","new 0 0 24 24");r.setAttribute("height","24");r.setAttribute("viewBox","0 0 24 24");r.setAttribute("width","24");const d=document.createElementNS("http://www.w3.org/2000/svg","path");return d.setAttribute("d","M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"),r.appendChild(d),p.appendChild(r),y.appendChild(p),o.appendChild(y),e.appendChild(o),f.appendChild(e),t.appendChild(f),t.addEventListener("click",()=>{const i=t.getAttribute("data-href"),r=t.getAttribute("data-id");fetch(`/api/video/record?id=${r}`).then(n=>n.text()).then(n=>{console.log(n)});isMobile?window.location.href=i.startsWith("http://")||i.startsWith("https://")?`/video.html?q=${decodeURIComponent(i)}&t=${encodeURIComponent(n.title)}`:`/video.html?q=${decodeURIComponent(i)}&t=${encodeURIComponent(n.title)}`:i.startsWith("http://")||i.startsWith("https://")?window.JInterface.handleRequest(i):window.JInterface.handleRequest(baseUri+i)}),o.addEventListener("click",n=>{n.stopPropagation();let t=n.currentTarget;while(t&&t.className!=="large-media-item")t=t.parentNode;window.menu.show(t)}),t}async function loadVideos(n,t){const r=await fetch(n?`/api/video/query?keyword=${n}&factor=${t}&region=${region}`:`/api/video?count=40&factor=${t}&order=${order}&region=${region}`),i=await r.json();i.length<20&&stop();const u=n==="*"||!n?i:i.filter(t=>fuzzysearch(n,t.title));render(u)}function stop(){stopped=!0;spinner.style.display="none";toast.setAttribute("message","已全部加载")}async function tryUpdateVideos(){const n=await fetch("/api/video/57ck");if(!n.ok)throw new Error(n.statusText);return await n.text()}(function(){class n{constructor(){}inject(n){const t=document.createElement("template");t.innerHTML=`
<style>
@keyframes spinner {
            0% {
                transform: rotate(0deg)
            }
        
            to {
                transform: rotate(360deg)
            }
        }
        
        div {
            display: block;
            box-sizing: border-box;
            margin: 12px auto;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid #eee;
            border-top-color: #666;
            animation: spinner .8s linear infinite
        }
        
        div:not([hidden]) {
            color: #333;
            font-size: 1.6rem
        }
</style>
<div></div>
    `;document.body.appendChild(t);const i=n.attachShadow({mode:"open"});i.appendChild(t.content.cloneNode(!0));document.body.appendChild(n)}}window.spinner=new n})();class CustomToast extends HTMLElement{static get observedAttributes(){return["message"]}constructor(){super();this.root=this.attachShadow({mode:"open"});const r=document.createElement("style");r.textContent=CustomToast.getStyle();this.root.appendChild(r);const n=document.createElement("DIV");n.setAttribute("class","c3-toast");const t=document.createElement("DIV");t.setAttribute("class","notification-action-renderer");const i=document.createElement("DIV");i.setAttribute("class","notification-action-response-text");t.appendChild(i);n.appendChild(t);this.root.appendChild(n);this.c3Toast=n;this.notificationActionResponseText=i;this.messages=[];this.timer=0}connectedCallback(){}disconnectedCallback(){}showMessage(){if(this.messages.length&&!this.showing){const n=this.messages.shift();this.notificationActionResponseText.textContent=n;this.c3Toast.setAttribute("dir","in");this.showing=!0;this.timer&&clearTimeout(this.timer);this.timer=setTimeout(()=>{this.c3Toast.setAttribute("dir","out"),setTimeout(()=>{this.showing=!1,this.showMessage()},195)},3e3)}}attributeChangedCallback(n,t,i){n==="message"&&(this.messages.push(i),this.showMessage())}adoptedCallback(){}static getTemplate(n){return`
        ${CustomToast.getStyle()}
        <div>
            ${n}
        </div>
        `}static getStyle(){return`
        .c3-toast[dir="in"] {
            transition: margin 225ms cubic-bezier(0.0, 0.0, 0.2, 1);
            margin-bottom: 0;
        }
        
        .c3-toast[dir="out"] {
            transition: margin 195ms cubic-bezier(0.4, 0.0, 1, 1);
        }
        
        .c3-toast {
            display: block;
            position: fixed;
            z-index: 4;
            left: 0;
            right: 0;
            bottom: 0;
            box-sizing: border-box;
            padding: 14px 24px;
            font-size: 1.4rem;
            color: #ffffff;
            background: hsl(0, 0%, 20%);
            will-change: transform;
            margin-bottom: -100%;
        }
        
        .notification-action-renderer {
            display: flex;
            align-items: center;
        }
        
        .notification-action-response-text {
            flex-grow: 1;
            padding-right: 1rem;
            font-size:14px;
        }
        
        `}}customElements.define("custom-toast",CustomToast),function(){class n{constructor(){this.initializeTemplate();const n=this.root.querySelector("c3-overlay");this.c3Overlay=n;const u=this.root.querySelector(".topbar-header");this.topbarHeader=u;const t=this.root.querySelector(".topbar-header-content .icon-button"),i=this.root.querySelector(".topbar-back-arrow");this.searchboxInput=this.root.querySelector(".searchbox-input");const r=this.root.querySelector(".searchbox-form");r&&r.addEventListener("submit",n=>{n.preventDefault(),this.submitCallabck&&this.submitCallabck(this.searchboxInput.value)});this.searchboxInput&&this.searchboxInput.addEventListener("click",()=>{});i&&i.addEventListener("click",()=>{this.hide()});t&&t.addEventListener("click",()=>{this.show()});n&&n.addEventListener("click",()=>{this.hide()});this.initializeDropdown()}set placeholder(n){this.searchboxInput.placeholder=n}set submit(n){this.submitCallabck=n}initializeDropdown(){const n=this.root.querySelector(".searchbox-dropdown");n&&n.addEventListener("click",()=>{});this.searchboxDropdown=n;const t=n.querySelector(".sbsb_c");this.sbsbC=t}appendKeywords(n){const t=[];for(let i=0;i<n.length;i++){const r=`<div class="sbmsq_b">
                  <div class="sbsb_k">
                    ${n[i]}
                  </div>
                  <div class="sbmsq_a">
                  </div>
                </div>`;t.push(r)}this.sbsbC.innerHTML=t.join("");const i=this.searchboxDropdown.querySelectorAll(".sbmsq_a");i&&i.forEach(n=>n.addEventListener("click",()=>{this.searchboxInput.value=n.previousSibling.previousSibling.textContent.trim()}));const r=this.searchboxDropdown.querySelectorAll(".sbsb_k");r&&r.forEach(n=>n.addEventListener("click",()=>{this.submitCallabck&&this.submitCallabck(n.textContent.trim())}));this.searchboxDropdown.style.display="block"}initializeTemplate(){const n=document.createElement("template");n.innerHTML=`
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
.searchbox-dropdown
{
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
}
.sbdd_b
{
    background-color: rgba(0,0,0,.102);
    border: none;
    border-radius: 0;
    box-shadow: none;
    -webkit-box-shadow: none;
    border-top-color: #d9d9d9;
    -webkit-border-radius: 0 0 3px 3px;
    cursor: default;
    font-size: 1.4rem;
    color: #030303;
}
.sbsb_c
{
    background-color: #f9f9f9;
    padding: 0;
}
.sbmsq_b
{
    display: flex;
    display: -webkit-flex;
    display: flexbox;
    display: box;
    display: -webkit-box;
    display: -moz-box;
}
.sbsb_k
{
    padding: 10px 3px 11px 8px;
    flex-grow: 1;
    -moz-box-ordinal-group: 1;
    -ms-flex-order: 1;
    -webkit-order: 1;
    order: 1;
    -webkit-box-ordinal-group: 1;
    -webkit-box-flex: 1;
    -webkit-user-select: none;
    word-wrap: break-word;
}
.sbmsq_a
{
    background: #f3f3f3 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAo0lEQVRIx+3X4QaAMBQF4L10RIwRMUZE9BB7t96gXOpfdVrtdMV+HMbY9+teOybGaDSyHxZC5gIX+BdwpTlOteYc15oLpGHB8/Y4BUew3FmAWxZMwe/CEgdwx4Kz4qmwpAV4y4Kz4E9hSQfwjgW/wt/CEg9wz4IlIRXPBSfjub+tPcADC76D9yxYMqDtxmwL49VKZVeV8Wymv+hJ09EiMVqlbQXTCZuExPleFwAAAABJRU5ErkJggg==) no-repeat center;
    -webkit-background-size: 15px,15px;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    width: 37px;
    flex: 0 0 37px;
    -webkit-flex: 0 0 37px;
    -moz-box-flex: 0;
    -moz-box-ordinal-group: 2;
    -webkit-order: 2;
    -webkit-box-flex: 0;
    -webkit-box-ordinal-group: 2;
    z-index: 5000000;
    background-color: #f1f1f1;
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
          <div class="searchbox-dropdown" style="display: none">
            <div class="sbdd_b">
              <div class="sbsb_c">
                
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  
    `;document.body.appendChild(n);const t=document.createElement("div"),i=t.attachShadow({mode:"open"});i.appendChild(n.content.cloneNode(!0));this.root=i;document.body.appendChild(t)}hide(){this.c3Overlay.style.display="none";this.topbarHeader.removeAttribute("data-mode")}show(){this.c3Overlay.style.display="block";this.topbarHeader.setAttribute("data-mode","searching")}}window.header=new n}(),function(){class n{set callback(n){this.handler=n}set regionCallback(n){this.regionHandler=n}constructor(){this.initializeTemplate();const t=this.root.querySelector(".pro_filter_mask"),n=this.root.querySelector(".item_options"),i=this.root.querySelectorAll(".item");t&&t.addEventListener("click",()=>{t.style.display="none",n.style.display="none",this.root.querySelector(".item.selected").className="item"});n&&n.addEventListener("click",()=>{});i&&(i[0].addEventListener("click",i=>{t.style.display="block",n.style.display="block",i.currentTarget.className="item selected"}),i[1].addEventListener("click",()=>{this.regionHandler&&this.regionHandler()}));const r=n.querySelectorAll(".selection>div");r&&r.forEach(i=>i.addEventListener("click",i=>{r.forEach(n=>{n.className=""}),i.currentTarget.className="selected",t.style.display="none",n.style.display="none",this.root.querySelector(".item.selected").className="item",this.handler&&this.handler(i.currentTarget.dataset.order)}))}initializeTemplate(){const n=document.createElement("template");n.innerHTML=`
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
  
    `;document.body.appendChild(n);const t=document.createElement("div"),i=t.attachShadow({mode:"open"});i.appendChild(n.content.cloneNode(!0));this.root=i;document.body.appendChild(t)}hide(){}show(){}}window.filter=new n}(),function(){class n{set eventHandler(n){this.callback=n}constructor(){}attach(n){const t=document.createElement("template");t.innerHTML=`
    <style>
    #menu, .menu-container
{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    z-index: 3;
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
[role=button], button, input[type=checkbox], select
{
    cursor: pointer;
}
.hidden-button
{
    position: fixed;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
}
.menu-content
{
    position: relative;
    z-index: 2;
    max-height: 100%;
    overflow-y: auto;
    color: #030303;
    background-color: #f9f9f9;
    padding: 3px;
}
@media(min-width: 330px)
{
    .menu-content:not(.menu-bottom)
    {
        min-width: 250px;
        max-width: 356px;
        margin: 40px;
    }
}
ytm-menu-item
{
    display: block;
    padding: 3px 0;
}
a
{
    color: currentColor;
    text-decoration: none;
}
.menu-item-button
{
    box-sizing: border-box;
    display: block;
    font-size: 1.6rem;
    padding: 9px 12px;
    text-align: initial;
    text-transform: unset;
    width: 100%;
}
</style>
    <div class="menu-container">
      <div class="menu-content">
        <ytm-menu-item>
          <a class="menu-item-button" id="action-copy">
          复制链接地址
          </a>
           <a class="menu-item-button" id="action-delete">
         删除
          </a>
           <a class="menu-item-button" id="action-download">
         下载
          </a>
        </ytm-menu-item>
      </div>
      <c3-overlay>
        <button class="hidden-button" aria-label="close">
        </button>
      </c3-overlay>
    </div>
            `;document.body.appendChild(t);const i=n.attachShadow({mode:"open"});i.appendChild(t.content.cloneNode(!0));this.root=i;document.body.appendChild(n);this.initialize()}initialize(){const n=this.root.querySelector(".menu-container");n.style.display="none";this.root.querySelector("c3-overlay").addEventListener("click",()=>{n.style.display="none"});this.menuContainer=n;const t=this.root.querySelector("#action-copy");t.addEventListener("click",()=>{const t=this.element.getAttribute("data-href");n.style.display="none";this.callback&&this.callback(1,t)});const i=this.root.querySelector("#action-delete");i.addEventListener("click",()=>{const t=this.element.getAttribute("data-id");n.style.display="none";this.callback&&this.callback(2,t)});const r=this.root.querySelector("#action-download");r.addEventListener("click",()=>{const t=this.element.getAttribute("data-href");n.style.display="none";this.callback&&this.callback(3,t)})}hide(){}show(n){this.menuContainer.removeAttribute("style");this.element=n}}window.menu=new n}();let isMobile=!1;const mobile=new URL(window.location).searchParams.get("platform");mobile==="mobile"&&(isMobile=!0);let baseUri;isMobile||fetch("/api/video/ck").then(n=>n.text()).then(n=>{baseUri=n});window.menu.attach(document.querySelector(".menu"));window.menu.eventHandler=(n,t)=>{n===1?t.startsWith("http://")||t.startsWith("https://")?writeText(t):writeText(baseUri+t):n===2?fetch(`/api/video?id=${t}`,{method:"DELETE"}):n===3&&(t.startsWith("http://")||t.startsWith("https://")?window.JInterface.download(t):window.JInterface.download(baseUri+t))};const container=document.querySelector(".container"),spinner=document.querySelector(".spinner");window.spinner.inject(spinner);const toast=document.querySelector("custom-toast");let keyword,factor=0,stopped=!1,order=2,region=0,loading=!1;const observer=new IntersectionObserver(async n=>{if(n[0].isIntersecting&&!loading){if(stopped)return;try{loading=!0;await loadVideos(keyword,factor);factor++}catch(t){stop()}loading=!1}});observer.observe(spinner);let keywords;if(window.localStorage){const n=window.localStorage.getItem("keywords");keywords=n?JSON.parse(n):[];keywords.length>8&&(keywords=keywords.slice(0,8));window.header.appendKeywords(keywords)}window.header.placeholder="搜索";window.header.submit=async n=>{window.header.hide(),spinner.removeAttribute("style"),keyword=n,factor=0,stopped=!1,container.innerHTML="",keyword&&keywords&&(keywords.length>8&&keywords.pop(),keywords.unshift(n),keywords=[...new Set(keywords)],window.localStorage.setItem("keywords",JSON.stringify(keywords)),window.header.appendKeywords(keywords))};window.filter.callback=async n=>{factor=0,stopped=!1,order=n,container.innerHTML=""};window.filter.regionCallback=async()=>{factor=0,stopped=!1,region=3,container.innerHTML="",await tryUpdateVideos()}