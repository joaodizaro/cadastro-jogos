# 🎮 Cadastro de Jogos de Video Game

Sistema web CRUD completo desenvolvido para a disciplina de Programação II
(Sistemas de Informação - UEMG Unidade Passos).

## Tecnologias utilizadas

- **Front-end:** HTML, CSS, JavaScript puro
- **Back-end:** Node.js + Express
- **Banco de Dados:** SQLite

## Funcionalidades

- Listagem de jogos em cards, com imagem de capa, gênero, plataforma, ano e nota
- Busca de jogos por nome (em tempo real)
- Filtro de jogos por gênero
- Cadastro de novo jogo (página própria)
- Edição de jogo existente (reaproveitando o mesmo formulário)
- Página de detalhes de cada jogo (descrição, nota, capa)
- Exclusão de jogos (na listagem e na página de detalhes)
- Interface responsiva (funciona em celular e desktop)

## Páginas do sistema

- `index.html` — Lista de jogos com busca e filtro
- `cadastro.html` — Formulário de cadastro/edição de jogo
- `detalhes.html` — Página de detalhes de um jogo específico

## Como executar o projeto

### 1. Pré-requisitos
- Node.js instalado (versão 18 ou superior recomendada)

### 2. Configuração do banco de dados
O banco de dados SQLite é criado automaticamente ao iniciar o servidor
(arquivo `backend/jogos.db`). O script `backend/database.sql` documenta
a estrutura e os dados iniciais.

Para popular o banco de dados com os dados de exemplo, rode (dentro da pasta `backend`):
```bash
node seed.js
```

### 3. Executando o Back-end
```bash
cd backend
npm install
npm start
```
O servidor estará disponível em: `http://localhost:3000`

### 4. Executando o Front-end
Abra o arquivo `frontend/index.html` diretamente no navegador, ou use um
servidor local (recomendado), por exemplo:
```bash
cd frontend
npx http-server -p 5500
```
E acesse `http://127.0.0.1:5500` no navegador.

> Importante: o back-end precisa estar rodando para o front-end funcionar.

## Endpoints da API

| Método | Rota              | Finalidade                     | Exemplo de corpo (JSON)                                              |
|--------|--------------------|---------------------------------|------------------------------------------------------------------------|
| GET    | /api/jogos         | Lista todos os jogos (aceita `?busca=` e `?genero=`) | -                                     |
| GET    | /api/jogos/:id     | Busca um jogo específico        | -                                                                       |
| POST   | /api/jogos         | Cadastra um novo jogo           | `{ "nome": "Elden Ring", "genero": "RPG", "plataforma": "PC", "ano": 2022, "nota": 9.5, "descricao": "...", "imagem_url": "..." }` |
| PUT    | /api/jogos/:id     | Atualiza um jogo existente      | `{ "nome": "Elden Ring", "genero": "RPG", "plataforma": "PS5", "ano": 2022, "nota": 9.5, "descricao": "...", "imagem_url": "..." }` |
| DELETE | /api/jogos/:id     | Exclui um jogo                  | -                                                                       |

### Exemplo de retorno (GET /api/jogos/1)
```json
{
  "id": 1,
  "nome": "Elden Ring",
  "genero": "RPG",
  "plataforma": "PC",
  "ano": 2022,
  "nota": 9.5,
  "descricao": "Um RPG de ação em mundo aberto...",
  "imagem_url": "https://exemplo.com/capa.jpg"
}
```

## Autor
Trabalho individual desenvolvido para fins acadêmicos.