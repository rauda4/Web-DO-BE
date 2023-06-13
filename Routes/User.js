const UserController = require("../controllers/User.controller");

const Router = require("express").Router();

Router.get("/", UserController.getData)
Router.post("/", UserController.CreateData)

module.exports = Router