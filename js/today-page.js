// get item names for the picklist
const selectElement = document.getElementById("today-add-name");
for (let item of items) {
	selectElement.add(new Option(item.name));
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
		
		let row = "<tr id = '" + row_id + "'><td id = '" + name_id + "'>" +
		item.name + "</td><td class = 'today-amount-cell' id = '" + amount_id + "'>" + item.amount + "</td><td>" +
		kcal_today + "</td></tr>";
		
		rows.push(row);
		row_id += 10
	}
	
	let table = "<table><tr><th>Nazwa</th><th>Ilość</th><th>Kalorie</th>" +
					rows.join('') +
				"</table>";
				
	document.getElementById("today-table").innerHTML = table
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
	}

	document.getElementById("today-sum").innerHTML = sum
}

// change amount on click 
renderTodayTable();
showSummary();
