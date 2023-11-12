class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class = "navbar">
            <button onclick="location.href='today.html'"        class="navbar-button">${locale.navbar.today_button}</button>
            <button onclick="location.href='catalogue.html'"    class="navbar-button">${locale.navbar.catalogue_button}</button>
            <button onclick="location.href='compose-dish.html'" class="navbar-button">${locale.navbar.compose_dish_button}</button>
            <button onclick="location.href='history.html'"      class="navbar-button">${locale.navbar.history_button}</button>
            <button onclick="location.href='options.html'"      class="navbar-button">${locale.navbar.options_button}</button>

            <script>
                let path = window.location.href.split("/")
                let current_page = path[path.length - 1].split(".")[0]
                document.getElementById(current_page + "-button").classList.add("navbar-button-active");
            </script>

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
                
                .navbar-button.navbar-button-active {
                    background-color: var(--orange-muted);
                    color: white;
                }
                
                .navbar-button:hover {
                    background-color: var(--orange-muted);
                    color: white;
                }
            </style>
        </div>
        `;
    }
}

module.exports = Navbar;