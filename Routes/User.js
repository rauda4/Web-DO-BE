const UserController = require("../controllers/User.controller");
const authOnly = require("../middlewares/auth");
const Router = require("express").Router();

Router.post("/", authOnly, UserController.CreateUser)
Router.get("/", authOnly, UserController.getUser)
Router.get("/:id", authOnly, UserController.GetUserById)
Router.get("/search/:key", authOnly, UserController.GetUserByQuery)
Router.put("/:id", authOnly, UserController.updateUser)
Router.delete("/:id", authOnly, UserController.deleteUser)

module.exports = Router