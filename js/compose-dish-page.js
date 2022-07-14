// FUNCTIONS
const renderDishTable = function() {
	var dishes = nuts.cookbook;
	
	var dishes_rows = [];
	if (Object.keys(dishes).length > 0) {
		
		var id = 0
		
		for (let dish of dishes) {
			let edit_id = id + 1
			let row = "<tr><td id = '"+ id + "'>" + dish +
			"</td><td class = 'dish-edit' id = '" + edit_id + "'></td></tr>"
		
			dishes_rows.push(row)
			id += 10
		};
	};

	
	var dishes_table = `<table>
							<tr><th>Nazwa</th><th></th></tr>` +
							dishes_rows.join('') +
						`</table>`
	$("#dish-table").html(dishes_table);
};

const renderEditTable = function() {
	var ingredients_rows = [];
	
	if (edited_dish != null) {
		// add existing ingredients
	};
	
	var edit_dish_table = `<table><tr><th>Składnik</th><th>Ilość</th><th>Kalorie</th><th></th></tr></table>`
	$("#dish-edit").html(edit_dish_table);
	
};

// render containers table
const renderContainers = function() {
	// get item names for the picklist
	const selectElement = document.getElementById("save-dish-container");
	$("#save-dish-container").empty();

	var containers = nuts.containers
	selectElement.add(new Option(""));
	for (let con in containers) {
		selectElement.add(new Option(con));
	};
	
	// generate containers table
	var containers_rows = [];
	var id = 0
	for (let con in containers) {
		let delete_id = id + 1
		let row = "<tr><td id = 'delete-" + id + "'>" + con +
		"</td><td>" + nuts.containers[con] + 
		"</td><td class = 'delete-field containers-delete' id = 'delete-" + delete_id + "'></td></tr>"
		
		containers_rows.push(row)
		id += 10
	};
	var containers_table = "<table><tr><th>Nazwa</th><th>Waga [g]</th><th></th></tr>" +
							containers_rows.join('') + "</table>"
	$("#containers-table").html(containers_table);
};

// delete containers
const deleteContainers = function(event) {
	let id_string = event.target.id.split("-");
	let id_to_delete = Number(id_string[1]) - 1;
	let name_to_delete = $("#delete-" + id_to_delete).html();
	dbmgr.execContainer(name_to_delete, null, "delete");
	
	renderContainers();
};

// STARTUP
var edited_dish = null;

// get item names for the picklist
const item_picklist = document.getElementById("dishes-add-name");
var items = dbmgr.getAvailableItems();
item_picklist.add(new Option(""));
for (let item of items) {
	item_picklist.add(new Option(item));
};

const cat_picklist = document.getElementById("dishes-category-filter");
cat_picklist.add(new Option(""));
for (let cat of nuts.categories) {
	cat_picklist.add(new Option(cat));
};

renderDishTable();
renderContainers();

// EVENTS
$(document).on("click", ".edit-dish", function(event) {
	$("#dish-table-container").fadeOut();
	$("#dish-edit-container").delay(500).css('display', 'inline-block').hide().fadeIn();;
	
	if (event.target.id != "add-new-dish") {
		// change edited dish
	};
	
	renderEditTable();
});

// save dish
$(document).on("click", "#save-dish", function(event) {
	$("#dish-edit-container").fadeOut();
	$("#dish-table-container").delay(500).css('display', 'inline-block').hide().fadeIn();
	
	edited_dish = null;
});

// filter items by category
$(document).on("change", "#dishes-category-filter", function() {
	let filtered = []
	for (item in nuts.catalogue) {
		if ($("#dishes-category-filter").val() == "" || nuts.catalogue[item].category == $("#dishes-category-filter").val()) {
			filtered.push(item);
		};
	};
	
	$("#dishes-add-name").empty();
	
	item_picklist.add(new Option(""))
	for (item of filtered) {
		item_picklist.add(new Option(item))
	};
});

// add new container
$(document).on("click", "#containers-add-button", function() {
	dbmgr.execContainer($("#containers-add-name").val(), $("#containers-add-weight").val(), "add");
	renderContainers();
});

// delete container
$(document).on("click", ".containers-delete", function(event) {
	deleteContainers(event);
});