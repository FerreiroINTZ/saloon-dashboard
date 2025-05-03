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

    // Fora que ele filtra para os agendamentos de Hoje
    const query = "SELECT clientes.telefone, clientes.nome, horario, servico_valor.servico FROM agendamentos JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor. id = servico_valor WHERE data_agendamento = CURRENT_DATE"
    // pesquisa os clientes com agendamento para hoje
    // Dados da pesquisa:
    // Nome do cliente
    // Horario
    // Servico
    // Telefone

    const {rows} = await db.query(query)
    reply.send(rows)
})

server.post("/getAgendamentos", async (request, reply) =>{
    
    console.log("\nAgendamentos\n")
    
    const {nome} = request.body
    const {token} = request.body

    let {servico} = request.body
    let {tempo} = request.body
    let {ordem} = request.body
    
    // caso nao tenha filtro de tempo, ou seja, valor = HOJE, entao ele nao filtra, praticamnte.
    if(!tempo){
        tempo = "0"
    }else{
        tempo = Number(tempo) * 7
    }

    if(!servico){
        servico = "servico_valor.servico"
    }

    if(ordem == "normal" || !ordem){
        // crescente
        ordem = "ASC"
        console.log("FOI!")
    }else{
        // descrescente
        console.log("DESCRESCENTE!")
        ordem = "DESC"
    }

    const queryFields = {
        columns: "clientes.telefone, clientes.nome, data_agendamento, servico_valor.servico, servico_valor.valor",
        join: "JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor. id = servico_valor",

        // CURRENT_DATE + INTERVAL: '7 days' => faz um calculo. O INTERVAL serve para adicionar masi dias.
        date: `data_agendamento <= CURRENT_DATE + INTERVAL '${tempo} days' AND data_agendamento >= CURRENT_DATE`,
        
        // ORDER BY <coluna> ASC -> ordena em ordem crescente ou alfabetica.
        ordem: `ORDER BY data_agendamento ${ordem}`,
    }

    const query = `SELECT ${queryFields.columns} FROM agendamentos ${queryFields.join} WHERE ${queryFields.date} ${queryFields.ordem}`
    
    console.log("pesquisando!")

        const {rows} = await db.query(query)
        
        console.log("rows:")
        // console.log(rows)
        console.log(ordem)

    reply.send(rows)
})

server.post("/getHistory", async (request,reply) =>{
    console.log("Get History ")
    
    const {nome} = request.body
    const {token} = request.body

    let {tempo} = request.body
    let {ordem} = request.body
    let {servico} = request.body

    if(ordem == "normal" || !ordem){
        ordem = "DESC"
    }else{
        ordem = "ASC"
    }
    
    console.log(tempo)
    if(!tempo){
        tempo = "1"
    }else{
        tempo = Number(tempo) * 7
    }

    const queryFields = {
        columns: "agendamentos.id, clientes.nome, clientes.telefone, servico_valor.servico, data_agendamento, estatus",
        join: "JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor.id = servico_valor",

        // CURRENT_DATE + INTERVAL: '7 days' => faz um calculo. O INTERVAL serve para adicionar masi dias.
        date: `data_agendamento >= CURRENT_DATE - INTERVAL '${tempo} days' AND data_agendamento < CURRENT_DATE`,
        
        // ORDER BY <coluna> ASC -> ordena em ordem crescente ou alfabetica.
        ordem: `ORDER BY data_agendamento ${ordem}`,
    }

    const query = `SELECT ${queryFields.columns} FROM agendamentos ${queryFields.join} WHERE ${queryFields.date} ${queryFields.ordem}`

    const {rows} = await db.query(query)
    // console.log(rows)
    console.log(ordem)
    console.log(tempo)

    reply.send(rows)
})

server.get("/setStatus/:id", async (request, reply) =>{
    console.log("Set estatus")
    
    const {id} = request.params
    const {estatus} = request.query
    
    console.log("dados: ")
    console.log(id)
    console.log(estatus)
    
    const query = `UPDATE agendamentos SET estatus = '${estatus}' WHERE id = ${id}`
    
    const {rows} = await db.query(query)
    
    console.log("rows: ")
    console.log(rows)

    reply.send(rows)
})

server.listen({port: 3001})