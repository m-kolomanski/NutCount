// FUNCTIONS
// render dish table
function calculatePortionStats(weight, kcal, n_portions) {
	let grams_portion = Math.round(weight / n_portions);
	let kcal_portion = Math.round(grams_portion * (kcal / 100));
	
	return `${grams_portion}g / ${kcal_portion}kcal`
};
const renderDishTable = function() {
	var dishes = Object.keys(nuts.cookbook).sort().reduce(
		(obj, key) => {
			obj[key] = nuts.cookbook[key];
			return obj;
		},
		{}
	);
	const dishes_table = document.createElement("table");
	
	// header
	const thead = document.createElement("thead");
	const header_row = document.createElement("tr");
	
	for (let header of ["Nazwa", "100g", "Ilość porcji", "Porcja", ""]) {
		const head_cell = document.createElement("th");
		head_cell.appendChild(document.createTextNode(header));
		header_row.appendChild(head_cell);
	};
	
	thead.appendChild(header_row);
	dishes_table.appendChild(thead);
	
	// body
	const tbody = document.createElement("tbody");
	if (Object.keys(dishes).length > 0) {
		var id = 0
		
		for (let dish in dishes) {
			const dish_row = document.createElement("tr");
			
			const name_cell = document.createElement("td");
			name_cell.appendChild(document.createTextNode(dish));
			dish_row.appendChild(name_cell);
			
			const calories_cell = document.createElement("td");
			calories_cell.appendChild(document.createTextNode(Math.round(nuts.cookbook[dish].calories)));
			dish_row.appendChild(calories_cell);
			
			let dish_portions = Number(nuts.cookbook[dish].portions)
			
			let portions_number_cell = document.createElement("td");
			portions_number_cell_widget = document.createElement("input");
			portions_number_cell_widget.setAttribute("type", "text");
			portions_number_cell_widget.setAttribute("value", dish_portions);
			portions_number_cell_widget.classList.add("portions_number_widget");
			portions_number_cell.appendChild(portions_number_cell_widget);
			dish_row.appendChild(portions_number_cell);
			
			let portions_calculations = document.createElement("td");
			portions_calculations.appendChild(document.createTextNode(calculatePortionStats(dishes[dish]["weight"],
																							dishes[dish]["calories"],
																							dish_portions)));
			dish_row.appendChild(portions_calculations);
			
			let edit_cell = document.createElement("td");
			edit_cell.classList.add("edit-field");
			edit_cell.classList.add("dish");
			dish_row.appendChild(edit_cell);
			
			tbody.appendChild(dish_row);
			id += 1
		};
	};

	dishes_table.appendChild(tbody);
	
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
		
		$("#save-dish-portions").val(nuts.cookbook[name]["portions"]);
	};
	
	const dish_edit_table = document.createElement("table");
	
	// header
	const thead = document.createElement("thead");
	const header_row = document.createElement("tr");
	for (let header of ["Składnik", "Ilość", "Kalorie", ""]) {
		const header_cell = document.createElement("th");
		header_cell.appendChild(document.createTextNode(header));
		header_row.appendChild(header_cell);
	};
	
	thead.appendChild(header_row);
	dish_edit_table.appendChild(thead);
	
	// body
	tbody = document.createElement("tbody");

	if (edited_dish != null) {
		var id = 0

		var sorted_ingredients = Object.keys(edited_dish).sort().reduce(
			(obj, key) => {
				obj[key] = edited_dish[key];
				return obj;
			},
			{}
		)

		for (let item in sorted_ingredients) {
			
			let item_row = document.createElement("tr");
			//item_row.setAttribute("id", id);
			
			const name_cell = document.createElement("td");
			name_cell.appendChild(document.createTextNode(item));
			item_row.appendChild(name_cell);
			
			const amount_cell = document.createElement("td");
			amount_cell.appendChild(document.createTextNode(edited_dish[item]));
			amount_cell.classList.add("ingredient-amount");
			amount_cell.setAttribute("id", `amount-${id}`)
			item_row.appendChild(amount_cell);
			
			const kcal_cell = document.createElement("td");
			switch (nuts.catalogue[item]['unit']) {
				case "100g":
					var item_kcal = nuts.catalogue[item]['calories'] * (edited_dish[item] / 100);
					break;
				case "sztuka":
					var item_kcal = nuts.catalogue[item]['calories'] * edited_dish[item];
					break
			};
			kcal_cell.appendChild(document.createTextNode(Math.round(item_kcal)));
			item_row.appendChild(kcal_cell);
			
			const delete_cell = document.createElement("td");
			delete_cell.classList.add("delete-field");
			delete_cell.classList.add("ingredients");
			item_row.appendChild(delete_cell);
			
			tbody.appendChild(item_row);

			id += 1
		};
	};
	
	dish_edit_table.appendChild(tbody);
	
	$("#dish-edit").html(dish_edit_table);
	
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
	const con_table = document.createElement("table");

	const thead = document.createElement("thead");
	const hrow = document.createElement("tr");
	for (let colname of ["Nazwa", "Waga [g]", ""]) {
		const tcell = document.createElement("th");
		tcell.appendChild(document.createTextNode(colname));
		hrow.appendChild(tcell);
	};
	thead.appendChild(hrow); con_table.appendChild(thead);

	tbody = document.createElement("tbody");
	var id = 0
	for (let con in containers) {
		const brow = document.createElement("tr");

		const name_cell = document.createElement("td");
		name_cell.setAttribute("id", `delete-${id}`);
		name_cell.appendChild(document.createTextNode(con));
		brow.appendChild(name_cell);

		const weight_cell = document.createElement("td");
		weight_cell.appendChild(document.createTextNode(nuts.containers[con]));
		brow.appendChild(weight_cell);

		const delete_cell = document.createElement("td");
		delete_cell.classList.add("delete-field", "containers-delete");
		delete_cell.setAttribute("id", `delete-${id + 1}`);
		brow.appendChild(delete_cell);

		tbody.appendChild(brow);
		id += 10
	};
	con_table.appendChild(tbody);
	$("#containers-table").html(con_table);
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
edited_dish = null;
edited_dish_name = null;

