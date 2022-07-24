// FUNCTIONS
// render dish table
function Portions(weight, kcal) {
	this.four_portions_weight = Math.round((weight / 4));
	this.six_portions_weight = Math.round((weight / 6));
	this.four_portions_kcal = Math.round(this.four_portions_weight * (kcal / 100));
	this.six_portions_kcal = Math.round(this.six_portions_weight * (kcal / 100));
};
const renderDishTable = function() {
	var dishes = nuts.cookbook;
	
	var dishes_rows = [];
	if (Object.keys(dishes).length > 0) {
		
		var id = 0
		
		for (let dish in dishes) {
			var portions_data = new Portions(dishes[dish]["weight"], dishes[dish]["calories"]);
			
			let edit_id = id + 1
			let row = "<tr><td id = '"+ id + "'>" + dish +
			"</td><td>" + portions_data["four_portions_weight"] + "g / " + portions_data["four_portions_kcal"] +
			"kcal</td><td>" + portions_data["six_portions_weight"] + "g / " + portions_data["six_portions_kcal"] +
			"kcal</td><td class = 'edit-field edit-dish' id = '" + edit_id + "'></td></tr>"
		
			dishes_rows.push(row)
			id += 10
		};
	};

	
	var dishes_table = `<table>
							<tr><th>Nazwa</th><th>4 porcje</th><th>6 porcji</th><th></th></tr>` +
							dishes_rows.join('') +
						`</table>`
	$("#dish-table").html(dishes_table);
};

// render edit table
const renderEditTable = function(name = null) {
	if (name != null) {
		let current_container = nuts.cookbook[name]["container"]
		$("#dish-name").val(name);
		$("#save-dish-container").val(current_container);
		
		switch (current_container) {
			case "":
				$("#save-dish-weight").val(nuts.cookbook[name]["weight"]);
				break;
			default:
				$("#save-dish-weight").val(nuts.cookbook[name]["weight"] + nuts.containers[current_container]);
				break;
		};
		
	};
	
	var ingredients_rows = [];

	if (edited_dish != null) {
		var id = 0

		for (item in edited_dish) {
			let amount_id = id + 1
			let delete_id = id + 2

			switch (nuts.catalogue[item]['unit']) {
				case "100g":
					var item_kcal = nuts.catalogue[item]['calories'] * (edited_dish[item] / 100);
					break;
				case "sztuka":
					var item_kcal = nuts.catalogue[item]['calories'] * edited_dish[item];
					break
			};
		
			let current_row = "<tr><td id = 'edit-" + id + "'>" + item +
								"</td><td class = 'ingredient-amount' id = 'amount-" +
								amount_id + "'>" +
								edited_dish[item] + "</td><td>" +
								Math.round(item_kcal) + "</td><td class = 'delete-field ingredient-delete' id = 'edit-" +
								 + delete_id + "'></td></tr>"
		
			ingredients_rows.push(current_row);

			var id = id + 10
		};
	};
	
	var edit_dish_table = "<table><tr><th>Składnik</th><th>Ilość</th><th>Kalorie</th><th></th></tr>" +
							ingredients_rows + "</table>"
	$("#dish-edit").html(edit_dish_table);
	
};
// change amount on click
const changeIngredientAmount = function(event) {
	var current_value = document.getElementById(event.target.id).innerHTML
	var current_change_name = "edit-" + (Number(event.target.id.split("-")[1]) - 1)
	var current_text_id = "text-" + (Number(event.target.id.split("-")[1]) + 5)
	
	document.getElementById(event.target.id).innerHTML = "<input type = 'text' value = '" + current_value +
	"' id = " + current_text_id + "><button id = 'change-value-" + current_change_name + "'>V</button><button id = 'cancel-change-" +
	current_change_name + "'>X</button>"
	
	$("#" + event.target.id).removeClass("ingredient-amount").off('click')
	
	// change value in the database
	$("#change-value-" + current_change_name).click(function(event) {
		let current_id = event.target.id.split("-")[3]
		var name_to_change = $("#edit-" + current_id).html();
		var value_to_change = $("#text-".concat(Number(current_id) + 6)).val();
		edited_dish[name_to_change] = value_to_change
		
		renderEditTable();
		
	});
	
	// cancel, reverse
	$("#cancel-change-" + current_change_name).click(function(event) {
		let button_parent = document.querySelector("#" + event.target.id).parentNode;
		$("#" + button_parent.id).addClass("ingredient-amount");
		button_parent.innerHTML = current_value;
	});
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
// add or edit dish
$(document).on("click", ".edit-dish", function(event) {
	$("#dish-table-container").fadeOut();
	$("#dish-edit-container").delay(500).css('display', 'inline-block').hide().fadeIn();;
	
	if (event.target.id != "add-new-dish") {
		let edited_dish_name = $("#" + Number(event.target.id - 1)).html();
		edited_dish = nuts.cookbook[edited_dish_name]["ingredients"];
		renderEditTable(edited_dish_name);
	} else {
		edited_dish = {}
		renderEditTable();
	};
});

// save dish
$(document).on("click", "#save-dish", function(event) {
	let dish_container = $("#save-dish-container").val();
	
	switch (dish_container) {
		case "":
			var dish_weight = Number($("#save-dish-weight").val());
			break;
		default:
			var dish_weight = Number($("#save-dish-weight").val()) - nuts.containers[dish_container];
			break;
	};		
	
	let dish_calories = 0
	
	for (item in edited_dish) {
		switch (nuts.catalogue[item]['unit']) {
			case "100g":
				var item_kcal = nuts.catalogue[item]['calories'] * (edited_dish[item] / 100);
				break;
			case "sztuka":
				var item_kcal = nuts.catalogue[item]['calories'] * edited_dish[item];
				break
		};
		dish_calories += item_kcal
	};
	
	nuts['cookbook'][$("#dish-name").val()] = {
		"ingredients": edited_dish,
		"container": dish_container,
		"weight": dish_weight,
		"calories": dish_calories / (dish_weight) * 100
	};
	
	dbmgr.saveNUTS();
	
	$("#dish-edit-container").fadeOut();
	$("#dish-table-container").delay(500).css('display', 'inline-block').hide().fadeIn();
	renderDishTable();
	
	edited_dish = null;
});
// delete dish
$(document).on("click", "#delete-dish", function(event) {
	alert("Not implemented yet");
});
// cancel editing
$(document).on("click", "#cancel-dish", function(event) {
	$("#dish-edit-container").fadeOut();
	$("#dish-table-container").delay(500).css('display', 'inline-block').hide().fadeIn();
	renderDishTable();
	
	edited_dish = null;
});

// add item to dish
$(document).on("click", "#dishes-add-button", function(event) {
	edited_dish[$("#dishes-add-name").val()] = Number($("#dishes-add-amount").val());
	
	renderEditTable();
});
// edit ingredient amount
$(document).on("click", ".ingredient-amount", function(event) {
	changeIngredientAmount(event);
});

// delete item from dish
$(document).on("click", ".ingredient-delete", function(event){
	let id = event.target.id.split("-")
	let item_to_delete = $("#edit-" + (Number(id[1]) - 2)).html();
	
	delete edited_dish[item_to_delete];
	renderEditTable();
	
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