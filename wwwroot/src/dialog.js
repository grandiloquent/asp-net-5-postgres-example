(function () {
    class Dialog {
        constructor() {
            this.initializeTemplate();
        }

        initializeTemplate() {
            const template = document.createElement('template');
            template.innerHTML = `
<style>
.dialog-container{
 margin: 0 40px;
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    z-index: 3;

}
.c3-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    cursor: pointer;
    background-color: rgba(0,0,0,0.8);
}
.hidden-button{
    position: fixed;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    cursor: pointer;
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    text-transform: inherit;
    color: inherit;
    background: transparent;

}
.dialog{
    min-width: 250px;
    max-width: 356px;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    z-index: 2;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    max-height: 100%;
    box-sizing: border-box;
    padding: 16px;
    margin: 0 auto;
    font-size: 1.3rem;
    color: #030303;
    background-color: #f9f9f9;
    border: none;

}
.dialog-header{
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    display: flex;

}
.dialog-body{
    overflow-x: hidden;
    overflow-y: auto;
    white-space: pre-wrap;

}
.secondary-text{
    line-height: 1.6rem;
    color: #606060;
    margin: 8px 0;

}
.dialog-buttons{
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    margin-top: 12px;
    -webkit-flex-shrink: 0;
    flex-shrink: 0;

}
.c3-material-button{
    margin: -0.7em -0.57em;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-user-select: none;
    min-width: 5.14em;
    font-size: 1.4rem;
    text-transform: uppercase;
    -webkit-border-radius: 3px;
    border-radius: 3px;

}
.c3-material-button-button{
    padding: .7em .57em;
    cursor: pointer;
    border: none;
    outline: none;
    font: inherit;
    text-transform: inherit;
    color: inherit;
    background: transparent;

}
.cbox, .center, .vbox {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
</style>

    <div class="dialog-container">
      <div class="dialog">
        <div class="dialog-header">
        </div>
        <div class="dialog-body"><p class="secondary-text">要对此评论执行操作，请先登录。</p></div>
        <div class="dialog-buttons">
          <div class="c3-material-button">
            <button class="c3-material-button-button">
              <div class="cbox">
                取消
              </div>
            </button>
          </div>
          <div class="c3-material-button" style="color: #cc0000;margin-left: .7em;">
            <button class="c3-material-button-button">
              <div class="cbox">
                确定
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="c3-overlay">
        <button class="hidden-button">
        </button>
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

    window.dialog = new Dialog();
})();