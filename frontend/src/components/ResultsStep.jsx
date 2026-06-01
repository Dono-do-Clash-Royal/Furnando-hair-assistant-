// Este componente mostra o loading enquanto a IA analisa,
// e depois os resultados quando estão prontos
export default function ResultsStep({ loading, results, onReset }) {

  // Enquanto está a carregar, mostra o spinner
  if (loading) {
    return (
      <div className="card loading">
        <div className="spinner" />
        <p>A analisar o formato do rosto...</p>
        <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Pode demorar alguns segundos</p>
      </div>
    )
  }

  // Se houve erro, mostra a mensagem
  if (results?.error) {
    return (
      <div className="card">
        <div className="error">{results.error}</div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onReset}>
            ← Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Se ainda não há resultados, não mostra nada
  if (!results) return null

  return (
    <div>
      <div className="card">
        <h2>As tuas sugestões</h2>
        <p style={{ marginBottom: '1rem' }}>
          Com base na análise do teu rosto e preferências.
        </p>

        {/* Badge com o formato do rosto */}
        <div className="face-badge">
          Formato do rosto: {results.formato_rosto}
        </div>
        <p style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
          {results.descricao_formato}
        </p>

        {/* Lista de cortes recomendados */}
        {results.cortes?.map((corte, i) => (
          <div
            key={i}
            className={`haircut-card ${i === 0 ? 'rank-best' : ''}`}
          >
            {/* Badge do ranking */}
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: 4,
              color: i === 0 ? '#a07000' : '#888'
            }}>
              {i === 0 ? '🥇 Melhor escolha' : i === 1 ? '2.ª opção' : '3.ª opção'}
            </div>

            <h3>{corte.nome}</h3>
            <p className="why">{corte.porque}</p>

            {/* Tags e dificuldade */}
            <div className="tags">
              {corte.tags?.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              <span className="tag">{corte.dificuldade}</span>
            </div>
          </div>
        ))}

        {/* Dica geral */}
        <div className="tip-box">
          <strong>💡 Dica pessoal: </strong>{results.dica_geral}
        </div>
      </div>

      <button className="btn btn-secondary" onClick={onReset}>
        ← Analisar outra foto
      </button>
    </div>
  )
}
