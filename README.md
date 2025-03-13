# 📚 BookQuest

## 📖 Sobre o Projeto

**BookQuest** é uma plataforma que recomenda livros para os usuários com base em seus interesses literários. O sistema sugere uma seleção personalizada de 5 livros por semana, utilizando APIs externas para buscar informações detalhadas sobre cada título. Além disso, os usuários podem visualizar detalhes dos livros, adicioná-los à sua lista de leitura e acessar links para compra.

## 🚀 Funcionalidades

- Cadastro e login de usuários
- Escolha de até 3 categorias literárias no momento do cadastro
- Recomendações de 5 livros semanais com base nos interesses do usuário
- Página dedicada para cada livro com detalhes, sinopse e link de compra
- Adição de livros à lista de leitura
- Interface responsiva para diversos dispositivos

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- Next.js
- React
- Tailwind CSS
- Framer Motion

### **Backend**

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Autenticação via JWT

### **APIs Integradas**

- Google Books API
- Open Library API

## 📦 Como Instalar e Executar

### 🔧 Pré-requisitos

- Node.js (versão 18+)
- PostgreSQL
- Git

### 🏗️ Passos para configuração

1. Clone o repositório:

   ```sh
   git clone https://github.com/vinecwb/bookquest.git
   ```

2. Acesse o diretório do projeto:

   ```sh
   cd bookquest
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

4. Configure o banco de dados:

   - Crie um banco no PostgreSQL
   - Copie o arquivo `.env.example` e renomeie para `.env`
   - Preencha as variáveis de ambiente, incluindo `DATABASE_URL`

5. Execute as migrações do banco:

   ```sh
   npx prisma migrate dev
   ```

6. Inicie o servidor backend:

   ```sh
   npm run dev
   ```

7. Inicie o frontend:
   ```sh
   cd frontend
   npm run dev
   ```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:5005`.

## 🎮 Como Usar

### 1️⃣ Cadastro e Login

- Acesse a tela de registro e informe nome, e-mail e senha.
- Escolha até 3 categorias literárias para personalizar suas recomendações.
- Faça login na plataforma.

### 2️⃣ Explorar Livros

- Após o login, você verá suas recomendações semanais.
- Clique em um livro para acessar sua página com mais detalhes.

### 3️⃣ Adicionar à Lista de Leitura

- Na página de detalhes do livro, clique em "Adicionar à Minha Lista" para salvá-lo.

### 4️⃣ Comprar Livros

- Acesse a página do livro e clique no botão "Comprar Livro" para ser redirecionado à Amazon.

## 🤝 Contribuição

Quer ajudar a melhorar o BookQuest? Siga estes passos:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Commit suas mudanças (`git commit -m 'Minha nova feature'`)
4. Faça push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request
