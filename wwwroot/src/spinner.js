(function () {
    class Spinner {

        constructor() {

        }

        inject(container) {
            const template = document.createElement('template');
            template.innerHTML = `
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
    `;
            document.body.appendChild(template);

            const root = container.attachShadow({mode: 'open'});
            root.appendChild(template.content.cloneNode(true));
            // this.root = root;
            document.body.appendChild(container);
        }
    }

    window.spinner = new Spinner();
})();
