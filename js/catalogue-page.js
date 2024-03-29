// render food catalogue
const renderCatalogue = function() {
	const catalogue = filterCatalogueByName(filterCatalogueByCategory(nuts.catalogue));

	const table = document.createElement("table");
	
	var ordered_catalogue = Object.keys(catalogue).sort().reduce(
		(obj, key) => {
			obj[key] = nuts.catalogue[key];
			return obj;
		},
		{}
	);
	
	// render table head
	const thead = document.createElement("thead");
	const head_row = document.createElement("tr");
	
	for (let header of ["Nazwa", "Kategoria", "Kcal/j", "Jednostka", ""]) {
		const header_cell = document.createElement("th");
		header_cell.appendChild(document.createTextNode(header));
		head_row.appendChild(header_cell);
	};
	
	thead.appendChild(head_row);
	
	table.appendChild(thead);
	
	// render table body
	const tbody = document.createElement("tbody");
	let row_id = 0
	for (item in ordered_catalogue) {
		const item_row = document.createElement("tr");
		item_row.setAttribute("id", row_id);
		
		const name_cell = document.createElement("td");
		name_cell.appendChild(document.createTextNode(item));
		item_row.appendChild(name_cell);
		
		for (let column in nuts.catalogue[item]) {
			const cell = document.createElement("td");
			if (column == "category") {
				cell.appendChild(document.createTextNode(nuts.catalogue[item][column].join(", ")));
			} else {
				cell.appendChild(document.createTextNode(nuts.catalogue[item][column]));
			}
			
			item_row.appendChild(cell);
		};
		
		const delete_cell = document.createElement("td");
		delete_cell.classList.add("delete-field");
		delete_cell.classList.add("catalogue");
		
		item_row.appendChild(delete_cell);
		
		tbody.appendChild(item_row);
		
		row_id += 1
	}

	table.appendChild(tbody);
	
	$("#food-catalogue").html(table);
};

// filter catalogue by name
const filterCatalogueByName = function(catalogue) {
	var filtered_catalogue = {};
	for (let item of Object.keys(catalogue)) {
		if (item.toLowerCase().includes($("#name").val().toLowerCase())) {
			filtered_catalogue[item] = catalogue
		}
	}
	return filtered_catalogue;
};

// filter catalogue by category
const filterCatalogueByCategory = function(catalogue) {
	var selected_categories_cells = $(".category-cell-active");
	if (selected_categories_cells.length === 0) {
		return catalogue;
	} else {
		var selected_categories = []
		
		for (let cell of selected_categories_cells) {
			selected_categories.push(cell.innerHTML);
		}
		
		selected_categories[selected_categories.indexOf("Bez kategorii")] = ""
		
		var filtered_catalogue = {};
		for (let item in catalogue) {
			if (catalogue[item]["category"].filter(x => selected_categories.includes(x)).length != 0) {
				filtered_catalogue[item] = catalogue[item];
			}
		}
		
		return filtered_catalogue;
	}
};

// render categories table
const renderCategories = function() {
	var categories = nuts.categories;
	
	const categories_table = document.createElement("table");
	var id = 0

	const thead = document.createElement("thead");
	const trow = document.createElement("tr");
	const tcell = document.createElement("th");
	tcell.appendChild(document.createTextNode("Kategorie"));
	trow.appendChild(tcell); trow.appendChild(document.createElement("th"));
	thead.appendChild(trow); categories_table.appendChild(thead);

	const tbody = document.createElement("tbody");
	for (let category of [...categories, "Bez kategorii"]) {		
		// generate table
		const cat_row = document.createElement("tr");
		cat_row.setAttribute("id", `Cat${id}`);
		
		const cat_cell = document.createElement("td");
		cat_cell.appendChild(document.createTextNode(category));
		cat_cell.classList.add("category-cell");
		cat_cell.setAttribute("id", `${category.replace(" ", "_")}`);
		cat_row.appendChild(cat_cell);
		const delete_cell = document.createElement("td");
		delete_cell.classList.add("delete-field");
		delete_cell.classList.add("categories");
		delete_cell.setAttribute("id", `Del${id}`);
		cat_row.appendChild(delete_cell);
		
		tbody.appendChild(cat_row);
		
		id += 1;
	};
	categories_table.appendChild(tbody);
	$("#categories-table").html(categories_table);
};

// delete categories
const deleteCategory = function(event) {
	let id_string = event.target.id.split("-");
	let id_to_delete = Number(id_string[1]) - 1;
	let name_to_delete = $("#delete-" + id_to_delete).html();
	dbmgr.execCategory(name_to_delete, "delete");
	
	renderCategories();
	renderCatalogue();
};

//// PAGE LOAD ////
renderCatalogue();
renderCategories();

//// EVENTS ////

// add new item to catalogue
document.getElementById("add-things").onclick = function() {
	if ($("#name").val() in nuts.catalogue) {
		var overwrite_alert = true;
	} else {
		var overwrite_alert = false;
	};
	
	dbmgr.addNewItem();
	renderCatalogue();
	
	if (overwrite_alert) {
		$("#notification-container")
			.empty()
			.append("<p id='notification'>Produkt został nadpisany.</p>");
	} else {
		$("#notification-container")
			.empty()
			.append("<p id='notification'>Produkt został dodany.</p>");
	}
	
	$("#notification")
		.delay(3000)
		.fadeOut();
	
	$("#name").val("");
	$("#calories").val("");
}
// delete catalogue entry
$(document).on("click", ".delete-field.catalogue", function(event) {
	let name_to_delete = event.target.parentElement.childNodes[0].innerHTML;
	dbmgr.deleteItem(name_to_delete, "catalogue");
	
	renderCatalogue();
});
// check if item in catalogue
$("#name").on("input", function(event) {
	let item_to_search = event.target.value;
	if (Object.keys(nuts.catalogue).includes(item_to_search)) {
		$("#notification-container")
			.empty()
			.append("<p id='notification' style='background-color:#f88d35'>Produkt jest już na liście. Czy chcesz go nadpisać?</p>")
	} else {
		$("#notification")
			.fadeOut();
	}

	renderCatalogue();
});

// add category
$(document).on("click", "#categories-add-button", function() {
	dbmgr.execCategory($("#categories-add").val().trim(), "add");
	renderCategories();
});

// delete category
$(document).on("click", ".delete-field.categories", function(event) {
	$(`#${event.target.id}`).removeClass('delete-field').addClass('delete-field-confirm')
});
$(document).on("click", ".delete-field-confirm.categories", function(event) {
	let name_to_delete = event.target.parentElement.childNodes[0].innerHTML;
	
	dbmgr.execCategory(name_to_delete, "delete");
	renderCategories();
	renderCatalogue();
});

// select category
$(document).on("click", ".category-cell", function(event) {
	$(`#${event.target.id}`).removeClass("category-cell").addClass("category-cell-active");
	renderCatalogue();
});
// deselect category
$(document).on("click", ".category-cell-active", function(event) {
	$(`#${event.target.id}`).removeClass("category-cell-active").addClass("category-cell");
	renderCatalogue();
});

