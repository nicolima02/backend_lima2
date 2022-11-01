const {Router} = require("express")
const rutaProductos = Router()
const fs = require("fs/promises")
const path = require("path")

const filePath = path.resolve(__dirname, "../../productos.txt")

rutaProductos.get("/", async(req,res)=>{
    const productos = JSON.parse(await fs.readFile(filePath, "utf-8"))
    const objeto = {
        productos
    }
    console.log(objeto)
    res.render("lista", objeto)
})


rutaProductos.get("/:id", async(req, res)=>{
    const id = req.params.id
    const productos = JSON.parse(await fs.readFile(filePath, "utf-8"))
    const indice = productos.findIndex(unproducto => unproducto.id == id)
    
    if(indice < 0){
        return res.status(404).json(
            {
                msg: "El producto no existe"
            }
        )
    }

    res.json({
        msg:`devolviendo el producto con id ${id}`,
        data: productos[indice]
    })
})


rutaProductos.post("/", async(req,res)=>{
    const data = req.body;
    console.log(req.body);
    const fileData = await fs.readFile(filePath, "utf-8")
    const productos = JSON.parse(fileData)

    let {title, price, thumbnail} = req.body
    const id = (productos[productos.length-1].id)+1
    if(!title || !price || !thumbnail){
        return res.status(400).json({
            msg:"campos invalidos"
        })
    }

    price = parseInt(price)
    if((typeof(price) === "number")){
        const nuevoProducto = {
            title,
            price,
            thumbnail,
            id
        }

        productos.push(nuevoProducto)

        await fs.writeFile(filePath, JSON.stringify(productos, null, "\t"))

        res.status(201)
        
    }else{  
        res.status(400).json({
            msg:"campo precio invalido"
        })   
    }

    res.redirect("/productos")

})

rutaProductos.delete("/:id", async(req,res)=>{
    const id = req.params.id
    const productos = JSON.parse(await fs.readFile(filePath, "utf-8"))
    const indice = productos.findIndex(user => user.id == id)
    if(productos[indice]?.id){
        productos.splice(indice, 1)
        await fs.writeFile(filePath, JSON.stringify(productos, null, "\t"))

    res.json({
        msg: `borrando al producto con id ${id}`,
    })
    }else{
        res.status(404).json({
            msg:"El producto no fue encontrado"
        })
    }

    
})

rutaProductos.put("/:id", async(req,res)=>{
    const id = req.params.id
    let {title,price,thumbnail} = req.body
    const productos = JSON.parse(await fs.readFile(filePath, "utf-8"))
    const indice = productos.findIndex(user => user.id == id)
    if(indice < 0){
        return res.json({
            msg: "ok"
        })
    }
    const productoViejo = productos[indice]

    if(!title && !price&& !thumbnail){
        return res.status(400).json({
            msg:"campos invalidos"
        })
    }

    
    if(!title){
        title = productoViejo.title
    }

    if(!price){
        price = productoViejo.price
    }
    if(!thumbnail){
        thumbnail = productoViejo.thumbnail
    }

    const prodActualizado = {
        title,
        price,
        thumbnail,
        id: productos[indice].id
    }

    productos.splice(indice,1, prodActualizado)

    await fs.writeFile(filePath, JSON.stringify(productos, null, "\t"))
    

    res.json({
        msg: `modificando producto con id: ${id}`,
        data: prodActualizado
    })
})

module.exports = rutaProductos