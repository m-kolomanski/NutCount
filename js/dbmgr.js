const sqlite = require('better-sqlite3-with-prebuilds');

const getTodayDate = function () {
	let date = new Date();
	let yyyy = date.getFullYear();
	let mm = date.getMonth() + 1;
	let dd = date.getDate();
	
	let full_date = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
	
	return full_date
}

loadDatabase = function() {
	const db = new sqlite("./nuts.db");
	return db
};

createNewDatabase = function() {
	db.exec("CREATE TABLE food \
	(name TEXT PRIMARY KEY UNIQUE,\
	category TEXT,\
	calories INTEGER,\
	unit TEXT)")
	
	db.exec("CREATE TABLE daily \
	(date DATE,\
	amount INTEGER,\
	name TEXT,\
	FOREIGN KEY (name) REFERENCES food (name))")
}

addNewItem = function() {
	let query = "INSERT INTO food (name, category, calories, unit) VALUES ('" +  $("#name").val() + "', '" +
				$("#category").val() + "', '" + $("#calories").val() + "', '" + $("#unit").val() + "')"
	db.exec(query)
}

getAvailableItems = function() {
	let query = "SELECT name FROM food";
	
	let items = db.prepare(query).all();
	return items
}

addTodayItem = function(amount, name) {	
	let full_date = getTodayDate();
	
	db.exec("INSERT INTO daily (date, amount, name) VALUES ('" + full_date + "', '" + amount + "', '" + name + "')")
}

getTodayTable = function() {
	let full_date = getTodayDate();
	
	var query = "SELECT daily.*, food.*, SUM(daily.amount) AS amount FROM daily INNER JOIN food ON daily.name = food.name WHERE daily.date = '" + full_date + "' GROUP BY daily.name;";
	var table = db.prepare(query).all();
	
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
		db.exec("DELETE FROM food WHERE name = '" + name + "';");
	} else {
		console.log("UNKNOWN MODE")
	};
};

module.exports = { loadDatabase, createNewDatabase, addNewItem, getAvailableItems, addTodayItem, getTodayTable, changeAmount, deleteItem }; 