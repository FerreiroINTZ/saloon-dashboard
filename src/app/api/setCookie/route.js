import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request){

    const {searchParams} = new URL(request.url)

    const nome = searchParams.get("nome")
    const token = searchParams.get("token")

    console.log("API acessada!")
    console.log(nome)
    console.log(token)

    // pesquisa no servidor se tem os dados
    const nada = await fetch(`http://localhost:3001/authCookie`)
    const getAcess = await fetch(`http://localhost:3001/get/${nome}?token=${token}`)
    const {acess} = await getAcess.json()

    console.log(acess)

    // se houver dados, redireciona para o resumo e seta, os cookies usados para autenticacao.
    let response;
    if(acess){
        response = NextResponse.redirect("http://localhost:3000/resumo")
        response.cookies.set("nome", nome, {httpOnly: true, secure: false, sameSite: "lax"})
        response.cookies.set("token", token, {httpOnly: true, secure: false, sameSite: "lax"})
    }else{
        response = NextResponse.redirect("http://localhost:3000/acessoNegado")
    }

    
    return response
}