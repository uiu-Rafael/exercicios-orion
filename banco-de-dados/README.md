# Banco de Dados — Exercícios Orion

## Ambiente

```bash
docker compose up -d
docker compose ps
```

![Containers rodando](exercicio-1/prints/docker-compose-ps.png)

## Exercício 1 — SQL básico

Script: [exercicio-1.sql](exercicio-1/exercicio-1.sql)

**Criação das tabelas e inserção de dados**

![Create e insert](exercicio-1/prints/01-create-e-insert.png)

**SELECT * FROM alunos**

![Select alunos](exercicio-1/prints/02-select-alunos.png)

**Teste da chave estrangeira (erro esperado)**

![Erro de FK](exercicio-1/prints/03-erro-fk.png)

## Exercício 2 — JOINs e filtros

Script: [exercicio-2.sql](exercicio-2/exercicio-2.sql)

**INNER JOIN: nome do aluno e nome do curso**

![INNER JOIN](exercicio-2/prints/01-inner-join.png)

**JOIN + WHERE: alunos do curso "Desenvolvimento Web"**

![JOIN com WHERE](exercicio-2/prints/02-join-where.png)

## Exercício 3 — MongoDB (CRUD básico)

Script: [exercicio-3.js](exercicio-3/exercicio-3.js)

**Criação da coleção `posts` e inserção dos dois documentos**

![Create collection e inserts](exercicio-3/prints/01-create-collection-e-inserts.png)

**find(): o segundo documento tem o campo `tags` e o primeiro não (schema flexível)**

![find dos posts](exercicio-3/prints/02-find-posts.png)

## Exercício 4 — MongoDB (consultas avançadas)

Script: [exercicio-4.js](exercicio-4/exercicio-4.js)

**updateOne(): adicionando `comentarios` (array de documentos)**

![updateOne com comentários](exercicio-4/prints/01-update-comentarios.png)

**find() com filtro dentro de array: posts com a tag "nosql"**

![find por tag](exercicio-4/prints/02-find-tag-nosql.png)

**find() por autor específico**

![find por autor](exercicio-4/prints/03-find-autor.png)

**Bônus: find() em documento aninhado (comentários da Maria)**

![find em documento aninhado](exercicio-4/prints/04-find-comentarios-aninhados.png)