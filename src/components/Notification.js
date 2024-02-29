/**
 * @class Notification
 */
class Notification extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                #notification-container {
                    min-height: 1.9em;
                    width: 100%;
                    text-align: center;
                    font-weight: bold;
                    font-size: 28px;
                    padding-top: 0.5rem;
                }
                
                #notification {
                    padding-top: 0.2em;
                    padding-bottom: 0.2em;
                    background-color: transparent;
                    color: white;
                    border-radius: 0.7rem;
                    margin:0px;
                    transition: opacity 1s linear;
                }
                #notification.success {
                    background-color: var(--green-dark);
                }
                #notification.warning {
                    background-color: var(--orange);
                }
                #notification.error {
                    background-color: var(--red);
                }
            </style>
            <div id="notification-container">
                <p id="notification" style='opacity:1'></p>
            </div>
        `;

        this.message = this.shadowRoot.querySelector("#notification")
    }

    showNotification({message = '', level = 'success', autohide = true}) {
        this.message.innerHTML = message;
        this.message.classList.add(level);

        if (autohide) {
            setTimeout(this.fadeOut.bind(this), 5000)
        }
    }

    fadeOut() {
        this.message.style.opacity = 0;

        setTimeout(() => {
            this.message.innerHTML = "";
            this.message.removeAttribute("class");
            this.message.style.opacity = 1;
        }, 1000)
    }
}

module.exports = Notification;