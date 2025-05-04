"use client"

import style from "./actionsBTNs.module.css"
import { useRouter } from "next/navigation"

function BTNs({id}) {
  const router = useRouter()

  async function changeState(vall){
    console.log("Mudancas serao feitas")
    console.log(vall)
    console.log(id)
    const response = await fetch(`http://localhost:3001/setStatus/${id}?estatus=${vall}`)
    console.log("servicor acessado")
    
    const data = await response.json()
    console.log("data: ")
    console.log(data)
    
    router.refresh()
  }

  return (
    <div className={style["actBTNs"]}>
      <button 
        className={style["actBTN-imgs"]} 
        style={{background: "green"}}
        onClick={(e) => changeState('completo')}><div id={style.complete}></div></button>
      <button 
        value="cancelar"
        className={style["actBTN-imgs"]} 
        style={{background: "red"}}
        onClick={(e) => changeState('cancelado')}><div id={style.cancel}></div></button>
      <button 
        value="descosiderar"
        className={style["actBTN-imgs"]} 
        style={{background: "rgb(50, 60, 231)"}}
        onClick={(e) => changeState('agendado')}><div id={style.desconsiderar}></div></button>
    </div>
  )
}

export default BTNs