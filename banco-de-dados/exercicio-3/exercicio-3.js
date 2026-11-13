db = db.getSiblingDB("blog")

db.createCollection("posts")

db.posts.insertOne({
  titulo: "Meu primeiro post",
  autor: "Rafael",
  conteudo: "Olá, mundo!"
})

// Schema flexível: este documento tem o campo extra "tags"
db.posts.insertOne({
  titulo: "Por que usar NoSQL",
  autor: "Rafael",
  conteudo: "Bancos NoSQL têm schema flexível.",
  tags: ["nosql", "flexivel"]
})

db.posts.find()