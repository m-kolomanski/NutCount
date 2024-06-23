class App {
    constructor() {
        onload = () => {
             // set theme //
            document.documentElement.setAttribute('theme', dbmgr.getConfig('theme'));

            // fetch page elements //
            this.page_container = document.querySelector("#page-container");
            this.top_notification = document.querySelector("top-notification");

            // setup events //
            this.setupEvents();

            // set page to today //
            document.querySelector("top-navbar").shadowRoot.querySelector("button[ref='today']").click();
        }
    }


    setupEvents() {
        // change page //
        document.addEventListener("page_change", (event) => {
            this.changePage(event.detail.page_name);
        });
    }

    async changePage(page_name) {
        Log.info(`Changing page to ${page_name}`);

        // load html file //
        const html = await fetch(path.join(srcDirname, `/pages/${page_name}.html`));
        this.page_container.innerHTML = await html.text();

        // load and run page script //
        const script = await fetch(path.join(srcDirname, `/pages/${page_name}.js`));
        const pageScript = new Function(await script.text());
        pageScript();
    }

    showNotification(message = '', level = "success", autohide = true) {
        console.log(this.top_notification)
        this.top_notification.showNotification({
            message: message,
            level: level,
            autohide: autohide
        });
    }
}

module.exports = App;