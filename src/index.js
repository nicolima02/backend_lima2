const server = require("./services/server.js")

const puerto = 8080

server.listen(puerto, ()=>{
    console.log(`Servidor listo escuchando en el puerto ${puerto}` )
})