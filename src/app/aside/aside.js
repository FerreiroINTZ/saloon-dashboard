import style from "./aside.module.css"
import Link from "next/link"

function aside() {
  return (
    <div id={style["dashboard-section"]}>
      <aside>
          <Link href="/resumo" className={style["aside-sections"]}>Resumo Geral</Link>
          <Link href="/nada" className={style["aside-sections"]}>Agendamentos</Link>
          <Link href="/nada" className={style["aside-sections"]}>Historico</Link>
          <Link href="/nada" className={style["aside-sections"]}>Lucros Gerais</Link>
        </aside>
        <div id={style["aside_background_opacity"]}></div>
    </div>
  )
}

export default aside