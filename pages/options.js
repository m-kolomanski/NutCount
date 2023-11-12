(function() {
    // initialize page //
    // fetch locale content //
    const locale = window.locale.options;
    Object.keys(locale).map((element_id) => {
        console.log(element_id)
        console.log(document.getElementById(element_id));
        document.getElementById(element_id).innerHTML = locale[element_id];
    });

    // set theme //
    document.documentElement.setAttribute('theme', dbmgr.getConfig('theme'));

    // set option picklists to current value //
    document.querySelector([`option[value="${dbmgr.getConfig('lang')}"]`]).selected = true;
    document.querySelector([`option[value="${dbmgr.getConfig('theme')}"]`]).selected = true;

    const version = require(path.join(__dirname, "../package.json"))['version'];
    document.getElementById("version").innerHTML = version;

    /* TODO: implement update checking
    $("#check-for-update").on('click', () => {
      $.ajax({
        url: "https://api.github.com/repos/m-kolomanski/NutCount/releases/latest",
        type: "GET",
        success: (data) => {
          const latest_version = data['tag_name'].slice(-6);
          if (latest_version > version.slice(-6)) {
            var download_link;
            $("#version-notification").html("Nowa wersja jest dostępna!").css("color","blue");
            for (var asset in data['assets']) {
              if (data['assets'][asset]['content_type'] == "application/x-gzip") {
                download_link = data['assets'][asset]['browser_download_url'];
              }
            }
            $("#check-for-update").html("Pobierz nową wersję!").off().on("click", (e, link = download_link) => {
              window.location = link;
              //ipcRenderer.invoke("quitApp");
            });
          } else {
            $("#version-notification").html("Brak nowych aktualizacji.").css("color","green");
          }
        },
        error: () => {
          $("#version-notification").html("Brak dostępu do repozytorium, sprawdź połączenie z internetem lub spróbuj ponownie później.").css("color", "red");
        }
      })
    })*/

    /**
     * @event selectLanguage
     * @description Changes the language of the application.
     */
    document.getElementById("language-selection").addEventListener("change", (event) => {
        dbmgr.setConfig('lang', event.target.value);
        location.reload();
    });
    /**
     * @event selectTheme
     * @description Changes the theme of the application.
     */
    document.getElementById('theme-selection').addEventListener("change", (event) => {
        dbmgr.setConfig('theme', event.target.value);
        location.reload();
    });
})();