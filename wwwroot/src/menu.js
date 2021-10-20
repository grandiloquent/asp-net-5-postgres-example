(function () {
    class Menu {
        set eventHandler(value) {
            this.callback = value;
        }

        constructor() {
        }

        attach(container) {
            const template = document.createElement('template');
            template.innerHTML = `
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
        </ytm-menu-item>
      </div>
      <c3-overlay>
        <button class="hidden-button" aria-label="close">
        </button>
      </c3-overlay>
    </div>
            `;
            document.body.appendChild(template);
            const root = container.attachShadow({mode: 'open'});
            root.appendChild(template.content.cloneNode(true));
            this.root = root;
            document.body.appendChild(container);
            this.initialize();
        }

        initialize() {
            const menuContainer = this.root.querySelector('.menu-container');
            menuContainer.style.display = 'none';
            this.root.querySelector('c3-overlay')
                .addEventListener('click', ev => {
                    menuContainer.style.display = 'none';
                });
            this.menuContainer = menuContainer;
            const copyItemButton = this.root.querySelector('#action-copy');
            copyItemButton
                .addEventListener('click', ev => {
                    const href = this.element.getAttribute('data-href');
                    menuContainer.style.display = 'none';
                    if (this.callback)
                        this.callback(1, href);
                });
            const deleteItemButton = this.root.querySelector('#action-delete');
            deleteItemButton
                .addEventListener('click', ev => {
                    const id = this.element.getAttribute('data-id');
                    menuContainer.style.display = 'none';
                    if (this.callback)
                        this.callback(2, id);
                });
        }

        hide() {

        }

        show(element) {
            this.menuContainer.removeAttribute('style');
            this.element = element;
        }
    }

    window.menu = new Menu();
})();
