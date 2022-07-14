// render food catalogue
const renderCatalogue = function() {
	let rows = []
	let row_id = 0
	
	for (item in nuts.catalogue) {
		let name_id = row_id + 1
		let category_id = row_id + 2
		let calories_id = row_id + 3
		let delete_id = row_id + 4
		
		let row = "<tr id = '" + row_id + "'><td id = '" + name_id + "'>" + item +
		"</td><td id = '" + category_id + "'>" + nuts.catalogue[item].category +
		"</td><td id = '" + calories_id + "'>" + nuts.catalogue[item].calories +
		"</td><td>" + nuts.catalogue[item].unit + "</td><td id = '" + delete_id +
			"' class = 'delete-field catalogue-delete'></td></tr>"
		rows.push(row)
		row_id += 1
	}

	let table = `<table>
					<tr><th>Nazwa</th><th>Kategoria</th><th>Kalorie/j</th><th>Jednostki</th></tr>` +
					rows.join('') +
				`</table>`
		
	document.getElementById("food-catalogue").innerHTML = table
}

// delete entry completely
const deleteCatalogueEntry = function(event) {
	let id_to_delete = event.target.id - 3;
	let name_to_delete = $("#" + id_to_delete).html();
	
	dbmgr.deleteItem(name_to_delete, "catalogue");
	
	renderCatalogue();
};

// render categories table
const renderCategories = function() {
	// get item names for the picklist
	const selectElement = document.getElementById("category");
	$("#category").empty();

	var items = nuts.categories;
	selectElement.add(new Option(""));
	for (let item of items) {
		selectElement.add(new Option(item));
	};
	// generate categories table
	var categories_rows = [];
	var id = 0
	for (let item of items) {
		let delete_id = id + 1
		let row = "<tr><td id = 'delete-" + id + "'>" + item +
		"</td><td class = 'delete-field categories-delete' id = 'delete-" + delete_id + "'></td></tr>"
		
		categories_rows.push(row)
		id += 10
	};
	var categories_table = "<table>" + categories_rows.join('') + "</table>"
	$("#categories-table").html(categories_table);
};

// delete categories
const deleteCategory = function(event) {
	let id_string = event.target.id.split("-");
	let id_to_delete = Number(id_string[1]) - 1;
	let name_to_delete = $("#delete-" + id_to_delete).html();
	console.log(name_to_delete);
	dbmgr.execCategory(name_to_delete, "delete");
	
	renderCategories();
	renderCatalogue();
};

// on page load
renderCatalogue();
renderCategories();

// prepare events
// add new item to catalogue
document.getElementById("add-things").onclick = function() {
	dbmgr.addNewItem();
	renderCatalogue();
}
// delete catalogue entry
$(document).on("click", ".catalogue-delete", function(event) {
	deleteCatalogueEntry(event);
});

// add category
$(document).on("click", "#categories-add-button", function() {
	dbmgr.execCategory($("#categories-add").val(), "add");
	renderCategories();
});

// delete category
$(document).on("click", ".categories-delete", function(event) {
	deleteCategory(event);
});