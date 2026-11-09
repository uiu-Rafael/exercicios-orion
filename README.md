# exercicios-orion

Exercícios de Docker do bootcamp Orion: Dockerfile, Docker Compose, múltiplos ambientes e uma stack completa (API + banco + interface de administração).

## Estrutura

```
docker/
├── exercicio-1/       # Hello Container (Dockerfile + Compose)
├── exercicio-2/       # API + PostgreSQL com variáveis de ambiente e volume
├── exercicio-3/       # Multi-stage: ambientes dev e prod
└── exercicio-extra/   # Stack completa: API + PostgreSQL + pgAdmin
```

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **em execução** (ou Docker Engine + plugin Compose no Linux)
- Git

Confira com:

```bash
docker --version
docker compose version
```

## Regras gerais

- **Rode todos os comandos `docker compose` dentro da pasta do exercício** (onde está o arquivo `docker-compose*.yml`). Fora dela aparece o erro `no configuration file provided`.
- Os exercícios 1, 2, 3 e extra usam a **porta 3000**. Rode **um por vez** e execute `docker compose down` antes de subir o próximo.
- O arquivo `.env` **não é versionado**. Os exercícios 2, 3 e extra trazem um `.env.example` com valores de exemplo; antes de subir, crie o `.env` a partir dele:

  | Terminal | Comando |
  |---|---|
  | Linux / macOS / Git Bash | `cp .env.example .env` |
  | Windows CMD | `copy .env.example .env` |
  | PowerShell | `Copy-Item .env.example .env` |

---

## Exercício 1: Hello Container

Aplicação Node.js (Express) que responde `Hello from Docker!`, construída com um Dockerfile em imagem `node:alpine`.

**Como rodar**

```bash
cd docker/exercicio-1
docker compose up --build
```

**Como testar**

Acesse <http://localhost:3000> no navegador ou rode `curl http://localhost:3000`.
Resultado esperado: `Hello from Docker!`

**Como parar**

```bash
docker compose down
```

---

## Exercício 2: API + Banco de dados

API Node.js conectada a um PostgreSQL por meio do hostname do serviço (`db`). As credenciais vêm de variáveis de ambiente (`.env`) e os dados ficam em um volume nomeado (`pgdata`).

**Como rodar**

```bash
cd docker/exercicio-2
cp .env.example .env        # no Windows CMD: copy .env.example .env
docker compose up --build -d
```

**Rotas**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Mensagem `Hello from Docker!` |
| GET | `/health` | Status da API e do banco |
| POST | `/messages` | Grava uma mensagem (`{"text": "..."}`) |
| GET | `/messages` | Lista as mensagens gravadas |

**Como testar**

Gravar uma mensagem (escolha o comando do seu terminal):

```bash
# Linux / macOS / Git Bash
curl -X POST localhost:3000/messages -H "Content-Type: application/json" -d '{"text":"oi"}'
```

```cmd
:: Windows CMD
curl -X POST localhost:3000/messages -H "Content-Type: application/json" -d "{\"text\":\"oi\"}"
```

```powershell
# PowerShell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/messages -ContentType "application/json" -Body '{"text":"oi"}'
```

Listar:

```bash
curl localhost:3000/messages
```

**Testar a persistência dos dados**

```bash
docker compose down          # remove os containers, mantém o volume
docker compose up -d
curl localhost:3000/messages # a mensagem continua lá

docker compose down -v       # o -v apaga o volume
```

**Como parar**

```bash
docker compose down
```

---

## Exercício 3: Boas práticas + múltiplos ambientes

O mesmo projeto do exercício 2, agora com um Dockerfile **multi-stage** (estágios `dev` e `prod`) e dois arquivos Compose.

| | Dev | Prod |
|---|---|---|
| Arquivo Compose | `docker-compose.dev.yml` | `docker-compose.prod.yml` |
| Estágio do Dockerfile | `dev` (com `nodemon`) | `prod` (`npm ci --omit=dev`, usuário `node`) |
| Código-fonte | montado por volume (live reload) | copiado para a imagem, sem volume |
| Volume do banco | `pgdata_dev` | `pgdata_prod` |

**Preparação**

```bash
cd docker/exercicio-3
cp .env.example .env        # no Windows CMD: copy .env.example .env
```

**Ambiente de desenvolvimento**

```bash
docker compose -f docker-compose.dev.yml up --build
```

Para ver o live reload, edite `api/src/index.js` e salve: o `nodemon` reinicia a API automaticamente.

```bash
docker compose -f docker-compose.dev.yml down
```

**Ambiente de produção**

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Compare o tamanho das imagens com `docker images`.

```bash
docker compose -f docker-compose.prod.yml down
```

Em ambos os ambientes, a API responde em <http://localhost:3000> (veja `/health` e `/messages`). Como usam a mesma porta, derrube um antes de subir o outro.

---

## Desafio Extra: Aplicação completa

Stack com três serviços em uma rede nomeada (`backend`):

| Serviço | Imagem | Porta | Observações |
|---|---|---|---|
| `api` | build local (`api/Dockerfile`, estágio `dev`) | 3000 | código montado por volume, rota `/health` |
| `db` | `postgres:16-alpine` | interna | volume nomeado `pgdata` e healthcheck (`pg_isready`) |
| `pgadmin` | `dpage/pgadmin4` | 8080 | interface web para o banco |

A API só inicia depois que o banco está saudável (`depends_on` com `condition: service_healthy`).

**Como rodar**

```bash
cd docker/exercicio-extra
cp .env.example .env        # no Windows CMD: copy .env.example .env
docker compose up --build -d
docker compose ps           # o serviço db deve aparecer como "healthy"
```

**Como testar a API**

```bash
curl localhost:3000/health
```

Resultado esperado: `{"status":"ok","db":"up"}`

As rotas `POST /messages` e `GET /messages` funcionam como no exercício 2.

**Como acessar o banco pelo pgAdmin**

1. Abra <http://localhost:8080> e faça login com `PGADMIN_EMAIL` e `PGADMIN_PASSWORD` do `.env`.
2. Clique em **Add New Server**.
3. Na aba **General**, dê um nome qualquer (ex.: `orion`).
4. Na aba **Connection**, preencha:
   - Host name/address: `db` (o hostname do serviço, **não** `localhost`)
   - Port: `5432`
   - Username e Password: `DB_USER` e `DB_PASS` do `.env`
5. Navegue até **Databases → (seu banco) → Schemas → public → Tables → messages** para ver os dados gravados pela API.

**Como parar**

```bash
docker compose down        # mantém os volumes
docker compose down -v     # remove também os volumes (apaga os dados)
```

---

## Solução de problemas

| Mensagem / sintoma | Causa e solução |
|---|---|
| `error during connect ... dockerDesktopLinuxEngine` | O Docker Desktop não está rodando. Abra-o e aguarde "Engine running". |
| `no configuration file provided: not found` | Você não está na pasta do exercício. Entre nela com `cd`. |
| `port is already allocated` / porta 3000 em uso | Outro exercício está no ar. Rode `docker compose down` na pasta dele (ou `docker ps` para ver o que está ativo). |
| A API reclama de conexão logo após o `up` | O banco ainda está iniciando. Aguarde alguns segundos e tente de novo. |
| Live reload não dispara no Windows/macOS | O script de dev usa `nodemon -L` (polling) justamente para esse caso. Confirme que o volume `./api:/app` está montado. |