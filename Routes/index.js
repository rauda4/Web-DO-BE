const router = require("express").Router();
const UserRouter = require("./User")

router.use("/users", UserRouter)

module.exports = router