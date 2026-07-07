const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { db } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const ROOT_DIR = path.join(__dirname, '..');
const UPLOAD_DIR = path.join(ROOT_DIR, 'backend', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const original = file.originalname.replace(/[^a-z0-9.\-_]/gi, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + original);
  }
});

const upload = multer({ storage });

// Serve uploaded files (for iframe preview)
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// REGISTRO CASO - POST
app.post('/api/casos', upload.single('archivo'), (req, res) => {
  try {
    const {
      promovente,
      demandado,
      juzgado,
      no_expediente,
      municipio
    } = req.body;

    if (!promovente || !demandado || !juzgado || !municipio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const archivo_path = req.file
      ? '/uploads/' + path.basename(req.file.path)
      : null;

    const stmt = db.prepare(`
      INSERT INTO casos (promovente, demandado, juzgado, no_expediente, municipio, archivo_path)
      VALUES (@promovente, @demandado, @juzgado, @no_expediente, @municipio, @archivo_path)
    `);

    const info = stmt.run({
      promovente,
      demandado,
      juzgado,
      no_expediente: no_expediente || null,
      municipio,
      archivo_path
    });

    res.json({ ok: true, id: info.lastInsertRowid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

// REGISTRO CASO - GET por no_expediente (para solicitudregistro)
app.get('/api/casos', (req, res) => {
  try {
    const no_expediente = (req.query.no_expediente || '').trim();
    if (!no_expediente) {
      return res.status(400).json({ error: 'Se requiere no_expediente' });
    }

    const rows = db
      .prepare('SELECT * FROM casos WHERE no_expediente = ? ORDER BY id DESC')
      .all(no_expediente);

    res.json({ ok: true, count: rows.length, casos: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

// REGISTRO EXPEDIENTE - POST
app.post('/api/expedientes', (req, res) => {
  try {
    const {
      nombre_completo,
      fecha,
      hora,
      etiqueta,
      asunto
    } = req.body || {};

    if (!nombre_completo || !fecha || !hora || !etiqueta || !asunto) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const stmt = db.prepare(`
      INSERT INTO expedientes (nombre_completo, fecha, hora, etiqueta, asunto)
      VALUES (@nombre_completo, @fecha, @hora, @etiqueta, @asunto)
    `);

    const info = stmt.run({ nombre_completo, fecha, hora, etiqueta, asunto });
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});

