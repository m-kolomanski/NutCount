// FUNCTIONS

// render table
const renderTodayTable = function() {
	var today_table = dbmgr.getTodayTable();
	
	let rows = []
	let row_id = 0
	
	for (let item of today_table) {

		let name_id = row_id + 1
		let amount_id = row_id + 2
		let delete_id = row_id + 3
		
		let row = "<tr id = '" + row_id + "'><td id = '" + name_id + "'>" +
		item.name + "</td><td class = 'today-amount-cell' id = '" + amount_id + "'>" + item.amount + "</td><td>" +
		Math.round(item.kcal) + "</td><td class = 'delete-field today-delete' id = '" + delete_id + "'></td></tr>";
		
		rows.push(row);
		row_id += 10
	}
	
	let table = "<table><tr><th>Nazwa</th><th>Ilość</th><th>Kalorie</th>" +
					rows.join('') +
				"</table>";
				
	document.getElementById("today-table").innerHTML = table;
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
		dbmgr.changeAmount(name_to_change, value_to_change);
		
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

// get item names for the picklist
const item_picklist = document.getElementById("today-add-name");
var items = dbmgr.getAvailableItems();
item_picklist.add(new Option(""));
for (let item of items) {
	item_picklist.add(new Option(item));
};

const cat_picklist = document.getElementById("today-category-filter");
cat_picklist.add(new Option(""));
cat_picklist.add(new Option("Dania"));
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
		case "Dania":
			var added_source = "cookbook";
			break;
		default:
			var added_source = "catalogue";
			break;
	};
	
	if (added_name == "") {
		alert("Proszę wybrać nazwę orzeszka!");
	} else {
		if (added_amount == "") {
			alert("Proszę wybrać ilość!");
			
		} else {
			dbmgr.addTodayItem(added_amount, added_name, added_source);
	
			resetPage();
		}
	}


};

$(document).on("click", ".today-amount-cell", function(event) {
	changeDailyAmount(event);
});

$(document).on("click", ".today-delete", function(event) {
	deleteDailyEntry(event);
});

// filter items by category
$(document).on("change", "#today-category-filter", function() {
	let filtered = []
	if ($("#today-category-filter").val() == "Dania") {
		for (dish in nuts.cookbook) {
			filtered.push(dish)
		};
	} else {
		for (item in nuts.catalogue) {
			if ($("#today-category-filter").val() == "" || nuts.catalogue[item].category == $("#today-category-filter").val()) {
				filtered.push(item);
			};
		};
	};

	
	$("#today-add-name").empty();
	
	item_picklist.add(new Option(""))
	for (item of filtered) {
		item_picklist.add(new Option(item))
	};
});


$(document).on("change", ".today-calc", function() {
	calculateLeftover();
	nuts.today_burned = $("#today-burned").val();
	nuts.today_deficit = $("#today-deficit").val();
	dbmgr.saveNUTS();
});

