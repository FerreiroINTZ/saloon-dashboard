"use client"

import { useEffect } from "react"
import style from "../agend_historico-filtro/filtro.module.css"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function filtros({servicos, tempo, ordem}) {

    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const handleQueryParameters = (key, value) =>{
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        console.log(key)
        console.log(value)
        router.push(`${pathName}?${params.toString()}`)
    }

    useEffect(() =>{
        console.log("propads")
    }, [])

  return (
    <nav className={style.filter}>
        <span>
            <label htmlFor="select">Servico:</label>
            <select id={`${style['select-filter']} select`} name="servico" onChange={(e) => handleQueryParameters(e.target.name, e.target.value)}>
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
                id={`${style['select-filter']} select`}  name="tempo" onChange={(e) => handleQueryParameters(e.target.name, e.target.value)}>
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
                value={ordem ? null : "reverso"} name="ordem" onClick={(e) => handleQueryParameters(e.target.name, e.target.value)}>{!ordem ? "Normal" : "Reverso"}</button>
        </span>
    </nav>
  )
}

export default filtros