const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const ROOT_DIR = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT_DIR, 'database', 'expedientes.db');

// Ensure DB directory exists (it should, but just in case)
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

let db;
try {
  // If file exists but isn't a valid DB, better-sqlite3 throws SQLITE_NOTADB
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    // SQLite database header is "SQLite format 3\u0000" (16 bytes)
    const isSqlite = buf.length >= 16 && buf.slice(0, 16).toString('utf8').startsWith('SQLite format');
    if (!isSqlite) {
      console.warn('DB_PATH exists but is not a valid SQLite database. Recreating: ', DB_PATH);
      fs.unlinkSync(DB_PATH);
    }
  }
  db = new Database(DB_PATH);
} catch (e) {
  console.warn('Fallo al abrir DB existente; se recreará: ', e.message);
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  db = new Database(DB_PATH);
}

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expedientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo TEXT NOT NULL,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      etiqueta TEXT NOT NULL,
      asunto TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS casos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      promovente TEXT NOT NULL,
      demandado TEXT NOT NULL,
      juzgado TEXT NOT NULL,
      no_expediente TEXT,
      municipio TEXT NOT NULL,
      archivo_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_casos_no_expediente ON casos(no_expediente);
    CREATE INDEX IF NOT EXISTS idx_expedientes_etiqueta ON expedientes(etiqueta);
  `);
}

init();

module.exports = {
  db,
  DB_PATH
};

