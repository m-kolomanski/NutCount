// render food catalogue
renderCatalogue = function() {
	let val = db.prepare("SELECT * FROM food").all();

	let rows = []

	for (let i = 0; i < val.length; i++) {
		let row = "<tr><td>" + val[i]['name'] + "</td><td>" + val[i]['category'] + "</td><td>" +
			val[i]['calories'] + "</td><td>" + val[i]['unit'] + "</td></tr>"
		rows.push(row)
	}

	let table = `<table>
					<tr><th>Nazwa</th><th>Kategoria</th><th>Kalorie/j</th><th>Jednostki</th></tr>` +
					rows.join('') +
				`</table>`
		
	document.getElementById("food-catalogue").innerHTML = table
}

renderCatalogue();

// add new item to catalogue
document.getElementById("add-things").onclick = function() {
	dbmgr.addNewItem();
	renderCatalogue();
}

