const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function initDb(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW())`);
      console.log('Banco pronto');
      return;
    } catch (err) {
      console.log(`Banco indisponível (${i}/${retries})...`);
      await sleep(2000);
    }
  }
  throw new Error('Não conectou ao banco');
}

app.get('/', (req, res) => res.send('Hello from Docker!'));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up' });
  } catch {
    res.status(503).json({ status: 'error', db: 'down' });
  }
});

app.post('/messages', async (req, res) => {
  const { rows } = await pool.query(
    'INSERT INTO messages (text) VALUES ($1) RETURNING *', [req.body.text]);
  res.status(201).json(rows[0]);
});

app.get('/messages', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM messages ORDER BY id');
  res.json(rows);
});

initDb()
  .then(() => app.listen(3000, () => console.log('API na porta 3000')))
  .catch((e) => { console.error(e); process.exit(1); });