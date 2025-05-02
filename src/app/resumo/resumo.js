import style from "./resumo.module.css"
import Link from "next/link"

async function resumo({nome, token}) {

  console.log(nome)
  console.log(token)

  const response = await fetch(`http://localhost:3001/getResumo?nome=${nome}&token=${token}`)

  const data = await response.json()

  console.log("data")
  // console.log(data)

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

console.log(data);
console.log(dataFormatada);


  return (
    <main className="mains" id={style["resumo-section"]}>
      <div className="title">
        <h1>Resumo Para Hoje</h1>
        <p className="today">{dataFormatada}</p>
      </div>
      <section className="sections">
        <div id={style["infos-wraper"]}>
          <div id={style["qtd-para-hoje_div"]} className="infos-container">
            <h3>Hoje:</h3>
            <p><span>{data.length}</span> {data.length > 1 ? "Clientes" : "Cliente"}</p>
          </div>
          <div id={style["others-infos"]} className="infos-container">
            <h3>Informacoes:</h3>
            <div className={style["info-container"]}>
              <p className={style.info_title}>Rendimento na semana:</p>
              <p className={style.info_data}>R${125}</p>
            </div>
            <div className={style["info-container"]}>
              <p className={style.info_title}>Clientes Atendidas:</p>
              <p className={style.info_data}>{10} Clientes</p>
            </div>
            <div className={style["info-container"]}>
              <p className={style.info_title}>Clientes Restantes:</p>
              <p className={style.info_data}>{6} Clientes</p>
            </div>
            </div>
          </div>
        <div className="list">
          <h3>Horarios:</h3>
          <ul>
            {data.map((x, index) =>
              <li key={index}>
                <p className="lista-nome">{x.nome}</p>
                <p className="lista-telefone">{x.telefone}</p>
                <p className="lista-servico">{x.servico}</p>
                <p className="lista-horario">{x.horario.slice(0, 5)}</p>
              </li>
            )}
          </ul>
          <Link href="/agendamentos">Ver agenda completa</Link>
        </div>
      </section>
    </main>
  )
}

export default resumo