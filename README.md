<div align="center">

# ⚡ Charnecatrónica

**Plataforma web para compra, venda, reparação e doação de equipamentos eletrónicos**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Base%20de%20dados-4169E1?logo=postgresql&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Pagamentos-635BFF?logo=stripe&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-Autenticação-EB5424?logo=auth0&logoColor=white)

📅 **Data de entrega:** junho de 2025

| 👥 Autores — Grupo 9 |
| :---: |
| Pedro Rosa · Diogo Sousa · Guilherme Almeida |
| Francisco Lopes · Laura Santos · Tomás Nogueira |

</div>

---

## 📖 Sobre o projeto

A **Charnecatrónica** é uma aplicação web que permite a clientes e funcionários de uma rede de lojas gerir todo o ciclo de vida de equipamentos eletrónicos:

- 🛒 **Comprar** equipamentos (online, com carrinho e pagamento via Stripe, ou em loja física)
- 💰 **Vender** equipamentos usados e pedir orçamentos
- 🔧 **Reparações** — pedido, diagnóstico e acompanhamento
- ❤️ **Projetos de beneficência** — doação de equipamentos a instituições
- ⭐ **Interesses** — ser notificado quando um equipamento desejado fica disponível
- 📊 **Dashboard** para funcionários, com gestão de lojas, fichas de equipamento, vendas e compras

O relatório completo encontra-se em [Relatório_PGP_final.pdf](Relatório_PGP_final.pdf).

## 🗂️ Estrutura

```
Charnecatronica/
├── api/                 # Backend — Node.js + Express (porta 9000)
│   ├── controllers/     # Lógica de cada recurso
│   ├── routes/          # Definição dos endpoints
│   ├── db.js            # Ligação ao PostgreSQL
│   └── server.js        # Ponto de entrada da API
├── projeto-grupo-9/     # Frontend — React + MUI (porta 3000)
│   ├── public/
│   └── src/
│       ├── Components/
│       ├── Context/
│       └── Pages/
├── db.sql               # Script de criação da base de dados
└── conf.env.example     # Modelo das variáveis de ambiente
```

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/pt) (inclui o `npm`)
- [PostgreSQL](https://www.postgresql.org/download/)
- Conta [Stripe](https://stripe.com) (chaves de teste) e aplicação [Auth0](https://auth0.com)

Confirma a instalação no terminal:

```bash
node -v
npm -v
psql --version
```

## 🚀 Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/pedrorosa3/Charnecatronica.git
cd Charnecatronica
```

### 2. Criar a base de dados

```bash
psql -U postgres -c "CREATE DATABASE charnecatronica;"
psql -U postgres -d charnecatronica -f db.sql
```

> 💡 No Windows, se o comando `psql` não for reconhecido, usa o caminho completo
> (ex.: `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`) ou adiciona essa pasta ao `PATH`.
> Também podes correr o `db.sql` pelo pgAdmin.

### 3. Configurar as variáveis de ambiente

Copia o ficheiro [conf.env.example](conf.env.example) para `.env` e preenche os valores:

| Variável | Descrição |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Ligação ao PostgreSQL |
| `STRIPE_SK` | Chave secreta do Stripe (backend) |
| `REACT_APP_STRIPE_PK` | Chave pública do Stripe (frontend) |
| `REACT_APP_AUTH_DOMAIN`, `REACT_APP_AUTH_CLIENTID` | Configuração do Auth0 |
| `REACT_APP_URL_HOST` | Endereço da API, ex.: `http://localhost:9000` |

> ⚠️ O ficheiro `.env` é lido em três sítios diferentes, por isso deve existir uma cópia em cada um:
> na **raiz** do projeto, em **`api/`** e em **`projeto-grupo-9/`**.

```bash
cp conf.env.example .env
cp conf.env.example api/.env
cp conf.env.example projeto-grupo-9/.env
```

### 4. Iniciar o backend (API)

```bash
cd api
npm install
npm start
```

A API fica disponível em **http://localhost:9000**.

### 5. Iniciar o frontend

Num **novo terminal**:

```bash
cd projeto-grupo-9
npm install
npm start
```

A aplicação abre automaticamente em **http://localhost:3000** 🎉

> 💡 Sempre que guardares um ficheiro, a página atualiza sozinha. Só precisas de voltar a correr `npm start` se fechares o terminal.

## 🛠️ Scripts úteis

| Pasta | Comando | Descrição |
| --- | --- | --- |
| `api/` | `npm start` | Inicia o servidor Express |
| `projeto-grupo-9/` | `npm start` | Inicia o React em modo de desenvolvimento |
| `projeto-grupo-9/` | `npm run build` | Gera a versão de produção em `build/` |
| `projeto-grupo-9/` | `npm test` | Corre os testes |

## ❓ Problemas comuns

- **`npm` não é reconhecido** → reinstala o Node.js e reabre o terminal.
- **Erro de ligação à base de dados** → confirma que o PostgreSQL está a correr e que os dados no `.env` estão corretos.
- **Porta 3000 ou 9000 ocupada** → fecha o processo que a está a usar ou aceita a porta alternativa que o React sugere.

---

<div align="center">

Feito com ❤️ pelo **Grupo 9**

</div>
