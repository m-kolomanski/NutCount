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
        Log.debug("Connecting to database...");
        this.db_subdir = '../../assets/data';

        if (!fs.existsSync(path.join(__dirname, this.db_subdir))) {
            Log.debug("Creating data folder");
            fs.mkdirSync(path.join(__dirname, this.db_subdir));
        } else {
            Log.debug("Data folder exists");
        }

        if (!fs.existsSync(path.join(__dirname, this.db_subdir, 'nuts.db'))) {
            Log.debug("Creating database");
            this.createNewDatabase();
        } else {
            Log.debug("Database exists");
            this.db = new sqlite(path.join(__dirname, this.db_subdir, 'nuts.db'));
        }

        if (!fs.existsSync(path.join(__dirname, this.db_subdir, 'config.json'))) {
            Log.debug("Creating config");
            this.createNewConfig();
        } else {
            Log.debug("Config exists");
            this.config = require(path.join(__dirname, this.db_subdir, 'config.json'));
        }

        return this;
    }
    /**
     * @method createNewDatabase
     * @description Creates a new database.
     * @returns {void}
     */
    createNewDatabase() {
        this.db = new sqlite(path.join(__dirname, this.db_subdir, "nuts.db"));
        this.db.exec(`
            CREATE TABLE Consumed (
                entry_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                date DATE NOT NULL,
                amount REAL NOT NULL,
                kcal REAL NOT NULL,

                item_id INTEGER NOT NULL,
                FOREIGN KEY (item_id) REFERENCES Catalogue (item_id)
            );

            CREATE TABLE Catalogue (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL UNIQUE,
                kcal_per_unit REAL NOT NULL,
                unit TEXT NOT NULL,

                visible BOOL DEFAULT 'T'
            );

            CREATE TABLE Cookbook (
                recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                total_weight REAL NOT NULL,
                container_id REAL,

                visible BOOL DEFAULT 'T',

                FOREIGN KEY (container_id) REFERENCES Containers (container_id)
            );

            CREATE TABLE Cookbook_Ingredients (
                recipe_id INTEGER NOT NULL,
                item_id INTEGER,
                amount REAL NOT NULL,

                FOREIGN KEY (recipe_id) REFERENCES Cookbook (recipe_id),
                FOREIGN KEY (item_id) REFERENCES Catalogue (item_id)
            );

            CREATE TABLE Categories (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,

                visible BOOL DEFAULT 'T'
            );

            CREATE TABLE Categories_assignment (
                item_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,

                FOREIGN KEY (item_id) REFERENCES Catalogue (item_id),
                FOREIGN KEY (category_id) REFERENCES Categories (category_id)
            );

            CREATE TABLE Containers (
                container_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,
                weight REAL NOT NULL,

                visible BOOL DEFAULT 'T'
            );

            CREATE TABLE Targets (
                entry_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                date DATE NOT NULL,
                burned REAL NOT NULL,
                deficit REAL NOT NULL
            )
        `);
    }
    /**
     * @method getCatalogue
     * @returns {object} Returns an object containing all items in the catalogue.
     */
    getCatalogue({column = null, mode = "concat_categories"} = {}) {
        if (column !== null) {
            return this.db.prepare(`SELECT ${column} FROM Catalogue;`).all();
        }
        let raw_data = this.db.prepare(`
            SELECT Catalogue.item_id, Catalogue.name, Catalogue.kcal_per_unit, Catalogue.unit, Categories.name AS categories
            FROM Catalogue
            LEFT JOIN Categories_assignment ON Catalogue.item_id = Categories_assignment.item_id
            LEFT JOIN Categories ON Categories_assignment.category_id = Categories.category_id
            WHERE Catalogue.visible = 'T'
            ORDER BY Catalogue.name;
        `).all();

        if (raw_data.length === 0 || raw_data[0]['item_id'] === null) return null

        switch (mode) {
            case "raw":
                return raw_data;
            case "concat_categories":
                var transformed_data = [];
                var current_id = raw_data[0]['item_id'];
                var categories = [];

                                                                                                            // iterate over all entries
                                                                                                            // due to left join on the sql and multiple categories being assigned,
                                                                                                            // for each item there is an individual entry for each category it belongs to
                                                                                                            // so in this mode we wan to concat categories and flatten the entry into single line
                for (var i = 0; i < raw_data.length; i++) {
                    categories.push(raw_data[i]['categories']);                                              // push the current category to the array
                    if (raw_data[i + 1]?.item_id !== current_id) {                                           // if the next item in list is not the same item...
                        transformed_data.push(raw_data[i]);                                                  // ...add current item to transformed data
                        transformed_data[transformed_data.length - 1]['categories'] = categories.join(", "); // concat categories for current item and add to transformed data
                        current_id = raw_data[i + 1]?.item_id;                                               // change current id for comparison to the next item in line
                        categories = [];                                                                     // reset categories in preparation for the new item
                    }                                                                                        // if the next item is the same, just continue iteration and add next category
                }
                return transformed_data;
                
            
        }
        
    }
    /**
     * @method getCatalogueItem
     * @param {string} name - Name of the item to fetch.
     * @returns {object} Returns an object containing data about item.
     */
    getCatalogueItem(id) {
        return this.db.prepare(`SELECT * FROM Catalogue WHERE item_id = ? AND visible = 'T';`).get(id);
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
        this.db.prepare(`INSERT INTO Catalogue (name, kcal_per_unit, unit) VALUES (?, ?, ?);`).run(name, kcal_per_unit, unit);
        const new_item_id = this.db.prepare(`SELECT MAX(item_id) FROM Catalogue;`).all()[0]['MAX(item_id)'];

        if (categories.length !== 0) {
            this.db.prepare(`INSERT INTO Categories_assignment (item_id, category_id) VALUES ${
                categories.map((category_id) => {
                    return `(${new_item_id}, ${category_id})`
                }).join(", ")
            };`).run();
        }

    }
    /**
     * @method removeItemFromCatalogue
     * @param {number} item_id 
     * @returns {void}
     */
    removeItemFromCatalogue(item_id) {
        this.db.prepare(`UPDATE Catalogue SET visible = 'F' WHERE item_id = ?;`).run(item_id);
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
        let cols_string = cols ? cols.join(",") : "category_id, name"
        const raw_data = this.db.prepare(`SELECT ${cols_string} FROM Categories ORDER BY Name;`).all();

        if (raw_data.length === 0) return null;

        return raw_data;
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
        this.db.prepare(`UPDATE Categories SET visible = 'F' WHERE name = ?;`).run(name);
    }
    /**
     * @method createNewConfig
     * @description Creates a new config file.
     * @returns {void}
     */
    createNewConfig() {
        this.config = {
            'lang': 'en',
            'theme': 'nuts'
        };
        fs.writeFile(path.join(__dirname, this.db_subdir, "config.json"), JSON.stringify(this.config), err => {
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
        fs.writeFile(path.join(__dirname, this.db_subdir, "config.json"), JSON.stringify(this.config), err => {
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