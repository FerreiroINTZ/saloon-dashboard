const server = require("fastify")()
const {Pool} = require("pg")
const cookies = require("@fastify/cookie")
const cors = require("@fastify/cors")

console.log("Servidor no Ar!")

    server.register(cookies)

    server.register(cors, {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    })

    const db = new Pool({
        user: "postgres",
        host: "localhost",
        database: "saloon_dashboard",
        password: "2006",
        port: "5432"
    })

    const data = async () => {
        const {rows} = await db.query("SELECT CURRENT_DATE")
        console.log(rows[0])
    }

    data()

server.get("/get/:user", async (request, reply) =>{

    const {cookies} = request

    console.log("cookies: ")
    console.log(cookies)

    let {user} = request.params
    user = user.toLowerCase()
    const {token} = request.query
    
    console.log(user)
    console.log(token)

    const query = "SELECT nome, token FROM proprietarios WHERE nome = $1 AND token = $2"

    const {rows} = await db.query(query, [user, token])

    console.log("ROWS:")
    console.log(rows)

    // todas as autenticacoes sao feitas aqui
    if(rows.length){
        reply.send({acess: true})
    }else{
        reply.send({acess: false})
    }

})

server.get("/authCookie", (request, reply) =>{
    reply.send({text: "nada"})
})

server.get("/getResumo", (request, reply) =>{
    console.log("\nResumo\n")

    const {nome} = request.cookies
    console.log(nome)
    console.log(request.cookies)
    console.log(server)
    reply.send({text: nome})
})

server.listen({port: 3001})