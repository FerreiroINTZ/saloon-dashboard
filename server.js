const server = require("fastify")();
const { Pool, types } = require("pg");
const cookies = require("@fastify/cookie");
const cors = require("@fastify/cors");

console.log("Servidor no Ar!");

server.register(cookies);

server.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
});

// types.setTypeParser(114, (val) => val);

// O OID 3802 corresponde ao tipo JSONB
// types.setTypeParser(3802, (val) => val);

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "saloon_dashboard",
  password: "2006",
  port: "5432",
  client_encoding: "UTF8",
});

db.connect().then(() => db.query("SET client_encoding  = 'UTF8';"))


const data = async () => {
  const { rows } = await db.query("SHOW CLIENT_ENCODING;");
  console.log(rows[0]);
};

data();

// autenticacao do dasboard
server.get("/get/:user", async (request, reply) => {
  const { cookies } = request;

  console.log("cookies: ");
  console.log(cookies);

  let { user } = request.params;
  user = user.toLowerCase();
  const { token } = request.query;

  console.log(user);
  console.log(token);

  const query =
    "SELECT nome, token FROM proprietarios WHERE nome = $1 AND token = $2";

  const { rows } = await db.query(query, [user, token]);

  console.log("ROWS:");
  console.log(rows);

  // todas as autenticacoes sao feitas aqui
  if (rows.length) {
    console.log("Acesso:");
    console.error("Aceito");
    reply.send({ acess: true });
  } else {
    console.log("Acesso:");
    console.error("negado");
    reply.send({ acess: false });
  }
});

// dados do resumo do dashboard
server.get("/getResumo", async (request, reply) => {
  console.log("\nResumo\n");

  const { nome } = request.query;
  const { token } = request.query;
  console.log(nome);
  console.log(token);

  const queryFilters = {
    columns:
      "clientes.telefone, clientes.nome, horario, servico_valor.servico, estatus, agendamentos.id",
    join: "JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor. id = servico_valor JOIN clientela ON clientela.id = clientela_id",
    data: "data_agendamento = CURRENT_DATE",
  };

  // Fora que ele filtra para os agendamentos de Hoje
  const query = `SELECT ${queryFilters.columns} FROM agendamentos ${queryFilters.join} WHERE ${queryFilters.data} AND clientela.poriorietario_id = ${token}`;
  // pesquisa os clientes com agendamento para hoje
  // Dados da pesquisa:
  // Nome do cliente
  // Horario
  // Servico
  // Telefone

  console.log(query);
  const { rows } = await db.query(query);
  reply.send(rows);
});

// dados de agendamentos do dashboard
server.post("/getAgendamentos", async (request, reply) => {
  console.log("\nAgendamentos\n");

  const { nome } = request.body;
  const { token } = request.body;

  let { servico } = request.body;
  let { tempo } = request.body;
  let { ordem } = request.body;

  // caso nao tenha filtro de tempo, ou seja, valor = HOJE, entao ele nao filtra, praticamnte.
  if (!tempo) {
    tempo = "0";
  } else {
    tempo = Number(tempo) * 7;
  }

  if (!servico) {
    servico = "servico_valor.servico";
  }

  if (ordem == "normal" || !ordem) {
    // crescente
    ordem = "ASC";
    console.log("FOI!");
  } else {
    // descrescente
    console.log("DESCRESCENTE!");
    ordem = "DESC";
  }

  const queryFields = {
    columns:
      "clientes.telefone, clientes.nome, data_agendamento, servico_valor.servico, servico_valor.valor",
    join: "JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor. id = servico_valor JOIN clientela ON clientela.id = clientela_id",

    // CURRENT_DATE + INTERVAL: '7 days' => faz um calculo. O INTERVAL serve para adicionar masi dias.
    date: `data_agendamento <= CURRENT_DATE + INTERVAL '${tempo} days' AND data_agendamento >= CURRENT_DATE AND clientela.proprietario_id = ${token}`,

    // ORDER BY <coluna> ASC -> ordena em ordem crescente ou alfabetica.
    ordem: `ORDER BY data_agendamento ${ordem}`,
  };

  const query = `SELECT ${queryFields.columns} FROM agendamentos ${queryFields.join} WHERE ${queryFields.date} ${queryFields.ordem}`;

  console.log("pesquisando!");

  const { rows } = await db.query(query);

  console.log("rows:");
  // console.log(rows)
  console.log(ordem);

  reply.send(rows);
});

