// import style from "./historico.module.css"
import style from "../agendamentos/agendamentos.module.css"
import Filtros from "../agend_historico-filtro/filtros"

async function historico({nome, token}) {

    const response = await fetch("http://localhost:3001/getHistory", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nome, token})
    })

    let historico = []
    // historico = await response.json()

    console.log(historico)
  return (
    <main className="mains">
        <div className="title">
        <h1>Historico de Agendamentos</h1>
        <p className="today">{"dataFormatada"}</p>
      </div>
      <section className="sections">
        <div className="filter-list">
          <Filtros servicos={[]} tempo={""} ordem={""}/>
          <div className="list">
            <ul>
              {historico?.map((x, index) =>
                <li key={index}>
                  <p className="lista-nome">{x.nome}</p>
                  <p className="lista-telefone">{x.telefone}</p>
                  <p className="lista-servico">{x.servico}</p>
                  <p className="lista-horario">{x.data_agendamento.slice(5, 10).replace(/-/, "/")}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default historico