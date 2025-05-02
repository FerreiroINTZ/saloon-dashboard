import style from "./agendamentos.module.css"

async function agendamentos({nome, token}) {

    const response = await fetch(`http://localhost:3001/getAgendamentos?nome=${nome}&token=${token}`)

    const data = await response.json()

  return (
    <main className="mains">
        <div className="title">
        <h1>Agendamentos gerias</h1>
        <p className="today">Data</p>
      </div>
      <section className="sections">
          <div id={style["infos-container"]} className="infos-container"> 
            <h3>Informacoes:</h3>
            <div id={style["lucro-total"]}>
              <p>Lucro: <span>R${1000}</span></p>
              <p>Total: <span>{34} Trabalhos</span></p>
            </div>
            <div id={style["servico-mais-pedido_dias-livres"]}>
              <div id={style['servico-mais-pedido_container']}>
                <p id={style["servico-mais-pedido_title"]}>Servico mais Requisitado</p>
                <p id={style["servico-mais-pedido_service"]}>Servico</p>
              </div>
              <div id={style['dias-livres_container']}>
                <p id={style["dias-livres_title"]}>Dias Livres</p>
                <ul id={style["dias-livres_days"]}>
                  <li>00/00</li>
                </ul>
              </div>
            </div>
          </div>
        <div id={style["filter-list"]}>
          <nav>asasasa</nav>
          <div className="list">
            <ul>
              {data.map((x, index) =>
                <li key={index}>
                  <p className="lista-nome">{x.nome}</p>
                  <p className="lista-telefone">{x.telefone}</p>
                  <p className="lista-servico">{x.servico}</p>
                  <p className="lista-horario">{x.data_agendamento.slice(5, 10)}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default agendamentos