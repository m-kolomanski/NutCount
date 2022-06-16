// get item names for the picklist
const selectElement = document.getElementById("today-add-name");
var items = dbmgr.getAvailableItems();
for (let item of items) {
	selectElement.add(new Option(item));
};

// add items for today
document.getElementById("today-add-button").onclick = function() {
	let added_name = $("#today-add-name").val();
	let added_amount = $("#today-add-amount").val();
	
	dbmgr.addTodayItem(added_amount, added_name);
	
	renderTodayTable();
	showSummary();
};

// render table
const renderTodayTable = function() {
	var today_table = dbmgr.getTodayTable();
	
	let rows = []
	let row_id = 0
	
	for (let item of today_table) {
	
		switch (item.unit) {
			case '100g':
				var kcal_today = item.amount * (item.calories / 100);
				break;
			case 'sztuka':
				var kcal_today = item.amount * item.calories;
				break;
		};
		
		let name_id = row_id + 1
		let amount_id = row_id + 2
		let delete_id = row_id + 3
		
		let row = "<tr id = '" + row_id + "'><td id = '" + name_id + "'>" +
		item.name + "</td><td class = 'today-amount-cell' id = '" + amount_id + "'>" + item.amount + "</td><td>" +
		kcal_today + "</td><td class = 'today-delete' id = '" + delete_id + "'></td></tr>";
		
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
		switch (item.unit) {
			case '100g':
				var kcal_today = item.amount * (item.calories / 100);
				break;
			case 'sztuka':
				var kcal_today = item.amount * item.calories;
				break;
		};
		
		sum = sum + kcal_today
	};

	document.getElementById("today-sum").innerHTML = sum;
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
		
		renderTodayTable();
		showSummary();
		
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
	
	renderTodayTable();
	showSummary();
};

// prepare page
renderTodayTable();
showSummary();

// prepare events
$(document).on("click", ".today-amount-cell", function(event) {
	changeDailyAmount(event);
});

$(document).on("click", ".today-delete", function(event) {
	deleteDailyEntry(event);
});
