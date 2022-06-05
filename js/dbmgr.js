const sqlite = require('better-sqlite3-with-prebuilds');

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
	let date = new Date();
	let yyyy = date.getFullYear();
	let mm = date.getMonth() + 1;
	let dd = date.getDate();
	
	let full_date = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
	
	db.exec("INSERT INTO daily (date, amount, name) VALUES ('" + full_date + "', '" + amount + "', '" + name + "')")
}

getTodayTable = function() {
	let date = new Date();
	let yyyy = date.getFullYear();
	let mm = date.getMonth() + 1;
	let dd = date.getDate();
	
	let full_date = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
	
	var query = "SELECT daily.*, food.*, SUM(daily.amount) AS amount FROM daily INNER JOIN food ON daily.name = food.name WHERE daily.date = '" + full_date + "' GROUP BY daily.name;";
	var table = db.prepare(query).all();
	
	return table
}

module.exports = { loadDatabase, createNewDatabase, addNewItem, getAvailableItems, addTodayItem, getTodayTable }; 