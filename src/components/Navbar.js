class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <nav class = "navbar">
                <button ref="today"        class="navbar-button">${locale.navbar.today_button}</button>
                <button ref="catalogue"    class="navbar-button">${locale.navbar.catalogue_button}</button>
                <button ref="compose-dish" class="navbar-button">${locale.navbar.compose_dish_button}</button>
                <button ref="history"      class="navbar-button">${locale.navbar.history_button}</button>
                <button ref="options"      class="navbar-button">${locale.navbar.options_button}</button>

                <style>
                    .navbar {
                        justify-content: center;
                        text-align: center;
                        width: 100%;
                        height: 3rem;
                        vertical-align: middle;
                        margin: 0px;
                        font-size: 0px;
                    }
                    
                    .navbar-button {
                        border-left: var(--orange) 3px solid;
                        border-right: var(--orange) 3px solid;
                        border-bottom: black 0px solid;
                        border-top: black 0px solid;
                        background: white;
                        display: inline-block;
                        width: 15%;
                        min-width:8rem;
                        height: 80%;
                        position: relative;
                        top: 10%;
                        padding: 0px;
                        margin: 0px;
                        font-size: 20px;
                        font-family: "Times New Roman";
                        transition: background-color 1s, color 0.5s;
                    }
                    
                    .navbar-button.active {
                        background-color: var(--orange-muted);
                        color: white;
                    }
                    
                    .navbar-button:hover {
                        background-color: var(--orange-muted);
                        color: white;
                    }
                </style>
            </nav>
        `;

        Array.from(this.shadowRoot.querySelectorAll(".navbar-button")).map((element) => {
            element.addEventListener("click", (event) => {
                this.changePage(event);
            });
        });
    }

    changePage(event) {
        this.shadowRoot.querySelector(".navbar-button.active")?.classList.remove("active");
        event.target.classList.add("active");


        this.dispatchEvent(new CustomEvent("page_change", {
            bubbles: true,
            detail: {
                "page_name": event.target.getAttribute("ref")
            }
        }));
    }
};

module.exports = Navbar;