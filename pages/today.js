(function() {
    // fetch locale content //
    const locale = window.locale.today;
    Object.keys(locale).map((element_id) => {
        const element = document.getElementById(element_id);

        switch (element.nodeName) {
            case "INPUT":
                element.placeholder = locale[element_id]; break;
            default:
                element.innerHTML = locale[element_id]; break;
        }
    });


})();