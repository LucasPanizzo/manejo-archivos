const fs = require('fs')
const path = './products.json'

class ProductManager {
    constructor(){
        this.path = path
    }
    async getProducts() {
        try {
            if (fs.existsSync(path)) {
                const products = await fs.promises.readFile(path,'utf-8')
                return JSON.parse(products)
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
    async addProduct(title,description,price,thumbnail,code,stock) {
        try {
            if(!title || !description || !price || !thumbnail || !code || !stock){
                console.log('Error: Debes rellenar todos los campos.')
            } else{
                const productsList = await this.getProducts()
                if(await productsList.find((el) => el.code === code)){
                    console.log(`El producto con el code: ${code} ya existe.`);
                } else{
                    const product = {
                        id: await this.#generarId(),
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock
                    }
                    productsList.push(product)
                    await fs.promises.writeFile(path,JSON.stringify(productsList))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    async getProductsByID(id) {
        const productsList = await this.getProducts()
        try {
            const existe = productsList.find((el) => el.id === id)
            if(existe){
                console.log(existe);
                return existe
            } else (console.log("Not found")) 
        } catch (error) {
            console.log(error)
        }
    }
    async #generarId() {
        const productsList = await this.getProducts()
        try {
            let id = 1
            if (productsList.length !== 0) {
              id = productsList[productsList.length - 1].id + 1
            }
            return id
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(id){
        const productsList = await this.getProducts()
        try {
            let productoEliminado = await this.getProductsByID(id)
            if (productoEliminado) {
                let newProductsList = productsList.filter((el) => el.id != productoEliminado.id);
                await fs.promises.writeFile(path,JSON.stringify(newProductsList))
            } else {
                return productoEliminado;
            }
        } catch (error) {
            console.log(error)
        }
    }
    async updateProduct(id,actualizacion){
        const productsList = await this.getProducts()
        try {
           let obj = await this.getProductsByID(id)  
           let objAct = {...obj,...actualizacion}
           const listaAct = await productsList.map((elem) =>{
            if(elem.id=== objAct.id){
                return objAct
            } else{
                return elem
            }
           })
           await fs.promises.writeFile(path,JSON.stringify(listaAct))
        } catch (error) {
            console.log(error)
        }
    }
}