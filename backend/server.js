const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Função de validação de dados do jogo (regra de negócio centralizada no servidor)
function validarJogo(dados) {
  const { nome, categoria_id, plataforma, ano, nota } = dados;
  const anoAtual = new Date().getFullYear();
  const erros = [];

  if (!nome || nome.trim().length < 2) {
    erros.push('O nome deve ter pelo menos 2 caracteres');
  }
  if (!categoria_id || isNaN(categoria_id)) {
    erros.push('Selecione uma categoria válida');
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

/* ==================== ROTAS DE CATEGORIAS ==================== */

// GET - Listar todas as categorias
app.get('/api/categorias', (req, res) => {
  db.all('SELECT * FROM categorias ORDER BY nome', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// POST - Cadastrar nova categoria
app.post('/api/categorias', (req, res) => {
  const { nome } = req.body;

  if (!nome || nome.trim().length < 2) {
    return res.status(400).json({ erro: 'O nome da categoria deve ter pelo menos 2 caracteres' });
  }

  db.run('INSERT INTO categorias (nome) VALUES (?)', [nome.trim()], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ erro: 'Essa categoria já existe' });
      }
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ id: this.lastID, nome: nome.trim() });
  });
});

/* ==================== ROTAS DE JOGOS ==================== */

// GET - Listar todos os jogos (com busca e filtro opcionais)
app.get('/api/jogos', (req, res) => {
  const { busca, categoria_id } = req.query;
  let sql = `
    SELECT jogos.*, categorias.nome AS categoria_nome
    FROM jogos
    JOIN categorias ON jogos.categoria_id = categorias.id
    WHERE 1=1
  `;
  const params = [];

  if (busca) {
    sql += ' AND jogos.nome LIKE ?';
    params.push(`%${busca}%`);
  }
  if (categoria_id) {
    sql += ' AND jogos.categoria_id = ?';
    params.push(categoria_id);
  }

  sql += ' ORDER BY jogos.id DESC';

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
  const sql = `
    SELECT jogos.*, categorias.nome AS categoria_nome
    FROM jogos
    JOIN categorias ON jogos.categoria_id = categorias.id
    WHERE jogos.id = ?
  `;
  db.get(sql, [id], (err, row) => {
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
  const { nome, categoria_id, plataforma, ano, nota, descricao, imagem_url } = req.body;

  const erros = validarJogo(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join('; ') });
  }

  const sql = `INSERT INTO jogos (nome, categoria_id, plataforma, ano, nota, descricao, imagem_url)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [nome, categoria_id, plataforma, ano, nota || null, descricao || null, imagem_url || null], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ id: this.lastID, nome, categoria_id, plataforma, ano, nota, descricao, imagem_url });
  });
});

// PUT - Atualizar jogo existente
app.put('/api/jogos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, categoria_id, plataforma, ano, nota, descricao, imagem_url } = req.body;

  const erros = validarJogo(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join('; ') });
  }

  const sql = `UPDATE jogos SET nome = ?, categoria_id = ?, plataforma = ?, ano = ?, nota = ?, descricao = ?, imagem_url = ? WHERE id = ?`;
  db.run(sql, [nome, categoria_id, plataforma, ano, nota || null, descricao || null, imagem_url || null, id], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Jogo não encontrado' });
    }
    res.json({ id: Number(id), nome, categoria_id, plataforma, ano, nota, descricao, imagem_url });
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