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
   
    // generate datatables //
    const catalogue_datatable = document.createElement("data-table");
    catalogue_datatable.init({
        container_id: "catalogue-table-container",
        table_id: "catalogue-datatable",
        data: dbmgr.getCatalogue({mode: "concat_categories"}),
        id_var: "item_id",
        colnames: window.locale.colnames,
        action_name: "edit-catalogue-item"
    });

    const categories_datatable = document.createElement("data-table");
    categories_datatable.init({
        container_id: "categories-table-container",
        table_id: "categories-datatable",        
        data: dbmgr.getCategories(),
        id_var: "category_id",
        colnames: window.locale.colnames,
        action_name: "remove-category",
        row_selection: "select-category"
    });

    // setup events //
    /**
     * @event addCatalogueItem
     * @description Adds an item to the catalogue.
     */
    document.getElementById("add-item").addEventListener("click", (event) => {
        // get information about added item //
        const item_name = document.getElementById("name");
        const item_kcal = document.getElementById("calories");
        const item_unit = document.getElementById("unit");

        const active_categories = Array.from(document.querySelectorAll("#categories-datatable td.active"));
        let categories = active_categories.map((element) => {
            return element.parentElement.getAttribute("item_id");
        })

        if (dbmgr.getCatalogue({column: "name"})
                ?.map((item) => { return item.name })
                .includes(item_name.value)) { // TODO: Implement overwriting
            alert("Item already exists in catalogue!");
            return;
        } else {
            dbmgr.addItemToCatalogue(item_name.value, item_kcal.value, item_unit.value, categories);
            active_categories.map((element) => { element.classList.remove("active-category") });
            catalogue_datatable.updateData(dbmgr.getCatalogue());
        }

        item_name.value = ""; item_kcal.value = "";

    });

    /**
     * Shows popup window displaying editing widget for items 
     * @event editCatalogueItem
     */
    document.addEventListener("edit-catalogue-item", (event) => {
        const item_id = event.detail.row_id;
        Log.info(`Catalog item editing initialized for ${item_id}`);
        const item_data = dbmgr.getCatalogueItem(item_id);

        const modal = document.createElement("popup-modal");
        modal.setAttribute("title", window.locale.general["editing_item"]);
        modal.innerHTML = `
            <div class="editing-item-body">
                <label for="edit-name">${window.locale.colnames["name"]}</label>
                <input type="text" id="edit-name" value="${item_data['name']}"></input>

                <label for="edit-name">${window.locale.colnames["kcal_per_unit"]}</label>
                <input type="text" id="edit-calories" value="${item_data['kcal_per_unit']}"></input>

                <label for="edit-name">${window.locale.colnames["unit"]}</label>
                <input type="text" id="edit-unit" value="${item_data['unit']}"></input>

                <label for="edit-name">${window.locale.colnames["categories"]}</label>
                <input type="text" id="edit-categories" value="${item_data['categories']}"></input>
            </div>
            <div class="editing-item-footer">
                <button id="confirm">${window.locale.general.confirm}</button>
                <button id="cancel">${window.locale.general.cancel}</button>
                <button id="delete">${window.locale.general.delete}</button>
            </div>
        `;
        document.querySelector("body").appendChild(modal);
        modal.querySelector("button#confirm").addEventListener("click", (event) => {
            Log.info(`Catalog item editing confirmed for ${item_id}`);
        });
        modal.querySelector("button#cancel").addEventListener("click", (event) => {
            Log.info(`Catalog item editing canceled for ${item_id}`);
            modal.remove();
        });
        modal.querySelector("button#delete").addEventListener("click", (event) => {
            Log.info(`Catalog item deleting initialized for ${item_id}`);
        });
        
    });
    /**
     * Adds a category to the categories table.
     * @event addCategory
     */
    document.getElementById("add-category").addEventListener("click", (event) => {
        const category_name = document.getElementById("new-category");

        if (dbmgr.getCategories(["name"])
                ?.map((category) => { return category.name })
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