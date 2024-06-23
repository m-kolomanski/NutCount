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
                name TEXT NOT NULL,
                kcal_per_unit REAL NOT NULL,
                unit TEXT NOT NULL,
                categories TEXT,

                visible BOOL DEFAULT 'T'
            );

            CREATE TABLE Categories (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,

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
    getCatalogue({column = null, mode = "concat_categories", filter_name = '', filter_category = []} = {}) {
        if (column !== null) {
            return this.db.prepare(`SELECT ${column} FROM Catalogue;`).all();
        }
        let catalogue_data = this.db.prepare(`
            SELECT item_id, name, kcal_per_unit, replace(unit, 'portion', '${window.locale.catalogue['portion-label']}') AS unit, categories
            FROM Catalogue
            WHERE visible = 'T'
            ORDER BY Catalogue.name;
        `).all();

        if (catalogue_data.length === 0 || catalogue_data[0]['item_id'] === null) return null

        if (filter_name !== '') {
            const filter_parsed = filter_name.toLowerCase().replace(" ", "");

            catalogue_data = catalogue_data.filter((element) => {
                return element['name'].toLowerCase().replace(" ", "").includes(filter_parsed);
            });
        }

        if (filter_category.length !== 0) {
            catalogue_data = catalogue_data.filter((element) => {
                const element_categories = element['categories'].split(",");
                const categories_overlap = element_categories.filter((cat) => {
                    return filter_category.includes(cat);
                });

                return categories_overlap.length !== 0;
            });
        }

        switch (mode) {
            case "raw":
                break;
            case "concat_categories":
                const all_categories = this.db.prepare(`SELECT name FROM Categories ORDER BY category_id;`).all().map((cat) => {
                    return cat['name'];
                });

                for (let i = 0; i < catalogue_data.length; i++) {
                    const item_categories_names = catalogue_data[i]['categories'].split(',').map((cat_id) => {
                        return all_categories[Number(cat_id) - 1];
                    });
                    catalogue_data[i]['categories'] = item_categories_names.join(", ");
                }
        }



        return catalogue_data;  
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
    addItemToCatalogue(name, kcal_per_unit, unit, categories = "") {
        this.db.prepare(`INSERT INTO Catalogue (name, kcal_per_unit, unit, categories) VALUES (?, ?, ?, ?);`)
            .run(name, kcal_per_unit, unit, categories.toString());
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
     * @param {number} id
     * @param {string} name 
     * @param {number} kcal_per_unit 
     * @param {string} unit 
     * @param {string} categories 
     * @returns {void}
     */
    updateCatalogueItem(id, name, kcal_per_unit, unit, categories) {
        this.db.prepare(`UPDATE Catalogue SET name = ?, kcal_per_unit = ?, unit = ?, categories = ? WHERE item_id = ?;`)
            .run(name, kcal_per_unit, unit, categories.toString(), id);
    }
    /**
     * @method getCategories
     * @returns {object} Returns an object containing all categories.
     */
    getCategories() {
        const raw_data = this.db.prepare(`SELECT category_id, name FROM Categories WHERE visible = 'T' ORDER BY Name;`).all();

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
     * @param {number} cat_id Category ID to be removed.
     * @returns {void}
     */
    removeCategory(cat_id) {
        // remove category from all items that have it assigned
        const catalogue_data = this.db.prepare("SELECT item_id, categories FROM Catalogue;").all();
        for (let item of catalogue_data) {
            let category_array = item['categories'].split(","); 
            if (category_array.includes(cat_id)) {
                 category_array.splice(category_array.indexOf(cat_id),1);
                this.db.prepare("UPDATE Catalogue SET Categories = ? WHERE item_id = ?;").run(category_array.toString(), item['item_id']);
            }
        }

        // set visibility to false
        this.db.prepare(`UPDATE Categories SET visible = 'F' WHERE category_id = ?;`).run(cat_id);
    }
    /**
     * @method editCategoryName
     * @param {number} cat_id   ID of the category to be updated.
     * @param {string} new_name New name for the category.
     * @returns {void}
     */
    editCategoryName(cat_id, new_name) {
        this.db.prepare(`UPDATE Categories SET name = ? WHERE category_id = ?;`).run(new_name, cat_id);
    }
    /**
     * @method getCategoryName
     * @param {number} cat_id Category ID to be fetched.
     * @returns {string} Category name.
     */
    getCategoryName(cat_id) {
        return(this.db.prepare("SELECT name FROM Categories WHERE category_id = ?;").all(cat_id)[0]['name'])
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
    
    getConsumed(date = this.getTodayDate()) {
        return this.db.prepare(`SELECT * FROM Consumed WHERE date = ? ORDER BY date;`).all(date);
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