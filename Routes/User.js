const UserController = require('../controllers/User.controller');
const authOnly = require('../middlewares/auth');
const Router = require('express').Router();

Router.get('/', UserController.getUser);
Router.get('/:id', UserController.GetUserById);
Router.put('/:id', authOnly, UserController.updateUser);
Router.delete('/:id', UserController.deleteUser);

module.exports = Router;
