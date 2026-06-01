import { useState } from 'react'

// Perguntas e opções do questionário
// Fácil de editar - basta adicionar/remover objetos neste array
const QUESTIONS = [
  {
    id: 'comprimento',
    label: 'Comprimento desejado',
    options: ['Muito curto', 'Curto', 'Médio', 'Comprido', 'Tanto faz']
  },
  {
    id: 'franja',
    label: 'Franja?',
    options: ['Sim, quero franja', 'Não, sem franja', 'Aberta (à lateral)', 'Indiferente']
  },
  {
    id: 'estilo',
    label: 'Estilo',
    options: ['Casual / descontraído', 'Formal / profissional', 'Moderno / trendy', 'Clássico']
  },
  {
    id: 'manutencao',
    label: 'Manutenção',
    options: ['Mínima (low-maintenance)', 'Moderada', 'Sem problema']
  },
  {
    id: 'tipo',
    label: 'Tipo de cabelo',
    options: ['Liso', 'Ondulado', 'Encaracolado', 'Frisado']
  }
]

export default function QuizStep({ onBack, onAnalyze }) {
  // Guarda as respostas - começa vazio {}
  const [answers, setAnswers] = useState({})

  const selectAnswer = (questionId, option) => {
    // Cria uma cópia das respostas e atualiza a pergunta selecionada
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  return (
    <div className="card">
      <h2>As tuas preferências</h2>
      <p style={{ marginBottom: '1.25rem' }}>
        Responde a algumas perguntas rápidas para personalizarmos as sugestões.
      </p>

      {/* Renderiza cada pergunta */}
      {QUESTIONS.map((q) => (
        <div key={q.id} className="q-block">
          <p className="q-label">{q.label}</p>
          <div className="chip-group">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={`chip ${answers[q.id] === opt ? 'sel' : ''}`}
                onClick={() => selectAnswer(q.id, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Voltar
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onAnalyze(answers)}
        >
          Analisar ✨
        </button>
      </div>
    </div>
  )
}
