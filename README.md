# 🎮 GameVault — Cadastro de Jogos de Video Game

Sistema web CRUD completo desenvolvido para a disciplina de Programação II
(Sistemas de Informação - UEMG Unidade Passos).

## Tecnologias utilizadas

- **Front-end:** HTML, CSS, JavaScript puro
- **Back-end:** Node.js + Express
- **Banco de Dados:** SQLite

## Modelo de dados

O sistema utiliza duas tabelas relacionadas:

- **categorias** (`id`, `nome`) — lista de gêneros/categorias de jogos (ex: Ação, RPG, Aventura)
- **jogos** (`id`, `nome`, `categoria_id`, `plataforma`, `ano`, `nota`, `descricao`, `imagem_url`) — cada jogo pertence a uma categoria, através da chave estrangeira `categoria_id`

Esse relacionamento (1 categoria → N jogos) permite manter os gêneros padronizados
e consistentes, evitando duplicidade de texto livre (ex: "RPG" vs "rpg").

## Funcionalidades

- Listagem de jogos em cards, com imagem de capa, categoria, plataforma, ano e nota
- Busca de jogos por nome (em tempo real)
- Filtro de jogos por categoria
- Cadastro de novo jogo, com seleção de categoria via dropdown e validação de campos (front-end e back-end)
- Edição de jogo existente
- Página de detalhes de cada jogo (descrição, nota, capa)
- Exclusão de jogos (na listagem e na página de detalhes)
- Ranking dos jogos ordenados por nota
- Dashboard com estatísticas gerais (total de jogos, nota média, melhor avaliado, jogos por categoria)
- Interface responsiva, com menu lateral fixo no desktop e menu retrátil (hambúrguer) no mobile
- Loading state ao carregar dados da API
- Animações sutis de transição

## Páginas do sistema

- `index.html` — Lista de jogos com busca e filtro
- `cadastro.html` — Formulário de cadastro/edição de jogo
- `detalhes.html` — Página de detalhes de um jogo específico
- `ranking.html` — Ranking dos jogos por nota
- `dashboard.html` — Estatísticas gerais da coleção
- `sobre.html` — Informações sobre o sistema

## Como executar o projeto

### 1. Pré-requisitos
- Node.js instalado (versão 18 ou superior recomendada)

### 2. Configuração do banco de dados
O banco de dados SQLite é criado automaticamente ao iniciar o servidor
(arquivo `backend/jogos.db`), incluindo as tabelas `categorias` e `jogos`.
O script `backend/database.sql` documenta a estrutura e os dados iniciais.

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

### Jogos

| Método | Rota              | Finalidade                     | Exemplo de corpo (JSON)                                              |
|--------|--------------------|---------------------------------|------------------------------------------------------------------------|
| GET    | /api/jogos         | Lista todos os jogos (aceita `?busca=` e `?categoria_id=`) | -                                     |
| GET    | /api/jogos/:id     | Busca um jogo específico        | -                                                                       |
| POST   | /api/jogos         | Cadastra um novo jogo           | `{ "nome": "Elden Ring", "categoria_id": 3, "plataforma": "PC", "ano": 2022, "nota": 9.5, "descricao": "...", "imagem_url": "..." }` |
| PUT    | /api/jogos/:id     | Atualiza um jogo existente      | `{ "nome": "Elden Ring", "categoria_id": 3, "plataforma": "PS5", "ano": 2022, "nota": 9.5, "descricao": "...", "imagem_url": "..." }` |
| DELETE | /api/jogos/:id     | Exclui um jogo                  | -                                                                       |

### Categorias

| Método | Rota              | Finalidade                     | Exemplo de corpo (JSON)         |
|--------|--------------------|---------------------------------|------------------------------------|
| GET    | /api/categorias    | Lista todas as categorias        | -                                   |
| POST   | /api/categorias    | Cadastra uma nova categoria       | `{ "nome": "Terror" }`              |

### Regras de validação (aplicadas no back-end)

- Nome do jogo e plataforma devem ter pelo menos 2 caracteres
- Categoria (`categoria_id`) é obrigatória e deve existir
- Ano deve estar entre 1970 e o ano atual + 1
- Nota (quando informada) deve estar entre 0 e 10
- Nome da categoria deve ter pelo menos 2 caracteres e ser único

### Exemplo de retorno (GET /api/jogos/1)
```json
{
  "id": 1,
  "nome": "Elden Ring",
  "categoria_id": 3,
  "categoria_nome": "RPG",
  "plataforma": "PC",
  "ano": 2022,
  "nota": 9.5,
  "descricao": "Um RPG de ação em mundo aberto...",
  "imagem_url": "https://exemplo.com/capa.jpg"
}
```

## Autor
Trabalho individual desenvolvido para fins acadêmicos.