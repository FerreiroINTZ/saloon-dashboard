const server = require("fastify")()

console.log("Servidor no Ar!")

server.get("/get/:user", (request, reply) =>{
    const {user} = request.params
    const {token} = request.query
    
    console.log(user)
    console.log(token)

    if(user == "Gabriel" && token =="1234"){
        reply.send({acesso: true})
    }else{
        reply.send({acesso: false})
    }

})

server.listen({port: 3001})