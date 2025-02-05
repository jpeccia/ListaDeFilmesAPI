# 1️⃣ Usar a imagem oficial do Node.js
FROM node:18

# 2️⃣ Definir diretório de trabalho dentro do container
WORKDIR /app

# 3️⃣ Copiar package.json e package-lock.json antes de copiar o código
COPY package*.json ./

# 4️⃣ Instalar dependências
RUN npm install

# 5️⃣ Copiar o restante dos arquivos
COPY . .

# 6️⃣ Expor a porta da aplicação
EXPOSE 3000

# 7️⃣ Comando para iniciar a API
CMD ["node", "src/server.js"]
