const AuthController = require("../controllers/Auth.controller");
const authOnly = require("../middlewares/auth");
const Router = require("express").Router();

Router.post("/register", AuthController.Register)
Router.post("/login", AuthController.login)

module.exports = Router