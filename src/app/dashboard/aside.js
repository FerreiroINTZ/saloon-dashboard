import style from "./dashboard.module.css"

function aside() {
  return (
    <aside>
        <p className={style["aside-sections"]}>Resumo Geral</p>
        <p className={style["aside-sections"]}>Agendamentos</p>
        <p className={style["aside-sections"]}>Historico</p>
        <p className={style["aside-sections"]}>Lucros Gerais</p>
      </aside>
  )
}

export default aside