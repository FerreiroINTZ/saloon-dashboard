// import style from "./historico.module.css"
import style from "./historico.module.css"
import Filtros from "../agend_historico-filtro/filtros"
import ActionsBTNs from "./actionBTNs"

async function historico({nome, token, ordem, tempo}) {

    const response = await fetch("http://localhost:3001/getHistory", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nome, token, ordem, tempo})
    })

    const historicoList = await response.json()

    const servicosFilter = []
    historicoList.map(x => servicosFilter.includes(x.servico) ? null : servicosFilter.push(x.servico))

    console.log(servicosFilter.includes(historicoList[0].servico))

    console.log("servicos: ")
    console.log(servicosFilter)

    const agora = new Date();

    // Opções para exibir o nome do mês e outros detalhes
    const opcoes = {
      weekday: 'long',  // dia da semana (ex: segunda-feira)
      month: 'long',    // mês por extenso (ex: maio)
      day: 'numeric',   // dia do mês (ex: 1)
      hour: '2-digit',  // hora (ex: 14)
      minute: '2-digit' // minuto (ex: 05)
    };
    
    // Formata a data com base no idioma (aqui: pt-BR para português do Brasil)
    const dataFormatada = agora.toLocaleString('pt-BR', opcoes);

  return (
    <main className="mains">
        <div className="title">
        <h1>Historico de Agendamentos</h1>
        <p className="today">{dataFormatada}</p>
      </div>
      <section className="sections">
        <div className="filter-list">
          <Filtros servicos={servicosFilter} ordem={ordem} section={"Ontem"}/>
          <div className="list">
            <ul id={style.ulHistory}>
              {historicoList?.map((x, index) =>
                <li key={index} style={x.estatus == "completo" ? {backgroundColor: "var(--servico-completo)"} : x.estatus == "cancelado" ? {backgroundColor: "var(--servico-incompleto)"} : null}>
                  <p className="lista-nome">{x.nome}</p>
                  <p className="lista-telefone">{x.telefone}</p>
                  <p className="lista-servico">{x.servico}</p>
                  <p className="lista-horario">{x.data_agendamento.slice(5, 10).replace(/-/, "/")}</p>
                  <ActionsBTNs id={x.id}/>
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