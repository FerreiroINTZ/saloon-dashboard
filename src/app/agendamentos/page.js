import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Agendamentos from "./agendamentos"

export default async function resumo(){

    const cookiesGeter = await cookies()

    const nome = cookiesGeter.get("nome")?.value
    const token = cookiesGeter.get("token")?.value

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
        <Agendamentos nome={nome} token={token}/>
    )
}