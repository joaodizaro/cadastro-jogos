# 🎮 Cadastro de Jogos de Video Game

Sistema web CRUD completo desenvolvido para a disciplina de Programação II
(Sistemas de Informação - UEMG Unidade Passos).

## Tecnologias utilizadas

- **Front-end:** HTML, CSS, JavaScript puro
- **Back-end:** Node.js + Express
- **Banco de Dados:** SQLite

## Funcionalidades

- Cadastro de jogos (nome, gênero, plataforma, ano, nota)
- Listagem de todos os jogos cadastrados
- Consulta individual de um jogo
- Edição de dados de um jogo
- Exclusão de jogos
- Interface responsiva

## Como executar o projeto

### 1. Pré-requisitos
- Node.js instalado (versão 18 ou superior recomendada)

### 2. Configuração do banco de dados
O banco de dados SQLite é criado automaticamente ao iniciar o servidor
(arquivo `backend/jogos.db`). Também é fornecido o script `backend/database.sql`
que documenta e permite recriar a estrutura e os dados iniciais manualmente.

### 3. Executando o Back-end
```bash
cd backend
npm install
npm start
```
O servidor estará disponível em: `http://localhost:3000`

### 4. Executando o Front-end
Basta abrir o arquivo `frontend/index.html` diretamente no navegador
(ou usar a extensão "Live Server" do VS Code).

> Importante: o back-end precisa estar rodando para o front-end funcionar.

## Endpoints da API

| Método | Rota              | Finalidade                     | Exemplo de corpo (JSON)                                              |
|--------|--------------------|---------------------------------|------------------------------------------------------------------------|
| GET    | /api/jogos         | Lista todos os jogos            | -                                                                       |
| GET    | /api/jogos/:id     | Busca um jogo específico        | -                                                                       |
| POST   | /api/jogos         | Cadastra um novo jogo           | `{ "nome": "Elden Ring", "genero": "RPG", "plataforma": "PC", "ano": 2022, "nota": 9.5 }` |
| PUT    | /api/jogos/:id     | Atualiza um jogo existente      | `{ "nome": "Elden Ring", "genero": "RPG", "plataforma": "PS5", "ano": 2022, "nota": 9.5 }` |
| DELETE | /api/jogos/:id     | Exclui um jogo                  | -                                                                       |

### Exemplo de retorno (GET /api/jogos/1)
```json
{
  "id": 1,
  "nome": "Elden Ring",
  "genero": "RPG",
  "plataforma": "PC",
  "ano": 2022,
  "nota": 9.5
}
```

## Autor
Trabalho individual desenvolvido para fins acadêmicos.