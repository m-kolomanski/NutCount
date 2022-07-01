const sqlite = require('better-sqlite3-with-prebuilds');
//const fs = require('fs');

const getTodayDate = function () {
	let date = new Date();
	let yyyy = date.getFullYear();
	let mm = date.getMonth() + 1;
	let dd = date.getDate();
	
	let full_date = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
	
	return full_date
}

loadDatabase = function() {
	const db = new sqlite("./db/nuts.db");
	return db
};

saveNUTS = function() {
	let jsonString = JSON.stringify(nuts);
	fs.writeFile("./db/nuts.json", jsonString, err => {
		if (err) console.log("Error writing file:", err);
	});	
}

createNewDatabase = function() {
	var fs = require('fs');
	
	let nuts = {
		"categories": [],
		"catalogue": {},
		"user": {},
	};
	
	let jsonString = JSON.stringify(nuts);
	fs.writeFile("./db/nuts.json", jsonString, err => {
		if (err) console.log("Error writing file:", err);
	});
	//saveJSON();
	
	db.exec("CREATE TABLE daily \
	(date DATE,\
	amount INTEGER,\
	name TEXT)")
	
}

addNewItem = function() {
	nuts['catalogue'][$("#name").val()] = {
		"category" : $("#category").val(),
		"calories" : $("#calories").val(),
		"unit" : $("#unit").val()
	}
	//let jsonString = JSON.stringify(nuts);
	//fs.writeFile("./db/nuts.json", jsonString, err => {
	//	if (err) console.log("Error writing file:", err);
	//});
	saveJSON();
}

getAvailableItems = function() {
	let items = [];
	for (item in nuts.catalogue) {
		items.push(item);
	};
	return items;
}

addTodayItem = function(amount, name) {	
	let full_date = getTodayDate();
	
	db.exec("INSERT INTO daily (date, amount, name) VALUES ('" + full_date + "', '" + amount + "', '" + name + "')")
}

getTodayTable = function() {
	let full_date = getTodayDate();
	
	var query = "SELECT daily.*, SUM(daily.amount) AS amount FROM daily WHERE daily.date = '" + full_date + "' GROUP BY daily.name;";
	var table = db.prepare(query).all();
	for (let i = 0; i < table.length; i++) {
		table[i].calories = nuts.catalogue[table[i].name].calories
		table[i].unit = nuts.catalogue[table[i].name].unit
	};
	
	return table
}

changeAmount = function(name, new_amount) {
	let full_date = getTodayDate();
	var old_amount = db.prepare("SELECT SUM(daily.amount) FROM daily WHERE daily.name = '" + name +
	"' AND daily.date = '" + full_date + "' ;").all();
	let amount_to_add = Number(new_amount) - Number(old_amount[0]['SUM(daily.amount)']);
	
	db.exec("INSERT INTO daily (date, amount, name) VALUES ('" + full_date + "', " + amount_to_add + ", '" + name + "');");
};

deleteItem = function(name, mode) {
	if (mode == "daily") {
		let full_date = getTodayDate();
		db.exec("DELETE FROM daily WHERE name = '" + name + "' AND date = '" + full_date + "';");
	} else if (mode == "catalogue") {
		console.log(name);
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
	} else {
		alert("Unknown mode")
	};
	
	saveNUTS();
};


module.exports = { loadDatabase, createNewDatabase, addNewItem, getAvailableItems, addTodayItem,
getTodayTable, changeAmount, deleteItem, execCategory }; 