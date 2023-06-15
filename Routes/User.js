const UserController = require("../controllers/User.controller");
const Router = require("express").Router();

Router.post("/", UserController.CreateUser)
Router.get("/", UserController.getUser)
Router.get("/:id", UserController.GetUserById)
Router.get("/search/:key", UserController.GetUserByQuery)
Router.put("/:id", UserController.updateUser)
Router.delete("/:id", UserController.deleteUser)

module.exports = Router