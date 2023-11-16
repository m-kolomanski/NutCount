(function() {
    // fetch locale content //
    const locale = window.locale.catalogue;
    Object.keys(locale).map((element_id) => {
        const element = document.getElementById(element_id);
        switch (element.nodeName) {
            case "INPUT":
                element.placeholder = locale[element_id]; break;
            default:
                element.innerHTML = locale[element_id]; break;
        }
    });

    // set theme //
    document.documentElement.setAttribute('theme', dbmgr.getConfig('theme'));

    // generate datatable //
    const catalogue_datatable = new Datatable({
        table_id: "catalogue-datatable",
        container_id: "catalogue-table-container",
        data: dbmgr.getCatalogue(),
        id_var: "item_id",
        colnames: window.locale.colnames
    });

    const categories_datatable = new Datatable({
        table_id: "categories-datatable",
        container_id: "categories-table-container",
        data: dbmgr.getCategories(),
        id_var: "category_id",
        colnames: window.locale.colnames
    });

    // setup events //
    /**
     * @event addCatalogueItem
     * @description Adds an item to the catalogue.
     */
    document.getElementById("add-item").addEventListener("click", (event) => {
        const item_name = document.getElementById("name");
        const item_kcal = document.getElementById("calories");
        const item_unit = document.getElementById("unit");

        // TODO: Add handlling categories

        if (dbmgr.getCatalogue(["name"])
                .map((item) => { return item.name })
                .includes(item_name.value)) { // TODO: Implement overwriting
            alert("Item already exists in catalogue!");
            return;
        } else {
            dbmgr.addItemToCatalogue(item_name.value, item_kcal.value, item_unit.value, "");
            catalogue_datatable.updateData(dbmgr.getCatalogue());
        }

        item_name.value = ""; item_kcal.value = "";

    });
    /**
     * @event addCategory
     * @description Adds a category to the categories table.
     */
    document.getElementById("add-category").addEventListener("click", (event) => {
        const category_name = document.getElementById("new-category");

        if (dbmgr.getCategories(["name"])
                .map((category) => { return category.name })
                .includes(category_name.value)) {
            alert("Category already exists!");
            return;
        } else {
            dbmgr.addCategory(category_name.value);
            categories_datatable.updateData(dbmgr.getCategories());
        }

        category_name.value = "";
    });
        

})();