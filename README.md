# 🎬 API de Gerenciamento de Filmes - Desafio Carefy

Bem-vindo à API de Gerenciamento de Filmes! 🎥✨  
Esta aplicação permite **adicionar, listar, avaliar e organizar filmes** de maneira intuitiva e eficiente, garantindo **logs detalhados, integração com a API externa TMDB e uma arquitetura escalável**.

## 🚀 Tecnologias Utilizadas
🔹 **Node.js** + **Express** - Back-end robusto e escalável  
🔹 **MongoDB** + **Mongoose** - Banco de dados ágil e flexível  
🔹 **Swagger** - Documentação interativa para testar os endpoints  
🔹 **Jest** + **Supertest** - Testes unitários e de integração  
🔹 **Docker** - Containerização para fácil deploy  
🔹 **TMDB API** - Busca automática de informações dos filmes  
🔹 **Middleware de Logs** - Registro detalhado de todas as requisições  

---

## 📌 Funcionalidades Principais

✅ **Adicionar Filmes** - Busca automática na **TMDB API** 🔍  
✅ **Gerenciar Estados** - Organize sua lista: *A assistir → Assistido → Avaliado → Recomendado* 🌂  
✅ **Avaliação** - Notas de 0 a 5, respeitando transições lógicas 🎭  
✅ **Histórico Completo** - Registro de todas as ações no filme 📜  
✅ **Filtragem e Paginação** - Consulte filmes por estado e de forma eficiente 📊  
✅ **Segurança** - Autenticação **Basic Auth** para proteger endpoints 🔒  
✅ **Registro de Logs** - Middleware inteligente para auditoria e debugging 📁  
✅ **Testes Automatizados** - Qualidade garantida com **Jest** e **Supertest** ✅  
✅ **API Documentada** - Teste diretamente via Swagger 🛠️  

---

## 📺 Instalação e Configuração

### **1- Clone o Repositório**
```bash
git clone https://github.com/jpeccia/ListaDeFilmesAPI_carefy
cd ListaDeFilmesAPI_carefy
```

### **2- Configure as Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto e adicione:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/filmes
TMDB_API_KEY=SUA_CHAVE_TMDB
ADMIN_USER=admin
ADMIN_PASSWORD=senha123
```

### **3- Instale as Dependências**
```bash
npm install
```

### **4- Execute a API**
```bash
npm start
```
ou
```bash
nodemon ./src/server.js
```

### **5- Acesse a Documentação Swagger**
📝 **URL(Endpoint):** [/docs](http://localhost:3000/docs)  

---

## 🐳 Rodando com Docker

```bash
docker-compose up --build
```
Agora a API e o banco de dados estão rodando! 🎉

---

## 🔧 Endpoints Principais

### **🎬 Gerenciamento de Filmes**
| Método | Endpoint              | Descrição |
|--------|-----------------------|-----------|
| `POST` | `/filme`              | Adiciona um filme à lista de desejos |
| `GET`  | `/filme`              | Lista todos os filmes |
| `GET`  | `/filme/:id`          | Retorna detalhes de um filme específico |
| `PUT`  | `/filme/:id/estado`   | Atualiza o estado do filme |
| `PUT`  | `/filme/:id/avaliar`  | Avalia um filme com nota de 0 a 5 |

### **📁 Logs e Histórico**
| Método | Endpoint              | Descrição |
|--------|-----------------------|-----------|
| `GET`  | `/logs`               | Lista todos os logs registrados |
| `GET`  | `/filme/:id/historico` | Retorna histórico completo do filme |

---

## 🔎 Testes Automatizados

Execute os testes unitários e de integração:
```bash
npm test
```
Saída esperada:
```
 PASS  tests/logs.test.js
 PASS  tests/integracao.test.js
 PASS  tests/estadoFilme.test.js
 PASS  tests/logController.test.js
 PASS  tests/tmdb.test.js
Test Suites: 5 passed, 5 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        8.166 s, estimated 9 s
🎉 100% dos testes passaram! 🚀
```

---

## 🤝 Contato

📧 **E-mail:** joaootaviopeccia0@gmail.com  
🌟 **LinkedIn:** [linkedin.com/in/joao-peccia](https://www.linkedin.com/in/joao-peccia/)  
🚀 **GitHub:** [github.com/jpeccia](https://github.com/jpeccia)  

Feito com ❤️ para o desafio **Carefy**!  
```

