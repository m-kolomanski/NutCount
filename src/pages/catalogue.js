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
        action_name: "edit-category",
        row_selection: "select-category"
    });

    const filterCatalogue = function() {
        const filtered_string = document.getElementById("name").value;
        const active_categories = Array.from(document.querySelectorAll("#categories-datatable td.active")).map((element) => {
            return element.parentElement.getAttribute("item_id");
        });

        catalogue_datatable.updateData(dbmgr.getCatalogue({
            filter_name: filtered_string,
            filter_category: active_categories
        }));

    }

    // setup events //

    // TEST
    document.getElementById("name").addEventListener("input", (event) => {
        filterCatalogue();
    });

    document.getElementById("catalogue-categories").addEventListener("select-category", (event) => {
        filterCatalogue();
    });

    /**
     * Adds an item to the catalogue.
     * @event addCatalogueItem
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
            window.app.showNotification(window.locale.notifications['item-exists'], "error");
            return;
        } else {
            dbmgr.addItemToCatalogue(item_name.value, item_kcal.value, item_unit.value, categories);
            active_categories.map((element) => { element.classList.remove("active-category") });
            catalogue_datatable.updateData(dbmgr.getCatalogue());
            window.app.showNotification(window.locale.notifications['item-added']);
        }

        item_name.value = ""; item_kcal.value = "";
    });

    /**
     * Shows popup window displaying editing widget for items 
     * @event editCatalogueItem
     */
    document.querySelector("#catalogue-table").addEventListener("edit-catalogue-item", (event) => {
        // get edited item data //
        const item_id = event.detail.row_id;
        Log.info(`Category editing initialized for ${item_id}`);
        const item_data = dbmgr.getCatalogueItem(item_id);

        // show modal with editing information //
        const modal = document.createElement("popup-modal");
        modal.setAttribute("title", window.locale.general["editing-item"]);
        modal.innerHTML = `
            <div class="editing-item-body">
                <label for="edit-name">${window.locale.colnames["name"]}</label>
                <input type="text" id="edit-name" value="${item_data['name']}"></input>

                <label for="edit-calories">${window.locale.colnames["kcal_per_unit"]}</label>
                <input type="text" id="edit-calories" value="${item_data['kcal_per_unit']}"></input>

                <label for="edit-unit">${window.locale.colnames["unit"]}</label>
                <select id="edit-unit">
                    <option value="100g" ${item_data['unit'] === "100g" ? 'selected="selected"' : ''}>100g</option>
                    <option id="portion-label" value="portion" ${item_data['unit'] === "portion" ? 'selected="selected"' : ''}>${locale['portion-label']}</option>
                </select>
            </div>
            <div class="editing-item-footer"> 
                <button id="confirm">${window.locale.general.confirm}</button>
                <button id="cancel">${window.locale.general.cancel}</button>
                <button id="delete">${window.locale.general.delete}</button>
            </div>
        `;
        document.querySelector("body").appendChild(modal);
        // move modal to the left to fit categories table //
        modal.querySelector(".popup-modal").setAttribute('style', 'left:15%;');

        // bring categories table to front //
        document.querySelector("#categories-table-container").setAttribute("style", "position:relative;z-index:12;");

        // select active categories for this item //
        categories_datatable.selectRows(item_data['categories'].split(","));

        // add events to bo buttons //
        modal.querySelector("button#confirm").addEventListener("click", (event) => {
            Log.info(`Catalog item editing confirmed for ${item_id}`);

            const active_categories = Array.from(document.querySelectorAll("#categories-datatable td.active"));
            let categories = active_categories.map((element) => {
                return element.parentElement.getAttribute("item_id");
            })

            dbmgr.updateCatalogueItem(
                item_id,
                document.getElementById("edit-name").value,
                document.getElementById("edit-calories").value,
                document.getElementById("edit-unit").value,
                categories
            );
            modal.remove()
            catalogue_datatable.updateData(dbmgr.getCatalogue());
            categories_datatable.selectRows([]);
            document.querySelector("#categories-table-container").setAttribute("style", "");

            window.app.showNotification(window.locale.notifications['item-modified']);
        });
        modal.querySelector("button#cancel").addEventListener("click", (event) => {
            Log.info(`Catalog item editing canceled for ${item_id}`);
            modal.remove();
            categories_datatable.selectRows([]);
            document.querySelector("#categories-table-container").setAttribute("style", "");

        });
        modal.querySelector("button#delete").addEventListener("click", (event) => {
            Log.info(`Catalog item deleting initialized for ${item_id}`);

            dbmgr.removeItemFromCatalogue(item_id);
            modal.remove()
            catalogue_datatable.updateData(dbmgr.getCatalogue());
            categories_datatable.selectRows([]);
            document.querySelector("#categories-table-container").setAttribute("style", "");

            window.app.showNotification(window.locale.notifications['item-deleted']);
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
            window.app.showNotification(window.locale.notifications['item-exists'], "error");
            return;
        } else {
            dbmgr.addCategory(category_name.value);
            categories_datatable.updateData(dbmgr.getCategories());
        }

        category_name.value = "";
    });


    /**
     * Shows popup window displaying editing widget for items 
     * @event editCatalogueItem
     */
    document.querySelector("#catalogue-categories").addEventListener("edit-category", (event) => {
        // get edited item data //
        const cat_id = event.detail.row_id;
        const cat_name = dbmgr.getCategoryName(cat_id);
        Log.info(`Catalog item editing initialized for ${cat_id}`);
        
        // show modal with editing information //
        const modal = document.createElement("popup-modal");
        modal.setAttribute("title", window.locale.general["editing-item"]);
        modal.innerHTML = `
            <div class="editing-item-body">
               <label for="edit-category">${window.locale.colnames["name"]}</label>
               <input type="text" id="edit-category" value="${cat_name}"></input>
            </div>
            <div class="editing-item-footer"> 
                <button id="confirm">${window.locale.general.confirm}</button>
                <button id="cancel">${window.locale.general.cancel}</button>
                <button id="delete">${window.locale.general.delete}</button>
            </div>
        `;
        document.querySelector("body").appendChild(modal);

        // add events to buttons //
        modal.querySelector("button#confirm").addEventListener("click", (event) => {
           Log.info(`Category editing confirmed for ${cat_id}`);
           dbmgr.editCategoryName(cat_id, document.querySelector("#edit-category").value);
           modal.remove()
           categories_datatable.updateData(dbmgr.getCategories());
           catalogue_datatable.updateData(dbmgr.getCatalogue());
           window.app.showNotification(window.locale.notifications['item-modified']);
        });
        modal.querySelector("button#cancel").addEventListener("click", (event) => {
           Log.info(`Catalog item editing canceled for ${cat_id}`);
           modal.remove();
        });
        modal.querySelector("button#delete").addEventListener("click", (event) => {
           Log.info(`Catalog item deleting initialized for ${cat_id}`);
           dbmgr.removeCategory(cat_id);
           modal.remove()
           categories_datatable.updateData(dbmgr.getCategories());
           catalogue_datatable.updateData(dbmgr.getCatalogue());
           window.app.showNotification(window.locale.notifications['item-deleted']);
        });
        
    });
    
})();