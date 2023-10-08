const UserController = require('../controllers/User.controller');
const Router = require('express').Router();

Router.get('/', UserController.getUsers);
Router.get('/profile', UserController.selectUser);
Router.put('/update', UserController.updateUsers);

module.exports = Router;
