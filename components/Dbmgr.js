const sqlite = require('better-sqlite3-with-prebuilds');
const path = require('path');
const fs = require('fs');

/**
 * @class Dbmgr
 * @description Class for managing the database.
 * 
 * @property db - Database object.
 * @property config - Config object.
 */
class Dbmgr {
    /**
     * @constructor
     * @description Creates a new database object.
     */
    constructor() {
        console.log("Initializing database");
        if (!fs.existsSync(path.join(__dirname, '../data'))) {
            console.log("Creating data folder");
            fs.mkdirSync(path.join(__dirname, "../data"));
        } else {
            console.log("Data folder exists");
        }

        if (!fs.existsSync(path.join(__dirname, '../data/nuts.db'))) {
            console.log("Creating database");
            this.createNewDatabase();
        } else {
            console.log("Database exists");
            this.db = new sqlite(path.join(__dirname, "../data/nuts.db"));
        }

        if (!fs.existsSync(path.join(__dirname, '../data/config.json'))) {
            console.log("Creating config");
            this.createNewConfig();
        } else {
            console.log("Config exists");
            this.config = require(path.join(__dirname, '../data/config.json'));
        }
    }
    /**
     * @method createNewDatabase
     * @description Creates a new database.
     * @returns {void}
     */
    createNewDatabase() {
        this.db = new sqlite(path.join(__dirname, "../data/nuts.db"));
        this.db.exec(`
            CREATE TABLE Consumed (
                entry_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                date DATE NOT NULL,
                amount REAL NOT NULL,
                kcal REAL NOT NULL,

                item_id INTEGER NOT NULL,
                FOREIGN KEY (item_id) REFERENCES Catalogue (ID)
            );

            CREATE TABLE Catalogue (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL UNIQUE,
                kcal_per_unit REAL NOT NULL,
                unit TEXT NOT NULL,
                categories TEXT
            );

            CREATE TABLE Cookbook (
                recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                total_weight REAL NOT NULL,
                container_id REAL,

                FOREIGN KEY (container_id) REFERENCES Containers (container_id)
            );

            CREATE TABLE Cookbook_Ingredients (
                recipe_id INTEGER NOT NULL,
                item_id INTEGER,
                amount REAL NOT NULL,
                kcal_per_unit REAL,

                FOREIGN KEY (recipe_id) REFERENCES Cookbook (recipe_id),
                FOREIGN KEY (item_id) REFERENCES Catalogue (item_id)
            );

            CREATE TABLE Categories (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL
            );

            CREATE TABLE Containers (
                container_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,
                weight REAL NOT NULL
            );

            CREATE TABLE Targets (
                entry_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                date DATE NOT NULL,
                consumed REAL NOT NULL,
                burned REAL NOT NULL,
                deficit REAL NOT NULL
            )
        `);
    }
    /**
     * @method getCatalogue
     * @returns {object} Returns an object containing all items in the catalogue.
     */
    getCatalogue(cols = null) {
        let cols_string = "*";
        if (cols) cols_string = cols.join(",");
        return this.db.prepare(`SELECT ${cols_string} FROM Catalogue ORDER BY Name;`).all();
    }
    /**
     * @method getCatalogueItem
     * @param {string} name - Name of the item to fetch.
     * @returns {object} Returns an object containing data about item.
     */
    getCatalogueItem(name) {
        return this.db.prepare(`SELECT * FROM Catalogue WHERE name = ?;`).get(name);
    };
    /**
     * @method addItemToCatalogue
     * @param {string} name 
     * @param {number} kcal_per_unit 
     * @param {string} unit 
     * @param {string} categories
     * @returns {void} 
     */
    addItemToCatalogue(name, kcal_per_unit, unit, categories) {
        this.db.prepare(`INSERT INTO Catalogue (name, kcal_per_unit, unit, categories) VALUES (?, ?, ?, ?);`).run(name, kcal_per_unit, unit, categories);
    }
    /**
     * @method removeItemFromCatalogue
     * @param {string} name 
     * @returns {void}
     */
    removeItemFromCatalogue(name) {
        this.db.prepare(`DELETE FROM Catalogue WHERE name = ?;`).run(name);
    }
    /**
     * @method updateCatalogueItem
     * @param {string} name 
     * @param {number} kcal_per_unit 
     * @param {string} unit 
     * @param {string} categories 
     * @returns {void}
     */
    updateCatalogueItem(name, kcal_per_unit, unit, categories) {
        this.db.prepare(`UPDATE Catalogue SET name = ?, kcal_per_unit = ?, unit = ?, categories = ? WHERE name = ?;`).run(name, kcal_per_unit, unit, categories, name);
    }
    /**
     * @method getCategories
     * @returns {object} Returns an object containing all categories.
     */
    getCategories(cols = null) {
        let cols_string = "*";
        if (cols) cols_string = cols.join(",");
        return this.db.prepare(`SELECT ${cols_string} FROM Categories ORDER BY Name;`).all();
    }
    /**
     * @method addCategory
     * @param {string} name - Name of the category to add.
     * @returns {void}
     */
    addCategory(name) {
        this.db.prepare(`INSERT INTO Categories (name) VALUES (?);`).run(name);
    }
    /**
     * @method removeCategory
     * @param {string} name - Name of the category to remove.
     * @returns {void}
     */
    removeCategory(name) {
        this.db.prepare(`DELETE FROM Categories WHERE name = ?;`).run(name);
    }
    /**
     * @method createNewConfig
     * @description Creates a new config file.
     * @returns {void}
     */
    createNewConfig() {
        this.config = {
            'lang': 'en'
        };
        fs.writeFile(path.join(__dirname, "../data/config.json"), JSON.stringify(this.config), err => {
            if (err) console.log("Error writing file:", err);
        });
    }
    /**
     * @method getConfig
     * @argument {string} key - Config key, default: null.
     * @returns {(string|object)} Returns config value of selected key or full config is key is null.
     */
    getConfig(key = null) {
        if (![...Object.keys(this.config), null].includes(key)) throw new Error("getConfig: invalid config key.");
        switch (key) {
            case null:
                return this.config;
            default:
                return this.config[key];
        }
    }
    /**
     * @method setConfig
     * @description Sets new config.
     * @argument {string} key   - Config key.
     * @argument {string} value - New config value.
     * @returns {void}
     */
    setConfig(key, value) {
        if (![...Object.keys(this.config), null].includes(key)) { console.error("setConfig: invalid config key."); return; }
        this.config[key] = value;
        fs.writeFile(path.join(__dirname, "../data/config.json"), JSON.stringify(this.config), err => {
            if (err) console.error("Error editing config:", err);
        });

    }
    /**
     * @method getTodayDate
     * @returns {string} Returns today's date in the format YYYY-MM-DD.
     */
    getTodayDate() {
        let date = new Date();
        let yyyy = date.getFullYear();
        let mm = String(date.getMonth() + 1).padStart(2,'0');
        let dd = String(date.getDate()).padStart(2,'0');
        
        let full_date = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
        
        return full_date
    }
}




module.exports = Dbmgr;