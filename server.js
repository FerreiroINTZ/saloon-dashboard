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
        console.log("Acesso:")
        console.error("Aceito")
        reply.send({acess: true})
    }else{
        console.log("Acesso:")
        console.error("negado")
        reply.send({acess: false})
    }

})

server.get("/getResumo", async (request, reply) =>{
    console.log("\nResumo\n")

    const {nome} = request.query
    const {token} = request.query
    console.log(nome)
    console.log(token)

    // pesquisa os clientes com agendamento para hoje
    // Dados da pesquisa:
    // Nome do cliente
    // Horario
    // Servico
    // Telefone

    // Fora que ele filtra para os agendamentos de Hoje
    const query = "SELECT clientes.telefone, clientes.nome, horario, servico_valor.servico FROM agendamentos JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor. id = servico_valor WHERE data_agendamento <= CURRENT_DATE"

    const {rows} = await db.query(query)
    reply.send(rows)
})

server.listen({port: 3001})