dm.addDropdownMenu("dishes-add-name", dbmgr.getAvailableItems().sort());

const cat_picklist = document.getElementById("dishes-category-filter");
cat_picklist.add(new Option(""));
for (let cat of nuts.categories) {
	cat_picklist.add(new Option(cat));
};

renderDishTable();
renderContainers();

// EVENTS
const addNewOrEdit = function(event) {
	$("#dish-table-container").fadeOut();
	$("#dish-edit-container").delay(500).css('display', 'inline-block').hide().fadeIn();;
	
	if (event.target.id != "add-new-dish") {
		edited_dish_name = event.target.parentElement.childNodes[0].innerHTML;
		edited_dish = nuts.cookbook[edited_dish_name]["ingredients"];
		renderEditTable(edited_dish_name);
	} else {
		edited_dish = {}
		renderEditTable();
	};
};
$(document).on("click", ".edit-field.dish", function(event) {
	addNewOrEdit(event);
});
$(document).on("click", "#add-new-dish", function(event) {
	addNewOrEdit(event);
});
// change portions
$(document).on("change", ".portions_number_widget", function(event) {
	let changed_dish = event.target.parentElement.parentElement.firstChild.innerHTML;
	nuts.cookbook[changed_dish].portions = event.target.value;
	dbmgr.saveNUTS();
	
	let new_calculation = calculatePortionStats(nuts.cookbook[changed_dish]["weight"],
											nuts.cookbook[changed_dish]["calories"],
											event.target.value);
	event.target.parentElement.nextSibling.innerHTML = new_calculation;
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
		"calories": dish_calories / (dish_weight) * 100,
		"portions": Number($("#save-dish-portions").val())
	};
	
	dbmgr.saveNUTS();
	
	$("#dish-edit-container").fadeOut();
	$("#dish-table-container").delay(500).css('display', 'inline-block').hide().fadeIn();
	renderDishTable();
	
	edited_dish = null;
});
// delete dish
$(document).on("click", "#delete-dish", function(event) {
	if (edited_dish_name !== null) {
		delete nuts.cookbook[edited_dish_name];
		dbmgr.saveNUTS();
		$("#dish-edit-container").fadeOut();
		$("#dish-table-container").delay(500).css('display', 'inline-block').hide().fadeIn();
		renderDishTable();
	
		edited_dish = null;
		edited_dish_name = null;
	} else {
		alert("Nie znaleziono zapisanego dania, spróbuj anulować");
	};
});
// cancel editing
$(document).on("click", "#cancel-dish", function(event) {
	$("#dish-edit-container").fadeOut();
	$("#dish-table-container").delay(500).css('display', 'inline-block').hide().fadeIn();
	renderDishTable();
	
	edited_dish = null;
	edited_dish_name = null;
});

// add item to dish
$(document).on("click", "#dishes-add-button", function(event) {
	edited_dish[$("#dishes-add-name").val()] = Number($("#dishes-add-amount").val());
	
	renderEditTable();
});
// edit ingredient amount
$(document).on("click", ".ingredient-amount", function(event) {
	var current_value = event.target.innerHTML;
	var current_change_name = event.target.parentElement.childNodes[0].innerHTML;
	//var current_text_id = "text-" + (Number(event.target.id.split("-")[1]) + 5)
	
	const edit_widget = document.createElement("div");
	
	const text_input = document.createElement("input");
	text_input.setAttribute("type", "text");
	text_input.setAttribute("value", current_value);
	edit_widget.appendChild(text_input);
	
	const confirm_button = document.createElement("button");
	confirm_button.innerHTML = "V";
	confirm_button.setAttribute("id", `change-value-${current_change_name}`);
	edit_widget.appendChild(confirm_button);
	
	const cancel_button = document.createElement("button");
	cancel_button.innerHTML = "X";
	cancel_button.setAttribute("id", `cancel-change-${current_change_name}`);
	edit_widget.appendChild(cancel_button);
	
	event.target.innerHTML = edit_widget.outerHTML;
	
	$("#" + event.target.id).removeClass("ingredient-amount").off('click');
	
	// change value in the database
	$("#change-value-" + current_change_name).click(function(event) {
		let name_to_change = event.target.parentElement.parentElement.parentElement.childNodes[0].innerHTML;
		let value_to_change = event.target.parentElement.childNodes[0].value;
		
		edited_dish[name_to_change] = value_to_change
		
		renderEditTable();
	});

	// cancel, reverse
	$("#cancel-change-" + current_change_name).click(function(event) {
		let button_parent = $("#" + event.target.parentElement.parentElement.id);
		button_parent.html(current_value);// = current_value;
		button_parent.addClass("ingredient-amount");
	});
});

// delete item from dish
$(document).on("click", ".delete-field.ingredients", function(event){	
	let item_to_delete = event.target.parentElement.childNodes[0].innerHTML;
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
	
	filtered.sort();
	
	$("#dishes-add-name").empty();
	
	item_picklist.add(new Option(""))
	for (item of filtered) {
		item_picklist.add(new Option(item))
	};
});

// add new container
$(document).on("click", "#containers-add-button", function() {
	dbmgr.execContainer($("#containers-add-name").val().trim(), $("#containers-add-weight").val(), "add");
	renderContainers();
});

// delete container
$(document).on("click", ".containers-delete", function(event) {
	deleteContainers(event);
});