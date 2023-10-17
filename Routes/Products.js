const productController = require('../controllers/Product.controller');
const Router = require('express').Router();
const uploadImage = require('../middlewares/image');

Router.post('/', uploadImage, productController.createDataProduct);
Router.post('/upload', uploadImage, productController.createImage);
Router.get('/', productController.getProduct);
Router.get('/:id', productController.getProductById);
Router.get('/search/:key', productController.GetProductByQuery);
Router.put('/:id', uploadImage, productController.updateDataProduct);
Router.delete('/:id', productController.deleteProduct);

module.exports = Router;
