const sqlite = require('better-sqlite3-with-prebuilds');
//const fs = require('fs');
const path = require('path');

const getTodayDate = function () {
	let date = new Date();
	let yyyy = date.getFullYear();
	let mm = date.getMonth() + 1;
	let dd = date.getDate();
	
	let full_date = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
	
	return full_date
}

loadDatabase = function() {
	const db = new sqlite(path.join(__dirname, "../db/nuts.db"));
	return db
};

saveNUTS = function() {
	let jsonString = JSON.stringify(nuts);
	fs.writeFile(path.join(__dirname, "../db/nuts.json"), jsonString, err => {
		if (err) console.log("Error writing file:", err);
	});	
}

createNewDatabase = function() {
	var fs = require('fs');
	
	let nuts = {
		"categories": [],
		"catalogue": {},
		"cookbook": {},
		"containers": {},
		"user": {},
		"today_burned": 0,
		"today_deficit": 0
	};
	
	let jsonString = JSON.stringify(nuts);
	fs.writeFile(path.join(__dirname, "../db/nuts.json"), jsonString, err => {
		if (err) console.log("Error writing file:", err);
	});
	//saveJSON();
	
	db.exec("CREATE TABLE daily \
	(date DATE,\
	name TEXT,\
	amount INTEGER,\
	kcal INTEGER)")	
}

addNewItem = function() {
	nuts['catalogue'][$("#name").val()] = {
		"category" : [$("#category").val()],
		"calories" : $("#calories").val(),
		"unit" : $("#unit").val()
	}

	saveNUTS();
}

getAvailableItems = function() {
	let items = [];
	for (item in nuts.catalogue) {
		items.push(item);
	};
	for (dish in nuts.cookbook) {
		items.push(dish);
	};
	return items;
}

addTodayItem = function(amount, name, source) {	
	let full_date = getTodayDate();
	var item = nuts[source][name]
	
	switch (item.unit) {
		case "100g":
			var kcal = amount * (item.calories / 100);
			break;
		case "sztuka":
			var kcal = amount * item.calories;
			break;
		default:
			var kcal = amount * (item.calories / 100);
	};
	
	db.exec("INSERT INTO daily (date, name, amount, kcal) VALUES ('" +
 			full_date + "', '" + name + "', '" + amount + "', '" +
			kcal + "')")
}

getTodayTable = function() {
	let full_date = getTodayDate();
	
	var query = "SELECT daily.*, SUM(daily.amount) AS amount, SUM(daily.kcal) AS kcal FROM daily WHERE daily.date = '" + full_date + "' GROUP BY daily.name;";
	var table = db.prepare(query).all();
	
	return table
}

changeAmount = function(name, new_amount) {
	let full_date = getTodayDate();
	var old_amount = db.prepare("SELECT SUM(daily.amount) FROM daily WHERE daily.name = '" + name +
	"' AND daily.date = '" + full_date + "' ;").all();
	let amount_to_add = Number(new_amount) - Number(old_amount[0]['SUM(daily.amount)']);
	
	var item = nuts.catalogue[name];
	switch (item.unit) {
		case "100g":
			var kcal = amount_to_add * (item.calories / 100);
			break;
		case "sztuka":
			var kcal = amount_to_add * item.calories;
			break;
	};
	
	db.exec("INSERT INTO daily (date, name, amount, kcal) VALUES ('" +
			full_date + "', '" + name + "', " + amount_to_add + ", " +
			kcal + ");");
};

deleteItem = function(name, mode) {
	if (mode == "daily") {
		let full_date = getTodayDate();
		db.exec("DELETE FROM daily WHERE name = '" + name + "' AND date = '" + full_date + "';");
	} else if (mode == "catalogue") {
		delete nuts.catalogue[name];
		saveNUTS();
		
	} else {
		console.log("UNKNOWN MODE")
	};
};

execCategory = function(cat, mode) {
	if (mode == "add") {
		nuts['categories'].push(cat);
	} else if (mode == "delete") {
		let i = nuts['categories'].indexOf(cat);
		nuts['categories'].splice(i, 1);
		
		for (item in nuts.catalogue) {
			if (nuts.catalogue[item].category.includes(cat)) {
				let i = nuts.catalogue[item].category.indexOf(cat);
				nuts.catalogue[item].category.splice(i, 1);
			}
		}
	} else {
		alert("Unknown mode")
	};
	
	saveNUTS();
};

execContainer = function(con, weight, mode) {
	if (mode == "add") {
		nuts['containers'][con] = Number(weight)
	} else if (mode == "delete") {
		delete nuts['containers'][con]
	} else {
		alert("Unknown mode")
	};
	
	saveNUTS();
};

module.exports = { loadDatabase, saveNUTS, createNewDatabase, addNewItem, getAvailableItems, addTodayItem,
getTodayTable, changeAmount, deleteItem, execCategory, execContainer }; 