// dados do jistorico do dashbaord
server.post("/getHistory", async (request, reply) => {
  console.log("Get History ");

  const { nome } = request.body;
  const { token } = request.body;

  let { tempo } = request.body;
  let { ordem } = request.body;
  let { servico } = request.body;

  if (ordem == "normal" || !ordem) {
    ordem = "DESC";
  } else {
    ordem = "ASC";
  }

  console.log(tempo);
  if (!tempo) {
    tempo = "1";
  } else {
    tempo = Number(tempo) * 7;
  }

  const queryFields = {
    columns:
      "agendamentos.id, clientes.nome, clientes.telefone, servico_valor.servico, data_agendamento, estatus",
    join: "JOIN clientes ON clientes.telefone = client_id JOIN servico_valor ON servico_valor.id = servico_valor JOIN clientela ON clientela.id = clientela_id",

    // CURRENT_DATE + INTERVAL: '7 days' => faz um calculo. O INTERVAL serve para adicionar masi dias.
    date: `data_agendamento >= CURRENT_DATE - INTERVAL '${tempo} days' AND data_agendamento < CURRENT_DATE AND clientela.proprietario_id = ${token}`,

    // ORDER BY <coluna> ASC -> ordena em ordem crescente ou alfabetica.
    ordem: `ORDER BY data_agendamento ${ordem}`,
  };

  const query = `SELECT ${queryFields.columns} FROM agendamentos ${queryFields.join} WHERE ${queryFields.date} ${queryFields.ordem}`;

  const { rows } = await db.query(query);
  // console.log(rows)
  console.log(ordem);
  console.log(tempo);

  reply.send(rows);
});

// muda o esatus de um agendametno, no dashboard (agendado, completo, cancelado)
server.get("/setStatus/:id", async (request, reply) => {
  console.log("Set estatus");

  const { id } = request.params;
  const { estatus } = request.query;

  console.log("dados: ");
  console.log(id);
  console.log(estatus);

  const query = `UPDATE agendamentos SET estatus = '${estatus}' WHERE id = ${id}`;

  const { rows } = await db.query(query);

  console.log("rows: ");
  console.log(rows);

  reply.send(rows);
});

// dados dos lucrso, do dashboard
server.post("/lucros", async (request, reply) => {
  console.log("\nLucros\n");

  // const {nome, token} = request.body

  let { tempo } = request.body;
  let { estado } = request.body;

  console.log("Vars: ");
  console.log(tempo);
  console.log(estado);

  if (!tempo || typeof tempo === "undefined" || tempo == "ontem") {
    console.log("Nada!");
    time = 1;
  } else {
    console.log("Tudo!");
    time = Number(tempo) * 7;
  }

  if (!estado || estado == "todos") {
    estado = "estatus != 'agendado'";
  } else {
    estado = `estatus = '${estado}'`;
  }
  console.log("Apos a mudanca: ");
  console.log(tempo);
  console.log(estado);

  const queryFilters = {
    columns: "c.nome, c.telefone, sv.servico, sv.valor, estatus",
    join: "JOIN clientes c ON c.telefone = client_id JOIN servico_valor sv ON sv.id = servico_valor JOIN clientela ON clientela.id = clientela_id",
    data: `data_agendamento <= CURRENT_DATE AND data_agendamento >= CURRENT_DATE - INTERVAL '${time} days'`,
  };

  const query = `SELECT ${queryFilters.columns} FROM agendamentos ${queryFilters.join} WHERE ${estado} AND ${queryFilters.data} AND clientela.proprietario_id = ${token}`;

  console.log(query);

  const { rows } = await db.query(query);

  console.log("rows: ");
  console.log(rows[0]);

  reply.send(rows);
});

// dados dos dias livres, dos agendamentos do dashboard
server.get("/getFreeDays", async (request, reply) => {
  console.log("\nGet Free Days\n");

  let tempoBruto = request.query?.tempo;
  let tempo = Number(tempoBruto);

  console.log("tempo bruto:", tempoBruto);
  console.log("convertido:", tempo);

  if (isNaN(tempo) || tempo <= 0) {
    tempo = 1;
  }

  if (tempo > 1) {
    tempo *= 7;
  }

  console.log("tempo final (em dias):", tempo);

  const query = `
            WITH dias AS (
                SELECT generate_series(
                    CURRENT_DATE, 
                    CURRENT_DATE + INTERVAL '${tempo} days', 
                    INTERVAL '1 day'
                )::date AS dia
            )
            SELECT d.dia
            FROM dias d
            LEFT JOIN agendamentos a ON d.dia = a.data_agendamento
            WHERE a.data_agendamento IS NULL
        `;

  const { rows } = await db.query(query);

  console.log("rows: ");
  console.log(rows);

  reply.send(rows);
});

