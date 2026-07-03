const fs = require('fs');
const path = require('path');
const db = require('./database');

const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

// Remove comentários e divide em comandos separados por ;
const comandos = sql
  .split(';')
  .map(c => c.trim())
  .filter(c => c.length > 0 && !c.startsWith('--'));

db.serialize(() => {
  comandos.forEach(comando => {
    db.run(comando, (err) => {
      if (err) {
        console.error('Erro ao executar comando:', err.message);
      }
    });
  });
});

console.log('Banco de dados populado com sucesso!');