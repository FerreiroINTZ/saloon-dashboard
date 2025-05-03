"use client"

import { useEffect } from "react"
import style from "../agend_historico-filtro/filtro.module.css"
import { usePathname, useRouter } from "next/navigation"

function filtros({servicos, tempo, ordem}) {

    const router = useRouter()
    const pathName = usePathname()

    useEffect(() =>{
        console.log("propads")
    }, [])

  return (
    <nav id={style.filter}>
        <span>
            <label htmlFor="select">Servico:</label>
            <select id={`${style['select-filter']} select`} onChange={(e) => router.push(`${pathName}?${e.target.value && `servico=${e.target.value}`} ${ordem && ordem}`)}>
                <option key={"todos"} value="">Todos</option>
                {Object.keys(servicos).map((x, index) =>
                    index == 0
                    ? (
                        <>
                            <option key={x} valeu={x}>{x}</option>
                        </>
                    )
                    : <option key={x} value={x}>{x}</option>
                )}
            </select>
        </span>
        <span>
            <label htmlFor="select">Tempo:</label>
            <select 
                id={`${style['select-filter']} select`} 
                onChange={(e) => router.push(`${pathName}?${e.target.value && `tempo=${e.target.value}`}&${ordem && "ordem=reverso"}`)}>
                {[...Array(5).keys()].map(x =>
                    x == 0
                    ? (
                        <>
                            <option key={x} value="">Hoje</option>
                        </>
                    )
                    : <option key={x} value={x}>{x} {x == 1 ? "Semana" : "Semanas"}</option>
                )}
            </select>
        </span>
        <span id={style.ordem}>
            <label>Ordem:</label>
            <button 
                value="normal" 
                onClick={() => router.push(`${pathName}?${ordem ? "" : "ordem=reverso"}&${tempo && `tempo=${tempo}`}`)}>{!ordem ? "Normal" : "Reverso"}</button>
        </span>
    </nav>
  )
}

export default filtros