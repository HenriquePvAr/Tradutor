// ============================
// Importação dos módulos
// ============================
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// ============================
// Inicialização do app
// ============================
const app = express();
const port = process.env.PORT || 3000;

// ============================
// Middlewares
// ============================
app.use(cors());
app.use(express.json());

// ============================
// Conexão com o banco de dados
// ============================
const db = new sqlite3.Database('./bancodedados.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }

  console.log('Conectado ao banco de dados SQLite.');

  // Criação da tabela se não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS Alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      curso TEXT,
      turno TEXT,
      cpf TEXT NOT NULL UNIQUE
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log("Tabela 'Alunos' verificada/criada com sucesso.");
    }
  });
});

// ============================
// ROTAS DA API
// ============================

// --- [GET] Listar todos os alunos ---
app.get('/alunos', (req, res) => {
  db.all('SELECT * FROM Alunos ORDER BY nome', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar alunos: ' + err.message });
    }
    res.json(rows);
  });
});

// --- [POST] Cadastrar novo aluno ---
app.post('/alunos', (req, res) => {
  const { nome, email, curso, turno, cpf } = req.body;

  if (!nome || !email || !cpf) {
    return res.status(400).json({ error: 'Os campos "nome", "email" e "cpf" são obrigatórios.' });
  }

  const sql = 'INSERT INTO Alunos (nome, email, curso, turno, cpf) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [nome, email, curso || '', turno || '', cpf], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email ou CPF já cadastrado.' });
      }
      return res.status(500).json({ error: 'Erro ao cadastrar aluno: ' + err.message });
    }

    res.status(201).json({ id: this.lastID, nome, email, curso, turno, cpf });
  });
});

// --- [DELETE] Remover aluno pelo ID ---
app.delete('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Alunos WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar aluno: ' + err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    res.json({ message: 'Aluno removido com sucesso!' });
  });
});

// --- [PUT] Atualizar aluno pelo ID ---
app.put('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, curso, turno, cpf } = req.body;

  if (!nome && !email && !curso && !turno && !cpf) {
    return res.status(400).json({
      error: 'Forneça ao menos um campo para atualizar (nome, email, curso, turno, cpf).'
    });
  }

  const fieldsToUpdate = [];
  const values = [];

  if (nome) { fieldsToUpdate.push('nome = ?'); values.push(nome); }
  if (email) { fieldsToUpdate.push('email = ?'); values.push(email); }
  if (curso) { fieldsToUpdate.push('curso = ?'); values.push(curso); }
  if (turno) { fieldsToUpdate.push('turno = ?'); values.push(turno); }
  if (cpf) { fieldsToUpdate.push('cpf = ?'); values.push(cpf); }

  values.push(id);

  const sql = `UPDATE Alunos SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email ou CPF já cadastrado para outro aluno.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar aluno: ' + err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado para atualização.' });
    }

    res.json({ message: 'Aluno atualizado com sucesso!', changes: this.changes });
  });
});

// ============================
// Inicializa o servidor
// ============================
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
