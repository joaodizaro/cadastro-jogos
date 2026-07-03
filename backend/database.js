const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'jogos.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite (jogos.db).');
  }
});

// Cria a tabela caso não exista
db.run(`
  CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    genero TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    ano INTEGER NOT NULL,
    nota REAL
  )
`);

module.exports = db;