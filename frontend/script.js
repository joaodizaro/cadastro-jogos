const API_URL = 'http://localhost:3000/api/jogos';

// Detecta em qual página estamos e executa o código correspondente
document.addEventListener('DOMContentLoaded', () => {
  iniciarMenuMobile();

  if (document.getElementById('listaJogos')) {
    iniciarPaginaLista();
  }
  if (document.getElementById('formJogo')) {
    iniciarPaginaCadastro();
  }
  if (document.getElementById('detalhesContainer')) {
    iniciarPaginaDetalhes();
  }
  if (document.getElementById('statsGrid')) {
    iniciarPaginaDashboard();
  }
  if (document.getElementById('rankingLista')) {
    iniciarPaginaRanking();
  }
});

/* ==================== PÁGINA: LISTA (index.html) ==================== */

async function iniciarPaginaLista() {
  const campoBusca = document.getElementById('campoBusca');
  const filtroGenero = document.getElementById('filtroGenero');

  await carregarCategoriasNoFiltro(filtroGenero);
  carregarJogos();

  campoBusca.addEventListener('input', debounce(carregarJogos, 300));
  filtroGenero.addEventListener('change', carregarJogos);
}

async function carregarCategoriasNoFiltro(selectElemento) {
  try {
    const resposta = await fetch('http://localhost:3000/api/categorias');
    const categorias = await resposta.json();

    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nome;
      selectElemento.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
  }
}

async function carregarJogos() {
  const listaJogos = document.getElementById('listaJogos');
  const mensagemVazia = document.getElementById('mensagemVazia');
  const campoBusca = document.getElementById('campoBusca');
  const filtroGenero = document.getElementById('filtroGenero');

  mostrarCarregando(listaJogos);
  mensagemVazia.style.display = 'none';

  try {
    const params = new URLSearchParams();
    if (campoBusca.value) params.append('busca', campoBusca.value);
    if (filtroGenero.value) params.append('categoria_id', filtroGenero.value);

    const resposta = await fetch(`${API_URL}?${params.toString()}`);
    const jogos = await resposta.json();

    renderizarCards(jogos, listaJogos, mensagemVazia);
  } catch (erro) {
    alert('Erro ao carregar jogos. Verifique se o back-end está rodando.');
    console.error(erro);
  }
}

function preencherFiltroGeneros(jogos, selectElemento) {
  // Só popula na primeira carga (quando não há filtro selecionado ainda)
  if (selectElemento.dataset.preenchido === 'true') return;

  const generos = [...new Set(jogos.map(j => j.genero))].sort();
  generos.forEach(genero => {
    const option = document.createElement('option');
    option.value = genero;
    option.textContent = genero;
    selectElemento.appendChild(option);
  });
  selectElemento.dataset.preenchido = 'true';
}

