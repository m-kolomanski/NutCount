import path from 'path';
import fs from 'fs';
import sqlite from 'better-sqlite3';
import log from 'electron-log/main.js';

const logger = log.scope("dbmgr")

class DatabaseManager {
  constructor(db_dir) {
    this.db_dir = db_dir;
    this.db_path = path.join(this.db_dir, "nuts.db");
    logger.debug(`DatabaseManager initialized with path: ${this.db_path}`);

    this.checkDatabase();
    this.checkConfig();
  }

  checkDatabase() {
    logger.debug("Checking database at:", this.db_path);
    const db_exists = fs.existsSync(this.db_path);

    if (!db_exists) {
      fs.mkdirSync(path.dirname(this.db_path), { recursive: true });
    }

    this.db = new sqlite(this.db_path);

    if (!db_exists) {
      this.createDatabase();
    }
  }

  createDatabase() {
    logger.debug("Creating database at:", this.db_path);
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
        consumed REAL NOT NULL,
        burned REAL NOT NULL,
        deficit REAL NOT NULL
      );
    `);
  }

  checkConfig() {
    logger.silly("Checking configuration...");
  }

  fetchCatalogue(just_names = false) {
    logger.silly("Fetching catalogue data")

    const selection = just_names ? "item_id, name" : "*"

    return this.db.prepare(`SELECT ${selection} FROM Catalogue WHERE visible = 'T';`).all();
  }

  addCatalogueItem(name, kcal_per_unit, unit) {
    logger.debug(`Adding item into Ccatalogue: {name} | {kcal_per_unit} | {unit}`);
    this.db.prepare("INSERT INTO Catalogue (name, kcal_per_unit, unit) VALUES (?, ?, ?);")
      .run(name, kcal_per_unit, unit);
  }

  fetchConsumed(date) {
    logger.debug(`Fetching consumed data for {date}`);
    return this.db.prepare(`
      SELECT
        Consumed.item_id,
        Catalogue.name,
        SUM(Consumed.kcal) as total_kcal,
        SUM(Consumed.amount) as total_amount
      FROM Consumed
      LEFT JOIN Catalogue ON Consumed.item_id = Catalogue.item_id
      WHERE date = ?
      GROUP BY Consumed.item_id, Catalogue.name
    `).all(date);
  }

  addConsumedItem(date, item_id, amount) {
    logger.debug(`Adding item into Consumed: ${date} | ${amount} | ${item_id}`)
    
    const catalogue_info = this.db.prepare(`
      SELECT kcal_per_unit, unit
      FROM Catalogue
      WHERE item_id = ?
    `).get(item_id);

    let kcal;
    switch(catalogue_info.unit) {
      case "100g":
        kcal = amount * (catalogue_info.kcal_per_unit / 100);
        break;
      case "portion":
        kcal = amount * catalogue_info.kcal_per_unit;
        break;
    }

    this.db.prepare("INSERT INTO Consumed (date, amount, kcal, item_id) VALUES (?, ?, ?, ?);")
      .run(date, amount, kcal, item_id);
  }

  closeCon() {
    logger.silly("Closing connection to the database")
    this.db.close();
  }

  doSomething() {
    console.log("Something")
  }


}

export default DatabaseManager;
