import LoguinError from "../acessoNegado/page.js"
import {redirect} from "next/navigation"
import { cookies } from "next/headers.js"

export default async function page({params, searchParams}) {

    const {user} = await params
    // const {token} = await searchParams
    const {token} = await searchParams

    const cookie = await cookies()
    
    console.log("searchParams")
    console.log(token)
  
    // verifica os dados na API local e seta os cookies
    redirect(`/api/setCookie?nome=${user}&token=${token}`)

    return (
      <></>
    );
  }
  