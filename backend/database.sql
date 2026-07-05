-- Script de criação e população do banco de dados
-- Cadastro de Jogos de Video Game (com relacionamento de categorias)

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    plataforma TEXT NOT NULL,
    ano INTEGER NOT NULL,
    nota REAL,
    descricao TEXT,
    imagem_url TEXT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO categorias (nome) VALUES
('Aventura'),
('Ação'),
('RPG'),
('Simulação');

INSERT INTO jogos (nome, categoria_id, plataforma, ano, nota, descricao, imagem_url) VALUES
('The Legend of Zelda: Breath of the Wild', 1, 'Nintendo Switch', 2017, 9.7, 'Explore o vasto reino de Hyrule em um mundo aberto repleto de mistérios e desafios.', 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg'),
('God of War', 2, 'PlayStation 4', 2018, 9.6, 'Kratos e seu filho Atreus embarcam em uma jornada pela mitologia nórdica.', 'https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg'),
('Elden Ring', 3, 'PC', 2022, 9.5, 'Um RPG de ação em mundo aberto criado por FromSoftware e George R. R. Martin.', 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg'),
('Stardew Valley', 4, 'PC', 2016, 9.0, 'Assuma a fazenda da sua família e construa uma nova vida no campo.', 'https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png');