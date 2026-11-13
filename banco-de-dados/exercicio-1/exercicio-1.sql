CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nome_curso VARCHAR(100) NOT NULL
);

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    curso_id INTEGER REFERENCES cursos(id)
);

INSERT INTO cursos (nome_curso) VALUES
    ('Desenvolvimento Web'),
    ('Ciência de Dados'),
    ('Engenharia de IA');

INSERT INTO alunos (nome, email, curso_id) VALUES
    ('João Silva', 'joao@email.com', 1),
    ('Maria Souza', 'maria@email.com', 1),
    ('Carlos Lima', 'carlos@email.com', 2),
    ('Ana Costa', 'ana@email.com', 2);

SELECT * FROM alunos;

