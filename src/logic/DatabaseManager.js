import path from 'path';
import fs from 'fs';
import sqlite from 'better-sqlite3';

class DatabaseManager {
  constructor(db_dir) {
    this.db_dir = db_dir;
    this.db_path = path.join(this.db_dir, "nuts.db");
    console.log(`DatabaseManager initialized with path: ${this.db_path}`);

    this.checkDatabase();
    this.checkConfig();
  }

  checkDatabase() {
    console.log("Checking database at:", this.db_path);
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
    console.log("Creating database at:", this.db_path);
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
    console.log("Checking configuration...");
  }

  fetchCatalogue() {
    return this.db.prepare("SELECT * FROM Catalogue WHERE visible = 'T';").all();
  }

  addCatalogueItem(name, kcal_per_unit, unit) {
    this.db.prepare("INSERT INTO Catalogue (name, kcal_per_unit, unit) VALUES (?, ?, ?);")
      .run(name, kcal_per_unit, unit);
  }

  closeCon() {
    this.db.close();
  }

  doSomething() {
    console.log("Something")
  }
}

export default DatabaseManager;
