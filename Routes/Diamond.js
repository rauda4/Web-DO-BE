const diamondController = require('../controllers/Diamond.controller');
const productController = require('../controllers/Product.controller');
const Router = require('express').Router();

Router.post('/', diamondController.createDataDiamond);
Router.get('/', diamondController.getDiamond);
// Router.get("/product", productController.getProduct)
Router.get('/:id', diamondController.getDiamondById);
Router.put('/:id', diamondController.updateData);
Router.delete('/:id', diamondController.deleteDiamond);

module.exports = Router;
