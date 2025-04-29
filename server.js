const server = require("fastify")()
const {Pool} = require("pg")

console.log("Servidor no Ar!")

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
    let {user} = request.params
    user = user.toLowerCase()
    const {token} = request.query
    
    console.log(user)
    console.log(token)

    const query = "SELECT nome, token FROM proprietarios WHERE nome = $1 AND token = $2"

    const {rows} = await db.query(query, [user, token])

    console.log("ROWS:")
    console.log(rows)

    // como zero e false, entao se a array nao retornar nada ele nao exibe
    if(rows.length){
        reply.send({acesso: true})
    }else{
        reply.send({acesso: false})
    }

})

server.listen({port: 3001})