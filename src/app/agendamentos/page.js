import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Agendamentos from "./agendamentos"

export default async function resumo({searchParams}){

    const cookiesGeter = await cookies()

    const nome = cookiesGeter.get("nome")?.value
    const token = cookiesGeter.get("token")?.value
    const queryParameters = await searchParams

    const servico = queryParameters?.servico
    const tempo = queryParameters?.tempo
    const ordem = queryParameters?.ordem

    console.log("cookie")
    console.log(nome)
    console.log(token)

    const response = await fetch(`http://localhost:3001/get/${nome}?token=${token}`)
    // retorna um bojeto true ou false.
    const {acess} = await response.json()

    console.log("acess")
    console.log(acess)
    
    if(!acess){
        redirect("/acessoNegado")
    }

    return (
        <Agendamentos
            nome={nome}
            token={token}
            servico={servico}
            tempo={tempo}
            ordem={ordem}/>
    )
}