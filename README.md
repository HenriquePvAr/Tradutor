Sistema de Gerenciamento de Alunos / Student Management System (React+ Node.js+Sqlite)
📄 Descrição / Description

Este projeto consiste em um sistema  para gerenciamento de alunos, com cadastro, edição e exclusão de registros.
O backend é construído com Node.js, Express e SQLite3, enquanto o frontend utiliza React e Vite, com uma interface responsiva.
This project is a student management system, allowing you to register, edit, and delete student records.
The backend is built with Node.js, Express, and SQLite3, while the frontend uses React and Vite, featuring a responsive interface.

⚙️ Funcionalidades / Features

Cadastro de novos alunos / Add new students

Edição de informações existentes / Edit student information

Exclusão de alunos / Delete students

Validação de campos obrigatórios (Nome, Email, CPF) / Validation for required fields (Name, Email, CPF)

Feedback visual de sucesso e erro / Visual feedback for success and error

🛠️ Tecnologias / Technologies

Backend:
Node.js
Express
SQLite3
CORS
Frontend: React, Vite ,CSS customizado ,react-input-mask (opcional para CPF ou formatação de campos)

💻 Pré-requisitos / Prerequisites
Antes de rodar o projeto, você precisa instalar:
Node.js (versão 18 ou superior recomendada)
Download Node.js
npm (já vem com Node.js) ou yarn (opcional)

Dependências do backend:
Navegue até a pasta backend e instale:
cd backend
npm install


Isso instalará: express, cors e sqlite3.

Dependências do frontend:
Navegue até a pasta frontend e instale:

cd frontend
npm install


Isso instalará: react, react-dom, react-input-mask, vite e plugins relacionados.

🚀 Como executar / How to run
Backend

Navegue até a pasta backend:
cd backend

Inicie o servidor:
node index.js
Por padrão, a API estará disponível em http://localhost:3000.

Frontend

Navegue até a pasta frontend:
cd frontend

Inicie o servidor de desenvolvimento:
npm run dev
Por padrão, o frontend estará disponível em http://localhost:5173 (ou porta mostrada pelo Vite).

⚠️ Importante: Certifique-se de que o backend esteja rodando antes de abrir o frontend, para que a comunicação via API funcione corretamente.

🗂 Estrutura do Projeto / Project Structure
📁 sistema-gerenciamento-alunos
 ┣ 📁 backend
 ┃ ┣ index.js
 ┃ ┗ package.json
 ┣ 📁 frontend
 ┃ ┣ App.jsx
 ┃ ┣ App.css
 ┃ ┣ index.css
 ┃ ┣ main.jsx
 ┃ ┗ package.json
