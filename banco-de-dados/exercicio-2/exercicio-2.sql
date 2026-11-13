-- 1) INNER JOIN
SELECT a.nome AS aluno, c.nome_curso AS curso
FROM alunos a
INNER JOIN cursos c ON a.curso_id = c.id;

-- 2) JOIN + WHERE
SELECT a.nome AS aluno, c.nome_curso AS curso
FROM alunos a
INNER JOIN cursos c ON a.curso_id = c.id
WHERE c.nome_curso = 'Desenvolvimento Web';

-- 3) UPDATE: mover Maria para Ciência de Dados
UPDATE alunos
SET curso_id = (SELECT id FROM cursos WHERE nome_curso = 'Ciência de Dados')
WHERE nome = 'Maria Souza';

-- Conferir a mudança
SELECT a.nome AS aluno, c.nome_curso AS curso
FROM alunos a
INNER JOIN cursos c ON a.curso_id = c.id;

-- Extra: cursos sem nenhum aluno
SELECT c.nome_curso
FROM cursos c
LEFT JOIN alunos a ON a.curso_id = c.id
WHERE a.id IS NULL;