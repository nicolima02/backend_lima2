const express = require("express")
const mainRouter = require("../routes/index.js")
const { engine } = require("express-handlebars")
const  path = require("path")
const app = express()

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


const viewFolderPath = path.resolve(__dirname, "../../views")
const layoutFolderPath = `${viewFolderPath}/layouts`
const partialFolderPath = `${viewFolderPath}/partials`
const defaultLayoutPath = `${layoutFolderPath}/index.hbs`
app.use("/", mainRouter)

app.set("view engine", "hbs")
app.set("views", viewFolderPath)
app.engine("hbs", engine({
    layoutsDir: layoutFolderPath,
    extname: "hbs",
    defaultLayout: defaultLayoutPath,
    partialsDir: partialFolderPath
}))

app.get("/", async(req,res) =>{
    res.render("main", {layout: defaultLayoutPath})
})
app.get("/productos", async(req,res) =>{
    res.render("lista", {layout: defaultLayoutPath})
})

module.exports = app