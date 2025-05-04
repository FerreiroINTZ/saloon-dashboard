import style from "./lucros.module.css"
import FiltroLucros from "./filtroLucros"

async function lucro({nome, token, tempo, estado}) {

  console.log(nome)
  console.log(token)

  const response = await fetch(`http://localhost:3001/lucros`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({nome, token, tempo, estado})
  })
  const lucroData = await response.json()

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

console.log(dataFormatada);

const total = lucroData.reduce((acc, vall) =>{
  console.log(vall.estatus)
  console.log(estado)
  if(!estado || estado == "todos"){
    return vall.estatus == "completo" ? acc + vall.valor : acc + 0
  }
  if(vall.estatus == "completo"){
    return acc + vall.valor
  }
  if(vall.estatus == "cancelado"){
    return acc + vall.valor
  }
}, 0)

console.log(total);
console.log(lucroData[0]);
  return (
    <main className="mains" id={style["resumo-section"]}>
      <div className="title">
        <h1>Lucro Geral</h1>
        <p className="today">{dataFormatada}</p>
      </div>
      <section className="sections">
        <div id={style["infos-wraper"]}>
          <div id={style["qtd-para-hoje_div"]} className="infos-container">
            <h3>Total:</h3>
            <p>R${estado == "cancelado" ? `-${total}` : total}</p>
          </div>
          <div id={style["others-infos"]} className="infos-container">
            <h3>Filtros:</h3>
            <FiltroLucros tempo={tempo} estado={estado}/>
            </div>
          </div>
        <div className="list">
          <h3>Servicos:</h3>
          <ul>
            {lucroData?.map((x, index) =>
              <li key={index} style={x.estatus == "completo" ? {backgroundColor: "var(--servico-completo)"} : x.estatus == "cancelado" ? {backgroundColor: "var(--servico-incompleto)"} : null}>
                <p className="lista-nome">{x.nome}</p>
                <p className="lista-telefone">{x.telefone}</p>
                <p className="lista-servico">{x.servico}</p>
                <p className="lista-horario">R${x.valor}</p>
              </li>
            )}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default lucro