// recupera os dados da landing page do salao
server.get("/getClientToken/:token", async (request, reply) => {
  const { token } = request.params;
  console.log("token: ");
  console.log(token);

  const query ="SELECT content, p.modelo, p.salao FROM site_content JOIN proprietarios p ON p.client_token = proprietario_client_token WHERE proprietario_client_token = $1";
  // const query ="SELECT texto FROM site_content WHERE id = 10";

  const { rows } = await db.query(query, [token]);
  // const { rows } = await db.query(query);

  console.log(rows[0]);
  if(rows[0] === undefined){
    console.log("dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd");
    reply.header("Content-Type", "application/json; charset=utf-8").code(300).send(rows[0]);
  }
  console.log("=====================================");

  reply.header("Content-Type", "application/json; charset=utf-8").send(rows[0]);
});

// recolhe os dadaos para a rota de agendamentos
server.get("/getClientToken/:token/agendamentos", async (request, reply) =>{
  const {token} = request.params

  // pega os servisoe e seus vaolores relacionado ao token do client, alem do nome e logo do salao.
  const queryString = `SELECT servico, valor FROM servico_valor JOIN proprietarios p ON (SELECT token FROm proprietarios WHERE client_token = $1) = proprietario_id WHERE $1 = p.client_token;`

  const {rows} = await db.query(queryString, [token])

  reply.send({rows})
})

// responsavel por salvar os dados do usuario, caso nao exista.
server.post("/getClientToken/:token/agendamentos/getClientData", async (request, reply) =>{
  const {token} = request.params
  // const {nome, email, uid} = request.body
  const {name, email, uid, phoneNumber} = JSON.parse(request.body)

  const {rows: verifiUserExist} = await db.query("SELECT id FROM clientes WHERE id = $1", [token])

  console.log("verifiUserExist: ")
  console.log(verifiUserExist)

  if(!verifiUserExist.length){
    try{
      const insertUserQuery = "INSERT INTO clientes(id, nome, email) VALUES ($1, $2, $3) RETURNING *"
  
      const {rows: userInserted} = await db.query(insertUserQuery, [token, name, email])
  
      console.log(userInserted)

    }catch (e){
      console.log("Deu algum eror na hora de salvar!")
      console.log(e)
    }
  }

  if(!phoneNumber){
    // code 301 indica que o telefone precisa ser cadastrado
    console.log("skodsidjwi0fj w8ehfwefhuw9e ehuw9fhewufhnwuf")
    reply.send({text: "Need to write Phone number"})
  }else{
    const queryAgendamentosFeitos = "SELECT data_agendamento, horario, sv.servico, sv.valor FROM agendamentos JOIN servico_valor sv ON sv.id = servico_valor WHERE client_id = $1;"
  
    const {rows: agendamentosFeitos} = await db.query(queryAgendamentosFeitos, [token])
    
    console.log("agendamentosFeitos: ")
    console.log(agendamentosFeitos)
  
    // code 301 indica que o telefone NAO precisa ser cadastrado
    reply.send(agendamentosFeitos)
  }
  
})

// responsavel por atualizar o numero de telefone do usuario
server.get("/getClientToken/:token/agendamentos/changePhoneNumber/:telefone", async (request, reply) =>{
  const {token} = request.params
  const {telefone} = request.params

  const queryString = "UPDATE clientes SET telefone = $1 WHERE id = $2 RETURNING *"
  const {rows} = await db.query(queryString, [telefone, token])

  console.log("Dados Atualizados: ")
  console.log(rows)

  reply.send(rows[0])
})

// rota responsavel por buscar os agendamentos
server.get("/getClientToken/:token/agendamentos/getAgendamentos/", async (request, reply) =>{
  const {token} = request.params

  const queryString = "SELECT data_agendamento, horario, sv.servico, sv.valor FROM agendamentos JOIN servico_valor sv ON sv.id = servico_valor WHERE client_id = $1"
  const {rows: agendamentos} = await db.query(queryString, [token])

  console.log(agendamentos)

  reply.send(agendamentos)
})

// salva o agendamente e/ou cria o usuario, com base no telefone
server.post("/getClientToken/:token/agendamentos/send", async (request, reply) =>{
  const {token} = request.params
  const fields = JSON.parse(request.body)

  // cria o agendamento
  const insertAgendemtnoQuery = "INSERT INTO agendamentos(data_agendamento, horario, servico_valor, client_id) VALUES ($1, $2, (SELECT id FROM servico_valor WHERE servico = $3), $4,)"
  let agendametoInserido = await db.query(createUserQuery, [fields.dia, fields.horario, fields.servico, fields.telefone])

  console.log("fields: ")
  console.log(fields)
  console.log(agendametoInserido.rows)
  reply.send(agendametoInserido.rows)
})

server.listen({ port: 3001 });
