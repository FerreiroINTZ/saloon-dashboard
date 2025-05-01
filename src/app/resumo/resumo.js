import style from "./resumo.module.css"

async function resumo() {

  const response = await fetch("http://localhost:3001/getResumo",{
    method: "GET",
    credentials: 'include'
  })

  const data = await response.json()

  console.log("data")
  console.log(data)

  return (
    <main id={style["resumo-section"]}>
      <h1>Resumo Para Hoje</h1>
    </main>
  )
}

export default resumo