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
			amount_cell.appendChild(document.createTextNode(typeof edited_dish[item] === "object" ? edited_dish[item]['amount'] : edited_dish[item]));
			amount_cell.classList.add("ingredient-amount");
			amount_cell.setAttribute("id", `amount-${id}`)
			item_row.appendChild(amount_cell);
			
			const kcal_cell = document.createElement("td");
			var item_kcal;
			if (item == "Inne") {
				item_kcal = edited_dish[item]
			} else {
				if (typeof edited_dish[item] === "object") {
					switch (edited_dish[item]['kcal_unit']) {
						case "100g":
							item_kcal = edited_dish[item]['kcal_value'] * (edited_dish[item]['amount'] / 100);
							break;
						case "sztuka":
							item_kcal = edited_dish[item]['kcal_value'] * edited_dish[item]['amount']
							break
					}
				} else {
					switch (nuts.catalogue[item]['unit']) {
						case "100g":
							item_kcal = nuts.catalogue[item]['calories'] * (edited_dish[item] / 100);
							break;
						case "sztuka":
							item_kcal = nuts.catalogue[item]['calories'] * edited_dish[item];
							break
					}
				}
			}


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

utils.addDropdownMenu("dishes-add-name", dbmgr.getAvailableItems().sort());

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
		var item_kcal;
		if (item == "Inne") {
			item_kcal = edited_dish[item]
		} else {
			if (typeof edited_dish[item] === "object") {
				switch (edited_dish[item]['kcal_unit']) {
					case "100g":
						item_kcal = edited_dish[item]['kcal_value'] * (edited_dish[item]['amount'] / 100);
						break;
					case "sztuka":
						item_kcal = edited_dish[item]['kcal_value'] * edited_dish[item]['amount']
						break
				}
			} else {
				switch (nuts.catalogue[item]['unit']) {
					case "100g":
						item_kcal = nuts.catalogue[item]['calories'] * (edited_dish[item] / 100);
						break;
					case "sztuka":
						item_kcal = nuts.catalogue[item]['calories'] * edited_dish[item];
						break
				}
			}

		}

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

//$("#export-dish").prop("disabled", true);
//$("#import-dish").prop("disabled", true);
// export dish
$(document).on("click", "#export-dish", function(event) {
	let dish_raw = nuts.cookbook[$("#dish-name").val()];

	for (let ingredient of Object.keys(dish_raw["ingredients"])) {
		if (typeof dish_raw['ingredients'][ingredient] === "object") {
			dish_raw['ingredients'][ingredient] = {
				"amount": dish_raw['ingredients'][ingredient]['amount'],
				"kcal_value": dish_raw['ingredients'][ingredient]['kcal_value'],
				"kcal_unit": dish_raw['ingredients'][ingredient]['kcal_unit']
			}
		} else {
			dish_raw['ingredients'][ingredient] = {
				"amount": dish_raw['ingredients'][ingredient],
				"kcal_value": nuts.catalogue[ingredient]['calories'],
				"kcal_unit": nuts.catalogue[ingredient]['unit']
			}
		}

	}

	if (dish_raw['container'] != "") {
		dish_raw['container_weight'] = nuts.containers[dish_raw['container']];
	}
	
	dish_raw['dish_name'] = $("#dish-name").val();

	utils.displayPopupMenu($("<div/>", {
		html: [
			$("<p/>", {
				html: "Zamportuj danie poprzez skopiowanie poniższego tekstu i wklejenie go w innej instancji aplikacji:",
				style: "text-align:center;"
			}),
			$("<p/>", {
				html: JSON.stringify(dish_raw),
				style: "overflow-wrap:anywhere;font-weight:bold;padding:.5em;"
			})
		]
	}));
})

