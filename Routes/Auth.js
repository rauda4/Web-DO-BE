const AuthController = require("../controllers/Auth.controller");
const authOnly = require("../middlewares/auth");
const Router = require("express").Router();

Router.post("/register", AuthController.createUser)
Router.post("/login", AuthController.login)

module.exports = Router