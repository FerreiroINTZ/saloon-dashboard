import style from "./dashboard.module.css"
import Aside from "./aside"

function dashboard() {
  return (
    <section id={style["dashboard-section"]}>
      <Aside />
      <div id={style["aside_background_opacity"]}></div>
      <main>nada</main>
    </section>
  )
}

export default dashboard