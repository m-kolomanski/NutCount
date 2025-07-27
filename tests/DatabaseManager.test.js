import { describe, it, expect, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs';
import sqlite from 'better-sqlite3';
const DatabaseManager = require('../src/logic/DatabaseManager.js');
const db_path = path.join(__dirname, './data')

let dbmgr;
let db_con;

describe('DatabaseManager', () => {
  it('should initialize and create a new database', () => {
    dbmgr = new DatabaseManager(db_path);

    expect(dbmgr).toBeDefined();
    expect(dbmgr.db_path).toBe(path.join(db_path, 'nuts.db'));
    expect(fs.existsSync(dbmgr.db_path)).toBe(true);

    db_con = sqlite(dbmgr.db_path);
    expect(db_con).toBeDefined();
    expect(db_con.open).toBe(true);
  });
  
  it('should create database with the correct tables', () => {
    const expected_tables = [
      'Consumed',
      'Catalogue',
      'Categories',
      'Cookbook',
      'Cookbook_Ingredients',
      'Containers',
      'Targets'
    ];
    const tables = db_con
                    .prepare("SELECT name FROM sqlite_master WHERE type='table';")
                    .all()
                    .map(table => table.name);

    expect(tables).toEqual(expect.arrayContaining(expected_tables));
  });
});

afterAll(() => {
  db_con.close();
  dbmgr.closeCon()
});