function renderizarCards(jogos, container, mensagemVazia) {
  container.innerHTML = '';

  if (jogos.length === 0) {
    mensagemVazia.style.display = 'block';
    return;
  }
  mensagemVazia.style.display = 'none';

  jogos.forEach(jogo => {
    const card = document.createElement('div');
    card.className = 'card-jogo';

    const imagem = jogo.imagem_url || 'https://via.placeholder.com/300x180?text=Sem+Imagem';

    card.innerHTML = `
      <a href="detalhes.html?id=${jogo.id}" class="card-link">
        <img src="${imagem}" alt="${jogo.nome}" class="card-capa" onerror="this.src='https://via.placeholder.com/300x180?text=Sem+Imagem'">
        <div class="card-corpo">
          <h3>${jogo.nome}</h3>
          <div class="card-tags">
            <span class="tag">${jogo.categoria_nome}</span>
            <span class="tag">${jogo.plataforma}</span>
            <span class="tag">${jogo.ano}</span>
          </div>
          ${jogo.nota ? `<div class="card-nota">⭐ ${jogo.nota}</div>` : ''}
        </div>
      </a>
      <div class="card-acoes" style="padding: 0 14px 14px;">
        <a href="cadastro.html?id=${jogo.id}" class="btn btn-editar">Editar</a>
        <button class="btn btn-excluir" onclick="excluirJogo(${jogo.id})">Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function excluirJogo(id) {
  if (!confirm('Tem certeza que deseja excluir este jogo?')) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!resposta.ok) {
      throw new Error('Erro ao excluir jogo');
    }
    carregarJogos();
  } catch (erro) {
    alert(erro.message);
    console.error(erro);
  }
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ==================== PÁGINA: CADASTRO/EDIÇÃO (cadastro.html) ==================== */

async function iniciarPaginaCadastro() {
  const formJogo = document.getElementById('formJogo');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  await carregarCategorias();

  if (id) {
    document.getElementById('tituloForm').textContent = 'Editar Jogo';
    document.getElementById('jogoId').value = id;
    carregarJogoParaEdicao(id);
  }

  formJogo.addEventListener('submit', salvarJogo);
}

async function carregarCategorias() {
  const select = document.getElementById('categoria_id');
  try {
    const resposta = await fetch('http://localhost:3000/api/categorias');
    const categorias = await resposta.json();

    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nome;
      select.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
  }
}

async function carregarJogoParaEdicao(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) throw new Error('Jogo não encontrado');
    const jogo = await resposta.json();

    document.getElementById('nome').value = jogo.nome;
    document.getElementById('categoria_id').value = jogo.categoria_id;
    document.getElementById('plataforma').value = jogo.plataforma;
    document.getElementById('ano').value = jogo.ano;
    document.getElementById('nota').value = jogo.nota ?? '';
    document.getElementById('descricao').value = jogo.descricao ?? '';
    document.getElementById('imagem_url').value = jogo.imagem_url ?? '';
  } catch (erro) {
    alert('Erro ao carregar dados do jogo');
    console.error(erro);
  }
}

async function salvarJogo(evento) {
  evento.preventDefault();

  limparErros();

  const nome = document.getElementById('nome').value.trim();
  const categoria_id = document.getElementById('categoria_id').value;
  const plataforma = document.getElementById('plataforma').value.trim();
  const ano = document.getElementById('ano').value;
  const nota = document.getElementById('nota').value;

  let temErro = false;
  const anoAtual = new Date().getFullYear();

  if (nome.length < 2) {
    mostrarErro('nome', 'O nome deve ter pelo menos 2 caracteres');
    temErro = true;
  }
  if (!categoria_id) {
    mostrarErro('categoria_id', 'Selecione uma categoria');
    temErro = true;
  }
  if (plataforma.length < 2) {
    mostrarErro('plataforma', 'Informe uma plataforma válida');
    temErro = true;
  }
  if (!ano || ano < 1970 || ano > anoAtual + 1) {
    mostrarErro('ano', `O ano deve estar entre 1970 e ${anoAtual + 1}`);
    temErro = true;
  }
  if (nota && (nota < 0 || nota > 10)) {
    mostrarErro('nota', 'A nota deve estar entre 0 e 10');
    temErro = true;
  }

  if (temErro) return;

  const id = document.getElementById('jogoId').value;
  const dados = {
    nome,
    categoria_id: Number(categoria_id),
    plataforma,
    ano: Number(ano),
    nota: nota ? Number(nota) : null,
    descricao: document.getElementById('descricao').value || null,
    imagem_url: document.getElementById('imagem_url').value || null
  };

  try {
    let resposta;
    if (id) {
      resposta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Erro ao salvar jogo');
    }

    window.location.href = 'index.html';
  } catch (erro) {
    alert(erro.message);
    console.error(erro);
  }
}

/* ==================== PÁGINA: DETALHES (detalhes.html) ==================== */

async function iniciarPaginaDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('detalhesContainer');

  if (!id) {
    container.innerHTML = '<p>Nenhum jogo especificado.</p>';
    return;
  }

  mostrarCarregando(container);

  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) throw new Error('Jogo não encontrado');
    const jogo = await resposta.json();

    const imagem = jogo.imagem_url || 'https://via.placeholder.com/300x400?text=Sem+Imagem';

    container.innerHTML = `
      <img src="${imagem}" alt="${jogo.nome}" class="detalhes-imagem" onerror="this.src='https://via.placeholder.com/300x400?text=Sem+Imagem'">
      <div class="detalhes-info">
        <h2>${jogo.nome}</h2>
        <div class="card-tags">
          <span class="tag">${jogo.categoria_nome}</span>
          <span class="tag">${jogo.plataforma}</span>
          <span class="tag">${jogo.ano}</span>
        </div>
        ${jogo.nota ? `<p class="card-nota">⭐ Nota: ${jogo.nota}</p>` : ''}
        <p>${jogo.descricao || 'Sem descrição cadastrada.'}</p>
        <div class="detalhes-acoes">
          <a href="cadastro.html?id=${jogo.id}" class="btn btn-editar">Editar</a>
          <button class="btn btn-excluir" onclick="excluirEIrParaLista(${jogo.id})">Excluir</button>
        </div>
      </div>
    `;
  } catch (erro) {
    container.innerHTML = '<p>Erro ao carregar detalhes do jogo.</p>';
    console.error(erro);
  }
}

async function excluirEIrParaLista(id) {
  if (!confirm('Tem certeza que deseja excluir este jogo?')) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Erro ao excluir jogo');
    window.location.href = 'index.html';
  } catch (erro) {
    alert(erro.message);
    console.error(erro);
  }
}
/* ==================== PÁGINA: DASHBOARD (dashboard.html) ==================== */

async function iniciarPaginaDashboard() {
  try {
    const resposta = await fetch(API_URL);
    const jogos = await resposta.json();

    renderizarEstatisticas(jogos);
    renderizarGeneros(jogos);
  } catch (erro) {
    console.error(erro);
  }
}

function renderizarEstatisticas(jogos) {
  const statsGrid = document.getElementById('statsGrid');

  const total = jogos.length;
  const notas = jogos.filter(j => j.nota != null).map(j => j.nota);
  const mediaNota = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : '-';
  const melhorJogo = jogos.reduce((melhor, atual) => {
    if (!melhor) return atual;
    return (atual.nota ?? 0) > (melhor.nota ?? 0) ? atual : melhor;
  }, null);
  const totalGeneros = new Set(jogos.map(j => j.categoria_nome)).size;

  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-valor">${total}</div>
      <div class="stat-label">Jogos cadastrados</div>
    </div>
    <div class="stat-card">
      <div class="stat-valor">${mediaNota}</div>
      <div class="stat-label">Nota média</div>
    </div>
    <div class="stat-card">
      <div class="stat-valor">${melhorJogo ? melhorJogo.nome : '-'}</div>
      <div class="stat-label">Melhor avaliado ${melhorJogo && melhorJogo.nota ? `(⭐ ${melhorJogo.nota})` : ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-valor">${totalGeneros}</div>
      <div class="stat-label">Gêneros diferentes</div>
    </div>
  `;
}

function renderizarGeneros(jogos) {
  const container = document.getElementById('generoLista');
  const contagem = {};

  jogos.forEach(jogo => {
    contagem[jogo.categoria_nome] = (contagem[jogo.categoria_nome] || 0) + 1;
  });

  const maxQtd = Math.max(...Object.values(contagem), 1);

  container.innerHTML = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([genero, qtd]) => `
      <div class="genero-item">
        <div class="genero-nome">${genero}</div>
        <div class="genero-barra-container">
          <div class="genero-barra" style="width: ${(qtd / maxQtd) * 100}%"></div>
        </div>
        <div class="genero-qtd">${qtd}</div>
      </div>
    `).join('');
}
/* ==================== LOADING STATE (usado em todas as páginas) ==================== */

function mostrarCarregando(container) {
  container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>
  `;
}
/* ==================== VALIDAÇÃO DE FORMULÁRIO ==================== */

function mostrarErro(campoId, mensagem) {
  const campo = document.getElementById(campoId);
  campo.classList.add('campo-erro');

  const erroExistente = campo.parentElement.querySelector('.mensagem-erro');
  if (erroExistente) erroExistente.remove();

  const erroEl = document.createElement('span');
  erroEl.className = 'mensagem-erro';
  erroEl.textContent = mensagem;
  campo.insertAdjacentElement('afterend', erroEl);
}

function limparErros() {
  document.querySelectorAll('.campo-erro').forEach(el => el.classList.remove('campo-erro'));
  document.querySelectorAll('.mensagem-erro').forEach(el => el.remove());
}
/* ==================== PÁGINA: RANKING (ranking.html) ==================== */

async function iniciarPaginaRanking() {
  const container = document.getElementById('rankingLista');
  mostrarCarregando(container);

  try {
    const resposta = await fetch(API_URL);
    const jogos = await resposta.json();

    const ordenados = jogos
      .filter(j => j.nota != null)
      .sort((a, b) => b.nota - a.nota);

    if (ordenados.length === 0) {
      container.innerHTML = '<p id="mensagemVazia">Nenhum jogo com nota cadastrada ainda.</p>';
      return;
    }

    container.innerHTML = ordenados.map((jogo, index) => {
      const imagem = jogo.imagem_url || 'https://via.placeholder.com/100x100?text=?';
      return `
        <a href="detalhes.html?id=${jogo.id}" class="ranking-item">
          <div class="ranking-posicao">${index + 1}º</div>
          <img src="${imagem}" alt="${jogo.nome}" class="ranking-capa" onerror="this.src='https://via.placeholder.com/100x100?text=?'">
          <div class="ranking-info">
            <h3>${jogo.nome}</h3>
            <div class="card-tags">
              <span class="tag">${jogo.categoria_nome}</span>
              <span class="tag">${jogo.plataforma}</span>
            </div>
          </div>
          <div class="ranking-nota">⭐ ${jogo.nota}</div>
        </a>
      `;
    }).join('');
  } catch (erro) {
    container.innerHTML = '<p>Erro ao carregar ranking.</p>';
    console.error(erro);
  }
}
/* ==================== MENU MOBILE (hambúrguer) ==================== */

function iniciarMenuMobile() {
  const btnMenu = document.getElementById('btnMenuMobile');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlayMenu');

  if (!btnMenu || !sidebar || !overlay) return;

  btnMenu.addEventListener('click', () => {
    sidebar.classList.toggle('aberta');
    overlay.classList.toggle('ativo');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('aberta');
    overlay.classList.remove('ativo');
  });
}