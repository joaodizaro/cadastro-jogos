-- Script de criação e população do banco de dados
-- Cadastro de Jogos de Video Game

CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    genero TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    ano INTEGER NOT NULL,
    nota REAL
);

INSERT INTO jogos (nome, genero, plataforma, ano, nota) VALUES
('The Legend of Zelda: Breath of the Wild', 'Aventura', 'Nintendo Switch', 2017, 9.7),
('God of War', 'Ação', 'PlayStation 4', 2018, 9.6),
('Elden Ring', 'RPG', 'PC', 2022, 9.5),
('Stardew Valley', 'Simulação', 'PC', 2016, 9.0);