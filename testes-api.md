# Testes da API - GameVault

Testes realizados manualmente com o Thunder Client (VS Code), validando
todos os endpoints da API REST do sistema.

## 1. GET /api/jogos — Listar todos os jogos

**Requisição:** `GET http://localhost:3000/api/jogos`

**Resultado:** Status `200 OK`, retornando array de jogos em JSON, cada um
com `categoria_nome` preenchido (join com a tabela categorias).

---

## 2. POST /api/jogos — Cadastrar novo jogo

**Requisição:** `POST http://localhost:3000/api/jogos`

**Corpo enviado:**
```json
{
  "nome": "Hollow Knight",
  "categoria_id": 1,
  "plataforma": "PC",
  "ano": 2017,
  "nota": 9.2,
  "descricao": "Um metroidvania sombrio e envolvente.",
  "imagem_url": "https://upload.wikimedia.org/wikipedia/en/0/04/Hollow_Knight_first_cover_art.webp"
}
```

**Resultado:** Status `201 Created`, retornando o jogo criado com `id` gerado automaticamente.

---

## 3. GET /api/jogos/:id — Buscar jogo específico

**Requisição:** `GET http://localhost:3000/api/jogos/{id}`

**Resultado:** Status `200 OK`, retornando os dados completos do jogo, incluindo `categoria_nome`.

---

## 4. PUT /api/jogos/:id — Atualizar jogo existente

**Requisição:** `PUT http://localhost:3000/api/jogos/{id}`

**Corpo enviado:**
```json
{
  "nome": "Hollow Knight",
  "categoria_id": 1,
  "plataforma": "Nintendo Switch",
  "ano": 2017,
  "nota": 9.5,
  "descricao": "Um metroidvania sombrio e envolvente. Edição atualizada.",
  "imagem_url": "https://upload.wikimedia.org/wikipedia/en/0/04/Hollow_Knight_first_cover_art.webp"
}
```

**Resultado:** Status `200 OK`, com os campos `plataforma` e `nota` atualizados corretamente.

---

## 5. Validação — Tentativa de cadastro com dados inválidos

**Requisição:** `POST http://localhost:3000/api/jogos`

**Corpo enviado:**
```json
{
  "nome": "A",
  "categoria_id": 1,
  "plataforma": "PC",
  "ano": 3000,
  "nota": 15
}
```

**Resultado:** Status `400 Bad Request`, com mensagem de erro listando os problemas
encontrados (nome muito curto, ano fora do intervalo permitido, nota acima de 10).
Confirma que a validação de regras de negócio está corretamente centralizada no back-end.

---

## 6. DELETE /api/jogos/:id — Excluir jogo

**Requisição:** `DELETE http://localhost:3000/api/jogos/{id}`

**Resultado:** Status `200 OK`, com corpo `{"mensagem": "Jogo excluído com sucesso"}`.

---

## 7. GET /api/categorias — Listar categorias

**Requisição:** `GET http://localhost:3000/api/categorias`

**Resultado:** Status `200 OK`, retornando array com todas as categorias cadastradas.

---

## 8. POST /api/categorias — Cadastrar nova categoria

**Requisição:** `POST http://localhost:3000/api/categorias`

**Corpo enviado:**
```json
{
  "nome": "Plataforma"
}
```

**Resultado:** Status `201 Created`, retornando a categoria criada com `id` gerado.

---

## 9. GET /api/jogos/:id — Jogo inexistente

**Requisição:** `GET http://localhost:3000/api/jogos/9999`

**Resultado:** Status `404 Not Found`, com corpo `{"erro": "Jogo não encontrado"}`.

---

## Conclusão

Todos os métodos HTTP da API REST (GET, POST, PUT, DELETE) foram testados manualmente
via Thunder Client e retornaram os resultados esperados, incluindo casos de sucesso,
validação de erros (400) e recurso não encontrado (404). O sistema atende integralmente
ao requisito de disponibilizar uma API REST funcional com retorno em formato JSON.