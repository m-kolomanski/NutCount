// render food catalogue
const renderCatalogue = function() {
	const table = document.createElement("table");
	
	var ordered_catalogue = Object.keys(nuts.catalogue).sort().reduce(
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
			cell.appendChild(document.createTextNode(nuts.catalogue[item][column]));
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

// render categories table
const renderCategories = function() {
	// for pick-list
	$("#category").empty();
	const selectElement = document.getElementById("category");
	var categories = nuts.categories;
	selectElement.add(new Option(""));
	
	// for table
	const categories_table = document.createElement("table");
	var id = 0
	
	for (let category of categories) {
		// add to pick-list
		selectElement.add(new Option(category));
		
		// generate table
		const cat_row = document.createElement("tr");
		cat_row.setAttribute("id", `Cat${id}`);
		
		const cat_cell = document.createElement("td");
		cat_cell.appendChild(document.createTextNode(category));
		cat_row.appendChild(cat_cell);
		const delete_cell = document.createElement("td");
		delete_cell.classList.add("delete-field");
		delete_cell.classList.add("categories");
		cat_row.appendChild(delete_cell);
		
		categories_table.appendChild(cat_row);
	};
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
		$("#notification-container").empty().css("background-color","orange").show().append("Produkt został nadpisany").delay(3000).fadeOut();
	} else {
		$("#notification-container").empty().css("background-color","green").show().append("Produkt został dodany").delay(3000).fadeOut();
	};
	
	$("#name").val("");
	$("#category").val("");
	$("#calories").val("");
}
// delete catalogue entry
$(".delete-field.catalogue").on("click", function(event) {
	let name_to_delete = event.target.parentElement.childNodes[0].innerHTML;
	dbmgr.deleteItem(name_to_delete, "catalogue");
	renderCatalogue();
});
// check if item in catalogue
$("#name").on("input", function(event) {
	let item_to_search = event.target.value;
	if (Object.keys(nuts.catalogue).includes(item_to_search)) {
		$("#notification-container").empty().css("background-color","yellow").show().append("Produkt jest już na liście. Czy chcesz go nadpisać?");
	} else {
		$("#notification-container").fadeOut().empty();
	};
});

// add category
$(document).on("click", "#categories-add-button", function() {
	dbmgr.execCategory($("#categories-add").val(), "add");
	renderCategories();
});

// delete category
$(".delete-field.categories").on("click", function(event) {
	let name_to_delete = event.target.parentElement.childNodes[0].innerHTML;
	dbmgr.execCategory(name_to_delete, "delete");
	renderCategories();
	renderCatalogue();
});