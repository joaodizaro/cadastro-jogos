const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET - Listar todos os jogos
app.get('/api/jogos', (req, res) => {
  db.all('SELECT * FROM jogos ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar um jogo por ID
app.get('/api/jogos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM jogos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }
    res.json(row);
  });
});

// POST - Cadastrar novo jogo
app.post('/api/jogos', (req, res) => {
  const { nome, genero, plataforma, ano, nota } = req.body;

  if (!nome || !genero || !plataforma || !ano) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, genero, plataforma, ano' });
  }

  const sql = 'INSERT INTO jogos (nome, genero, plataforma, ano, nota) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [nome, genero, plataforma, ano, nota || null], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ id: this.lastID, nome, genero, plataforma, ano, nota });
  });
});

// PUT - Atualizar jogo existente
app.put('/api/jogos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, genero, plataforma, ano, nota } = req.body;

  if (!nome || !genero || !plataforma || !ano) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, genero, plataforma, ano' });
  }

  const sql = `UPDATE jogos SET nome = ?, genero = ?, plataforma = ?, ano = ?, nota = ? WHERE id = ?`;
  db.run(sql, [nome, genero, plataforma, ano, nota || null, id], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }
    res.json({ id: Number(id), nome, genero, plataforma, ano, nota });
  });
});

// DELETE - Excluir jogo
app.delete('/api/jogos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM jogos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }
    res.json({ mensagem: 'Jogo excluído com sucesso' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});