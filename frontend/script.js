const API_URL = 'http://localhost:3000/api/jogos';

const corpoTabela = document.getElementById('corpoTabela');
const mensagemVazia = document.getElementById('mensagemVazia');
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modalTitulo');
const formJogo = document.getElementById('formJogo');

const btnNovo = document.getElementById('btnNovo');
const btnCancelar = document.getElementById('btnCancelar');

// Carrega a lista de jogos ao abrir a página
document.addEventListener('DOMContentLoaded', carregarJogos);

btnNovo.addEventListener('click', () => abrirModal());
btnCancelar.addEventListener('click', fecharModal);

formJogo.addEventListener('submit', salvarJogo);

async function carregarJogos() {
  try {
    const resposta = await fetch(API_URL);
    const jogos = await resposta.json();
    renderizarTabela(jogos);
  } catch (erro) {
    alert('Erro ao carregar jogos. Verifique se o back-end está rodando.');
    console.error(erro);
  }
}

function renderizarTabela(jogos) {
  corpoTabela.innerHTML = '';

  if (jogos.length === 0) {
    mensagemVazia.style.display = 'block';
    return;
  }
  mensagemVazia.style.display = 'none';

  jogos.forEach(jogo => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td data-label="Nome">${jogo.nome}</td>
      <td data-label="Gênero">${jogo.genero}</td>
      <td data-label="Plataforma">${jogo.plataforma}</td>
      <td data-label="Ano">${jogo.ano}</td>
      <td data-label="Nota">${jogo.nota ?? '-'}</td>
      <td data-label="Ações">
        <button class="btn-editar" onclick="editarJogo(${jogo.id})">Editar</button>
        <button class="btn-excluir" onclick="excluirJogo(${jogo.id})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

function abrirModal(jogo = null) {
  formJogo.reset();
  if (jogo) {
    modalTitulo.textContent = 'Editar Jogo';
    document.getElementById('jogoId').value = jogo.id;
    document.getElementById('nome').value = jogo.nome;
    document.getElementById('genero').value = jogo.genero;
    document.getElementById('plataforma').value = jogo.plataforma;
    document.getElementById('ano').value = jogo.ano;
    document.getElementById('nota').value = jogo.nota ?? '';
  } else {
    modalTitulo.textContent = 'Novo Jogo';
    document.getElementById('jogoId').value = '';
  }
  modal.style.display = 'flex';
}

function fecharModal() {
  modal.style.display = 'none';
}

async function salvarJogo(evento) {
  evento.preventDefault();

  const id = document.getElementById('jogoId').value;
  const dados = {
    nome: document.getElementById('nome').value,
    genero: document.getElementById('genero').value,
    plataforma: document.getElementById('plataforma').value,
    ano: Number(document.getElementById('ano').value),
    nota: document.getElementById('nota').value ? Number(document.getElementById('nota').value) : null
  };

  try {
    let resposta;
    if (id) {
      // Edição (UPDATE)
      resposta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Cadastro (CREATE)
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

    fecharModal();
    carregarJogos();
  } catch (erro) {
    alert(erro.message);
    console.error(erro);
  }
}

async function editarJogo(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    const jogo = await resposta.json();
    abrirModal(jogo);
  } catch (erro) {
    alert('Erro ao buscar jogo');
    console.error(erro);
  }
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