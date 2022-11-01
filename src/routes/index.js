const {Router} = require("express")
const productosRouter = require("./productos.js")
const rutaPrincipal = Router() 

rutaPrincipal.use("/productos", productosRouter)

module.exports = rutaPrincipal