const productController = require("../controllers/Product.controller")
const Router = require("express").Router()

Router.post("/", productController.createDataProduct)
Router.get("/", productController.getProduct)
Router.get("/:id", productController.getProductById)
Router.get("/search/:key", productController.GetProductByQuery)
Router.put("/:id", productController.updateDataProduct)
Router.delete("/:id", productController.deleteProduct)

module.exports = Router;