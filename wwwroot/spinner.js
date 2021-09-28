class CustomSpinner extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    // Fires when an instance of the element is created or updated
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'open'
        });
        const style = document.createElement('style');
        style.textContent = CustomSpinner.getStyle();
        this.root.appendChild(style);
        const spinner = document.createElement('DIV');
        this.root.appendChild(spinner);
    }

    // Fires when an instance was inserted into the document
    connectedCallback() {}

    // Fires when an instance was removed from the document
    disconnectedCallback() {}

    // Fires when an attribute was added, removed, or updated
    attributeChangedCallback(attrName, oldVal, newVal) {}

    // Fires when an element is moved to a new document
    adoptedCallback() {}
    static getTemplate(value) {
        return `
        ${CustomSpinner.getStyle()}
        <div>
            ${value}
        </div>
        `;
    }
    static getStyle() {
        return `
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
        `;
    }
}
customElements.define('custom-spinner', CustomSpinner);
// <custom-spinner></custom-spinner>
// <script src="./components/spinner.js"></script>