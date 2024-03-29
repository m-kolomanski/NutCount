// FUNCTIONS
// render table
const renderTodayTable = function() {
	var today_table = dbmgr.getTodayTable();

	const table = document.createElement("table");
	
	const thead = document.createElement("thead");
	const hrow = document.createElement("tr");
	for (let colname of ["Nazwa", "Ilość", "Kalorie", ""]) {
		const hcell = document.createElement("th");
		hcell.appendChild(document.createTextNode(colname));
		hrow.appendChild(hcell);
	};
	thead.appendChild(hrow);
	table.appendChild(thead);
	
	let row_id = 0
	
	const tbody = document.createElement("tbody");
	for (let item of today_table) {
		const brow = document.createElement("tr");
		brow.classList.add(row_id);

		const name_cell = document.createElement("td");
		name_cell.setAttribute("id", row_id + 1);
		name_cell.appendChild(document.createTextNode(item.name));
		brow.appendChild(name_cell);

		const amount_cell = document.createElement("td");
		amount_cell.classList.add("today-amount-cell");
		amount_cell.setAttribute("id", row_id + 2);
		amount_cell.appendChild(document.createTextNode(item.amount));
		brow.appendChild(amount_cell);

		const kcal_cell = document.createElement("td");
		kcal_cell.appendChild(document.createTextNode(Math.round(item.kcal)));
		brow.appendChild(kcal_cell);

		const delete_cell = document.createElement("td");
		delete_cell.classList.add("delete-field", "today-delete");
		delete_cell.setAttribute("id", row_id + 3);
		brow.appendChild(delete_cell);

		tbody.appendChild(brow);

		row_id += 10
	}

	table.appendChild(tbody);
	document.getElementById("today-table").innerHTML = table.outerHTML;
};

// show summary
const showSummary = function() {
	var today_table = dbmgr.getTodayTable();
	
	let sum = 0;
	
	for (let item of today_table) {
		sum = sum + item.kcal
	};

	document.getElementById("today-sum").innerHTML = Math.round(sum);
};

// change amount on click
const changeDailyAmount = function(event) {
	var current_value = document.getElementById(event.target.id).innerHTML
	var current_change_name = event.target.id - 1
	var current_text_id = Number(event.target.id) + 1
	document.getElementById(event.target.id).innerHTML = "<input type = 'text' value = '" + current_value +
	"' id = " + current_text_id + "><button id = 'change-value-" + current_change_name + "'>V</button><button id = 'cancel-change-" +
	current_change_name + "'>X</button>"
	
	$("#" + event.target.id).removeClass("today-amount-cell").off('click')
	
	// change value in the database
	$("#change-value-" + current_change_name).click(function(event) {
		let current_id = event.target.id.split("-")[2]
		var name_to_change = $("#" + current_id).html();
		var value_to_change = $("#".concat(Number(current_id) + 2)).val();
		dbmgr.changeAmount(name_to_change, Number(value_to_change));
		
		resetPage();
		
	});
	
	// cancel, reverse
	$("#cancel-change-" + current_change_name).click(function(event) {
		let button_parent = document.querySelector("#" + event.target.id).parentNode;
		$("#" + button_parent.id).addClass("today-amount-cell");
		button_parent.innerHTML = current_value;
	});
};

// delete entry completely
const deleteDailyEntry = function(event) {
	let id_to_delete = event.target.id - 2;
	let name_to_delete = $("#" + id_to_delete).html();
	
	dbmgr.deleteItem(name_to_delete, "daily");

	resetPage();
};

// calulate leftover calories
const calculateLeftover = function() {
	let leftover = Number($("#today-burned").val()) - Number($("#today-sum").html()) - Number($("#today-deficit").val());
	
	$("#today-left").text(leftover); 
};

const resetPage = function() {
	renderTodayTable();
	showSummary();
	calculateLeftover();
}

// STARTUP

// get constant values
$("#today-burned").val(nuts.today_burned);
$("#today-deficit").val(nuts.today_deficit);

utils.addDropdownMenu("today-add-name", dbmgr.getAvailableItems().sort())

const cat_picklist = document.getElementById("today-category-filter");
cat_picklist.add(new Option(""));
cat_picklist.add(new Option("Posiłki"));

for (let cat of nuts.categories) {
	cat_picklist.add(new Option(cat));
};

resetPage();


// EVENTS
// add items for today
document.getElementById("today-add-button").onclick = function(event) {
	let added_name = $("#today-add-name").val();
	let added_amount = $("#today-add-amount").val();
	switch ($("#today-category-filter").val()) {
		case "":
			if (Object.keys(nuts.cookbook).includes(added_name)) {
				var added_source = "cookbook";
			} else {
				var added_source = "catalogue";
			}
			break
		case "Posiłki":
			var added_source = "cookbook";
			break;
		default:
			var added_source = "catalogue";
			break;
	};
	
	if (added_amount == "") {
		alert("Proszę podać ilość!");
		
	} else {
		dbmgr.addTodayItem(added_amount, added_name, added_source);

		resetPage();
		
		$("#today-category-filter").val("");
		filterItemsByCat();
		$("#today-add-name").val("");
		$("#today-add-amount").val("");
		
		$("#notification-container")
			.empty()
			.append("<p id='notification'>Produkt został dodany.</p>")
		$("#notification")
			.delay(3000)
			.fadeOut();
	}
};

$(document).on("click", ".today-amount-cell", function(event) {
	changeDailyAmount(event);
});

$(document).on("click", ".today-delete", function(event) {
	deleteDailyEntry(event);
});

// filter items by category
const filterItemsByCat = function() {
	let filtered = []
	if ($("#today-category-filter").val() == "Posiłki") {
		for (dish in nuts.cookbook) {
			filtered.push(dish)
		};
	} else {
		for (item of dbmgr.getAvailableItems().sort()) {
			if ($("#today-category-filter").val() == "" || nuts.catalogue[item].category.includes($("#today-category-filter").val())) {
				filtered.push(item);
			};
		};
	};

	filtered.sort();

	utils.addDropdownMenu("today-add-name", filtered);
};
$(document).on("input", "#today-category-filter", function() {
	filterItemsByCat();
});


$(document).on("change", ".today-calc", function() {
	calculateLeftover();
	nuts.today_burned = $("#today-burned").val();
	nuts.today_deficit = $("#today-deficit").val();
	dbmgr.saveNUTS();
});

// inform user of the unit ahead of adding product
$(document).on("change", "#today-add-name", function(event) {
	let amount_label = "Ilość";
	
	if (Object.keys(nuts.cookbook).includes(event.target.value)) {
		amount_label += " (g)";
	} else if (Object.keys(nuts.catalogue).includes(event.target.value)) {
		amount_label += ` (${nuts.catalogue[event.target.value].unit})`;
	}
	
	$("[for='today-add-amount']").html(amount_label);
});	

// kcal calculator
$(document).on("input", ".today-calculator", function() {
	let weight = $("#today-calculator-weight").val();
	let kcal = $("#today-calculator-kcal").val();
	
	if (weight == "" && kcal == "") {
		$("#today-calculator-result").html("");
	} else if (weight == "" || kcal == "") {
		$("#today-calculator-result").html("Uzupełnij informacje!");
	} else {
		let result = Math.round(Number(weight) * (Number(kcal) / 100))
		$("#today-calculator-result").html(`${result} kcal`);
		$("#today-add-amount").val(result);
	}
});

// SHORTCUTS //
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