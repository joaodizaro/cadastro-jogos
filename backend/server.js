const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET - Listar todos os jogos (com busca e filtro opcionais)
app.get('/api/jogos', (req, res) => {
  const { busca, genero } = req.query;
  let sql = 'SELECT * FROM jogos WHERE 1=1';
  const params = [];

  if (busca) {
    sql += ' AND nome LIKE ?';
    params.push(`%${busca}%`);
  }
  if (genero) {
    sql += ' AND genero = ?';
    params.push(genero);
  }

  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
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

// Função de validação de dados do jogo (regra de negócio centralizada no servidor)
function validarJogo(dados) {
  const { nome, genero, plataforma, ano, nota } = dados;
  const anoAtual = new Date().getFullYear();
  const erros = [];

  if (!nome || nome.trim().length < 2) {
    erros.push('O nome deve ter pelo menos 2 caracteres');
  }
  if (!genero || genero.trim().length < 2) {
    erros.push('O gênero deve ter pelo menos 2 caracteres');
  }
  if (!plataforma || plataforma.trim().length < 2) {
    erros.push('A plataforma deve ter pelo menos 2 caracteres');
  }
  if (!ano || isNaN(ano) || ano < 1970 || ano > anoAtual + 1) {
    erros.push(`O ano deve estar entre 1970 e ${anoAtual + 1}`);
  }
  if (nota !== null && nota !== undefined && nota !== '' && (isNaN(nota) || nota < 0 || nota > 10)) {
    erros.push('A nota deve estar entre 0 e 10');
  }

  return erros;
}

// POST - Cadastrar novo jogo
app.post('/api/jogos', (req, res) => {
  const { nome, genero, plataforma, ano, nota, descricao, imagem_url } = req.body;

  const erros = validarJogo(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join('; ') });
  }

  const sql = `INSERT INTO jogos (nome, genero, plataforma, ano, nota, descricao, imagem_url)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [nome, genero, plataforma, ano, nota || null, descricao || null, imagem_url || null], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ id: this.lastID, nome, genero, plataforma, ano, nota, descricao, imagem_url });
  });
});

// PUT - Atualizar jogo existente
app.put('/api/jogos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, genero, plataforma, ano, nota, descricao, imagem_url } = req.body;

  const erros = validarJogo(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join('; ') });
  }

  const sql = `UPDATE jogos SET nome = ?, genero = ?, plataforma = ?, ano = ?, nota = ?, descricao = ?, imagem_url = ? WHERE id = ?`;
  db.run(sql, [nome, genero, plataforma, ano, nota || null, descricao || null, imagem_url || null, id], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }
    res.json({ id: Number(id), nome, genero, plataforma, ano, nota, descricao, imagem_url });
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