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
                name TEXT NOT NULL,
                kcal_per_100g REAL NOT NULL,
                portion_size REAL
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
                weigth REAL NOT NULL
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
     * @method getLocale
     * @returns {string} Returns current language string.
     */
    getLocale() {
        return this.config.lang;
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