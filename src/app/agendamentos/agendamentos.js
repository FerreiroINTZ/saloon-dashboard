import style from "./agendamentos.module.css"
import Filtros from "../agend_historico-filtro/filtros"

async function agendamentos({nome, token, servico, tempo, ordem}) {

    const response = await fetch("http://localhost:3001/getAgendamentos", {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({nome, token, servico, tempo, ordem})
    })

    const data = await response.json()

    const lucro = data.reduce((acc, reducer) =>{
      return acc + reducer.valor
    }, 0)

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

    // sera usado para receber os servicos com suas quantidades
    const contagemDeTermos = {}

    for(let lista of data){
      // atribui o valor do servido a uma variavel
      const termo = lista.servico
      // cria a chave, ou soma um avlor caso ja tenha achave.
      contagemDeTermos[termo] = (contagemDeTermos[termo] || 0) + 1
    }

    // atribuia a quantidade do servicxo com maior valor no contagemDeTermos
    let maiorContagem = 0
    // recebera o valor de maior frequencia
    let termoMaisFrequente = null


    for(let termo in contagemDeTermos){
      //verifica se o termo atual e maior que "maiorContagem".
      if(contagemDeTermos[termo] > maiorContagem){
        // caso seja, atribui o novo valor a maior quantide.
        // Alem de atribuir esse termo na variavel final do termoa mias frequente.
        maiorContagem = contagemDeTermos[termo]
        termoMaisFrequente = termo
      }
    }

  return (
    <main className="mains">
        <div className="title">
        <h1>Agendamentos gerais</h1>
        <p className="today">{dataFormatada}</p>
      </div>
      <section className="sections">
          <div id={style["infos-container"]} className="infos-container"> 
            <h3>Informacoes:</h3>
            <div id={style["lucro-total"]}>
              <p>Lucro: <span>R${lucro}</span></p>
              <p>Total: <span>{data.length} Trabalhos</span></p>
            </div>
            <div id={style["servico-mais-pedido_dias-livres"]}>
              <div id={style['servico-mais-pedido_container']}>
                <p id={style["servico-mais-pedido_title"]}>Servico mais Requisitado</p>
                <p id={style["servico-mais-pedido_service"]}>{termoMaisFrequente}</p>
              </div>
              <div id={style['dias-livres_container']}>
                <p id={style["dias-livres_title"]}>Dias Livres</p>
                <ul id={style["dias-livres_days"]}>
                  <li>00/00</li>
                </ul>
              </div>
            </div>
          </div>
        <div className="filter-list">
          <Filtros servicos={contagemDeTermos} section={"Hoje"} ordem={ordem}/>
          <div className="list">
            <ul>
              {data?.map((x, index) =>
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

export default agendamentos