// import dish
$(document).on("click", "#import-dish", (event) => {
	utils.displayPopupMenu($("<div/>", {
		id: "dish-import-container",
		style: "text-align:center;",
		html: [
			$("<p/>", {
				html: "Podaj zakodowane danie:",
				style: "font-weight:bold;font-size:26px"
			}),
			$("<textarea/>", {
				id: "dish-import",
				style: "width:75%;height:15rem;max-width:100%, max-height:50%" // TEMP
			}),
			$("<br/>"), $("<br/>"),
			$("<button/>", {
				id: "begin-dish-import",
				html: "Zaimportuj"
			})
		]
	}));
})
$(document).on("click", "#begin-dish-import", (event) => {
	// parse import JSON
	dish_import_object = JSON.parse($("#dish-import").val());

	const container_div = $("<div/>");
	
	// compare container
	if (dish_import_object['container'] != "") {
		if (Object.keys(nuts.containers).includes(dish_import_object['container'])) {
			if (nuts.containers[dish_import_object['container']] == dish_import_object['container_weight']) {
				container_div.append($("<p/>", {html: `Pojemnik znaleziony: <p id='imported-container-name'>${dish_import_object['container']}</p>, waga zgodna`}))
			} else {
				container_div.append($("<div/>", {
					html: [
						$("<label/>", {for: "imported-container-name", html: "Nazwa pojemnika:"}),
						$("<input/>", {id: "imported-container-name", type: 'text', value: dish_import_object['container']}),
						$("<p/>", {html: `Waga pojemnika: <p id='imported-container-weight'>${dish_import_object['container_weight']}</p>`}),
						$("<select/>", {
							id: "imported-container-action",
							html: () => {
								var options = [
									new Option("Dodaj nowy lub nadpisz", "add-new-imported-container")
								]

								for (var container of Object.keys(nuts.containers)) {
									options.push(new Option(container, container));
								}
								return options
							}
						})
					]
				}))
			}
		}

	}

	// compare ingredients
	const ingredients_table = $("<table/>", {
		id: "import-dish-ingredients-table",
		html: [
			$("<tr/>", {
				html: [
					$("<th/>", {html: "Nazwa dania"}),
					$("<th/>", {html: "Kcal/100 w imporcie"}),
					$("<th/>", {html: "Kcal/100 w bazie"}),
					$("<th/>", {html: "Decyzja"})
				]
			})
		]
	});

	var row_id = 0;
	for (let ingredient in dish_import_object['ingredients']) {
		const ingredient_row = $("<tr/>", {
			html: [
				$("<td/>", {
					html: ingredient,
				}),
				$("<td/>", {
					html: dish_import_object['ingredients'][ingredient]['kcal_value']
				}),
				$("<td/>", {
					html: Object.keys(nuts.catalogue).includes(ingredient) ? nuts.catalogue[ingredient]['calories'] : ""
				}),
				$("<td/>", {
					html: () => {
						let decision_widget;
						const decision_id = `decision-${ingredient}`.replaceAll(" ", "_");
						if (Object.keys(nuts.catalogue).includes(ingredient)) {
							if (dish_import_object['ingredients'][ingredient]['kcal_value'] == nuts.catalogue[ingredient]['calories']) {
								decision_widget = `<p id='${decision_id}'>OK</p>`;
							} else {
								decision_widget = $("<select/>", { id: decision_id, html: [
									new Option("Wybierz import", 'choose-import'),
									new Option("Wybierz bazę", "choose-database-item")
								]})
							}
						} else {
							decision_widget = $("<input/>", {
								type: "text", class: "choose-item-to-replace", id: decision_id
							})

						}
						
						return decision_widget;
					}
				})
			]
		})
		ingredients_table.append(ingredient_row);
		row_id += 1;
	}

	const import_dish_table = $("<div/>", {
		html: [
			// dish name
			$("<div/>", {
				class: "input-widget",
				html: [
					$("<label/>", {html: "Nazwa dania", for: "imported-dish-name"}),
					$("<input/>", {
						type: "text",
						id: "imported-dish-name",
						value: dish_import_object['dish_name']
					})
				]
			}),
			// dish container
			container_div,
			// ingredients table
			ingredients_table,
			$("<button/>", {html: "Importuj", id: "confirm-dish-import"})
		]	
	})


	$("#dish-import-container").empty();
	$("#dish-import-container").append(import_dish_table);

	for (let element of $(".choose-item-to-replace")) {
		utils.addDropdownMenu(element.id, ["Pozostaw", "Dodaj do katalogu", ...dbmgr.getAvailableItems().sort()]);
	}

})

