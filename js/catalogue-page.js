// render food catalogue
const renderCatalogue = function() {
	let val = db.prepare("SELECT * FROM food").all();

	let rows = []
	let row_id = 0
	
	for (let i = 0; i < val.length; i++) {
		let name_id = row_id + 1
		let category_id = row_id + 2
		let calories_id = row_id + 3
		let delete_id = row_id + 4
		
		let row = "<tr id = '" + row_id + "'><td id = '" + name_id + "'>" + val[i]['name'] +
		"</td><td id = '" + category_id + "'>" + val[i]['category'] +
		"</td><td id = '" + calories_id + "'>" + val[i]['calories'] +
		"</td><td>" + val[i]['unit'] + "</td><td id = '" + delete_id +
			"' class = 'catalogue-delete'></td></tr>"
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

// on page load
renderCatalogue();

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
