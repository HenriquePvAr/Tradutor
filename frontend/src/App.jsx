import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [turno, setTurno] = useState("");
  const [cpf, setCpf] = useState("");

  const [alunos, setAlunos] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [editandoAlunoId, setEditandoAlunoId] = useState(null); // Estado para edição

  const API_URL = "http://localhost:3000/alunos";

  const fetchAlunos = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Falha ao buscar alunos.");
      const data = await response.json();
      setAlunos(data);
    } catch (err) {
      setMensagem({ texto: "Erro ao carregar alunos: " + err.message, tipo: "erro" });
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  // --- Função para enviar formulário (cadastrar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: "", tipo: "" });

    if (!nome || !email || !cpf) {
      setMensagem({ texto: "Nome, Email e CPF são obrigatórios.", tipo: "erro" });
      return;
    }

    const alunoData = { nome, email, curso, turno, cpf };

    try {
      let response;
      if (editandoAlunoId) {
        // Atualizar aluno existente
        response = await fetch(`${API_URL}/${editandoAlunoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alunoData),
        });
      } else {
        // Criar novo aluno
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alunoData),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao salvar aluno.");

      setMensagem({
        texto: editandoAlunoId
          ? "Aluno atualizado com sucesso!"
          : `Aluno "${data.nome}" cadastrado com sucesso!`,
        tipo: "sucesso",
      });

      // Limpar formulário e estado de edição
      setNome(""); setEmail(""); setCurso(""); setTurno(""); setCpf("");
      setEditandoAlunoId(null);
      fetchAlunos();
    } catch (err) {
      setMensagem({ texto: err.message, tipo: "erro" });
      console.error(err);
    }
  };

  // --- Função para deletar aluno
  const handleDelete = async (alunoId, alunoNome) => {
    if (!window.confirm(`Deseja remover o aluno "${alunoNome}"?`)) return;
    setMensagem({ texto: "", tipo: "" });

    try {
      const response = await fetch(`${API_URL}/${alunoId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao deletar aluno.");

      setMensagem({ texto: data.message || `Aluno "${alunoNome}" removido!`, tipo: "sucesso" });
      fetchAlunos();
    } catch (err) {
      setMensagem({ texto: err.message, tipo: "erro" });
      console.error(err);
    }
  };

  // --- Função para preencher formulário com dados do aluno a editar
  const handleEditar = (aluno) => {
    setNome(aluno.nome);
    setEmail(aluno.email);
    setCurso(aluno.curso || "");
    setTurno(aluno.turno || "");
    setCpf(aluno.cpf);
    setEditandoAlunoId(aluno.id);
  };

  return (
    <div className="container">
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      <form onSubmit={handleSubmit} className="aluno-form">
        <h2>{editandoAlunoId ? "Editar Aluno" : "Adicionar Novo Aluno"}</h2>

        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>

        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div>
          <label htmlFor="curso">Curso (Opcional):</label>
          <input
            id="curso"
            type="text"
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            placeholder="Curso do aluno"
          />
        </div>

        <div>
          <label htmlFor="turno">Turno:</label>
          <select id="turno" value={turno} onChange={(e) => setTurno(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Manhã">Matutino</option>
            <option value="Tarde">Vespertino</option>
            <option value="Noite">Noturno</option>
          </select>
        </div>

        <button type="submit">{editandoAlunoId ? "Atualizar Aluno" : "Cadastrar Aluno"}</button>
      </form>

      <div className="lista-alunos">
        <h2>Alunos Cadastrados</h2>
        {alunos.length === 0 ? (
          <p>Nenhum aluno cadastrado ainda.</p>
        ) : (
          <ul>
            {alunos.map((aluno) => (
              <li key={aluno.id}>
                <div>
                  <strong>{aluno.nome}</strong> ({aluno.email}) <br />
                  <em>{aluno.curso || 'Curso não informado'}</em> - 
                  <em>{aluno.turno || 'Turno não informado'}</em> - 
                  <em>{aluno.cpf}</em>
                </div>
                <button onClick={() => handleEditar(aluno)} className="botao-editar">
                  Editar
                </button>
                <button onClick={() => handleDelete(aluno.id, aluno.nome)} className="botao-deletar">
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
