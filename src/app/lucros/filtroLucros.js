"use client"

import style from "./lucros.module.css"
import { useRouter, useSearchParams, usePathname} from "next/navigation";

function filtroLucros({estado, tempo}) {

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathName = usePathname()

    function changeFilter(key, vall){
        const params = new URLSearchParams(searchParams.toString())

        params.set(key, String(vall).toLowerCase())

        console.log( key, vall)
        router.push(`${pathName}?${params.toString()}`)
    }

    console.log("typeof(tempo): ")
    console.log(typeof(tempo))
    console.log(Number(tempo) > 0 || tempo)

  return (
    <>
      <div className={style["info-container"]}>
        <label className={style.info_title}>Tempo: </label>
        <select
            value={tempo} 
            name="tempo" 
            className={style.info_data} 
            onChange={e => changeFilter(e.target.name, e.target.value)}>
          <option value={"ontem"}>Ontem</option>
          {[...Array(4).keys()].map(x=>
            <option value={x + 1}>{x + 1} {x ? "Semanas" : "Semana"}</option>
          )}
        </select>
      </div>
      <div className={style["info-container"]}>
        <label className={style.info_title}>Estado: </label>
        <select
            value={estado ? estado : "Todos"}
            name="estado" 
            className={style.info_data} 
            onChange={e => changeFilter(e.target.name, e.target.value)}>
          <option>Todos</option>
          <option value="completo">Completo</option>
          <option>Cancelado</option>
        </select>
      </div>
    </>
  );
}

export default filtroLucros;
