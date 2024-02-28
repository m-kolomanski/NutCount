class PopupModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute("title");
        this.innerHTML = `
            <style>
                .popup-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background: rgba(0,0,0,.5);
                    z-index: 10;
                }
                .popup-modal {
                    position: absolute;
                    top: 25%;
                    left: 25%;
                    width: 50%;
                    height: fit-content;
                    background-color: white;
                    border-radius: 1em;
                    z-index: 11;
                }
                .popup-modal-header {
                    width: 100%;
                    height: 2em;
                    text-align: center;
                    background: var(--orange);
                    color: white;
                    padding: .5em 0 0 0;
                    font-weight: bold;
                    font-size: 200%;
                    border-top-left-radius: .9rem;
                    border-top-right-radius: 0.9rem;
                }
                .popup-modal-body {
                    padding: 2em;
                }
            </style>
            <div class="popup-backdrop">
                <div class='popup-modal'>
                    ${ title ? 
                        `<div class="popup-modal-header">${title}</div>` :
                        ""
                    }
                    <div class="popup-modal-body">
                        ${this.innerHTML}
                    </div>
                </div>
            </div>
        `;

        if (this.getAttribute("easy-close")) {
            this.querySelector(".popup-backdrop").addEventListener("click", (event) => {
                if (event.target.className !== "popup-backdrop") return;
                this.remove();
            })
        }

    }
}

module.exports = PopupModal;