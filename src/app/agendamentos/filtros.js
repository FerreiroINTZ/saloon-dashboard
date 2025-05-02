"use client"

import style from "./agendamentos.module.css"
import { usePathname, useRouter } from "next/navigation"

function filtros({servicos, ordem}) {

    const router = useRouter()
    const pathName = usePathname()


  return (
    <nav id={style.filter}>
        <span>
            <label htmlFor="select">Servico:</label>
            <select id={`${style['select-filter']} select`} onChange={(e) => router.push(`${pathName}?${e.target.value && `servico=${e.target.value}`}`)}>
                {Object.keys(servicos).map((x, index) =>
                    index == 0
                    ? (
                        <>
                            <option key={"todos"} value="">Todos</option>
                            <option key={x} valeu={x}>{x}</option>
                        </>
                    )
                    : <option key={x} value={x}>{x}</option>
                )}
            </select>
        </span>
        <span>
            <label htmlFor="select">Tempo:</label>
            <select id={`${style['select-filter']} select`} onChange={(e) => router.push(`${pathName}?${e.target.value && `tempo=${e.target.value}`}`)}>
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
                onClick={() => router.push(`${pathName}?${ordem ? "" : "ordem=reverso"}`)}>{!ordem ? "Normal" : "Reverso"}</button>
        </span>
    </nav>
  )
}

export default filtros