$(document).on("click", "#confirm-dish-import", (event) => {
	var new_dish = {
		"ingredients": {},
		"portions": 1,
		"weight": dish_import_object['weight']
	};

	if ($(`#imported-container-action`).length !== 0) {
		if ($(`#imported-container-action`).val() === "add-new-imported-container") {
			nuts.containers[`${$(`#imported-container-name`).val()}`] = Number(dish_import_object['container_weight']);
			new_dish['container'] = $("#imported-container-name").val();
		} else {
			new_dish['container'] = $("#imported-container-action").val();
		}
		
	} else {
		new_dish['container'] = dish_import_object['container'];
	}

	for (let ingredient in dish_import_object['ingredients']) {
		let decision = $(`#decision-${ingredient}`.replaceAll(" ", "_").replaceAll("&", "\\&")); // temporary, needs better fix in terms of special characters
		decision = decision.val() === "" ? decision.html() : decision.val();

		switch(decision) {
			case "":
				alert("Decisions missing! Please fill all blank widgest"); return null;
			case "OK":
			case "choose-database-item":
				new_dish["ingredients"][ingredient] = dish_import_object['ingredients'][ingredient]['amount']; break;
			case "choose-import":
			case "Pozostaw": // TODO: Change this to not rely on the language version
				new_dish["ingredients"][ingredient] = dish_import_object["ingredients"][ingredient]; break;
			case "Dodaj do katalogu":
				new_dish["ingredients"][ingredient] = dish_import_object['ingredients'][ingredient]['amount'];
				nuts.catalogue[ingredient] = {
					"category": [],
					"unit": dish_import_object['ingredients'][ingredient]['kcal_unit'],
					"calories": dish_import_object['ingredients'][ingredient]['kcal_value']
				};
				break;
			default:
				new_dish["ingredients"][decision] = dish_import_object['ingredients'][ingredient]['amount']; break;
		}

	}

	var dish_weight;
	switch (new_dish['container']) {
		case "":
			dish_weight = new_dish['weight'];
			break;
		default:
			dish_weight = Number(new_dish['weight']) - nuts.containers[new_dish['container']];
			break;
	};		
	
	let dish_calories = 0
	
	for (item in new_dish['ingredients']) {
		var item_kcal;
		if (item == "Inne") {
			item_kcal = new_dish['ingredients'][item];
		} else {
			if (typeof new_dish['ingredients'][item] == "number") {
				switch (nuts.catalogue[item]['unit']) {
					case "100g":
						item_kcal = nuts.catalogue[item]['calories'] * (new_dish['ingredients'][item] / 100);
						break;
					case "sztuka":
						item_kcal = nuts.catalogue[item]['calories'] * new_dish['ingredients'][item];
						break
				};
			} else if (typeof new_dish['ingredients'][item] == "object") {
				switch (new_dish['ingredients'][item]['kcal_unit']) {
					case "100g":
						item_kcal = new_dish['ingredients'][item]['amount'] * (new_dish['ingredients'][item]['kcal_value'] / 100);
						break;
					case "sztuka":
						item_kcal = new_dish['ingredients'][item]['amount'] * new_dish['ingredients'][item]['kcal_value'];
						break
				};
			}

		}
		dish_calories += item_kcal
	};

	new_dish['calories'] = dish_calories / new_dish['weight'] * 100;

	nuts.cookbook[$("#imported-dish-name").val()] = new_dish;
	delete dish_import_object;

	dbmgr.saveNUTS();
	location.reload();
})

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
	let item_name = $("#dishes-add-name").val() == "" ? "Inne" : $("#dishes-add-name").val(); 
	edited_dish[item_name] = Number($("#dishes-add-amount").val());

	$("#dishes-add-name").val("");
	$("#dishes-add-amount").val("");
	
	renderEditTable();
});
// edit ingredient amount
$(document).on("click", ".ingredient-amount", function(event) {
	var current_value = event.target.innerHTML;
	var current_change_name = event.target.parentElement.childNodes[0].innerHTML.replaceAll(" ", "_");
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
	$("#change-value-" + current_change_name).on("click", function(event) {
		let name_to_change = event.target.parentElement.parentElement.parentElement.childNodes[0].innerHTML;
		let value_to_change = event.target.parentElement.childNodes[0].value;
		
		if (typeof edited_dish[name_to_change] === "object") {
			edited_dish[name_to_change]['amount'] = Number(value_to_change);

		} else {
			edited_dish[name_to_change] = Number(value_to_change);
		}
		
		
		renderEditTable();
	});

	// cancel, reverse
	$("#cancel-change-" + current_change_name).on("click", function(event) {
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

// SHORTCUTS //
/*
document.onkeyup = function(event) {
	if (event.key === "Enter") {
		if ($(`.dropdown-options`)[0].style.display === "block") {
			if ($(".dropdown-option.selected").length !== 0) {
				let value_to_insert = $(".dropdown-option.selected")[0].innerHTML;
				$("#today-add-name").val(value_to_insert);
				document.getElementById("today-add-amount").focus();

			}
		} else {
			$("#today-add-button").click();
			document.getElementById("today-add-name").focus();
		}
		
	}
};
*/