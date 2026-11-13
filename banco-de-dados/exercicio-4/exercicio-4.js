db = db.getSiblingDB("blog")

// 1) Adicionar comentários (array de documentos)
db.posts.updateOne(
  { titulo: "Por que usar NoSQL" },
  { $set: { comentarios: [
      { autor: "Maria", texto: "Ótimo post!" },
      { autor: "João", texto: "Muito útil." }
  ] } }
)

// 2) Posts com a tag "nosql" (consulta dentro de array)
db.posts.find({ tags: "nosql" })

// 3) Posts de um autor específico
db.posts.find({ autor: "Rafael" })

// Bônus (documento aninhado): posts com comentário da Maria
db.posts.find({ "comentarios.autor": "Maria" })