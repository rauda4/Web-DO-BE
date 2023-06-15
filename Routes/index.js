const router = require("express").Router();
const UserRouter = require("./User");
const DiamondRouter = require("./Diamond");
const login = require("../controllers/Login.controller");

router.use("/users", UserRouter)
router.use("/diamond", DiamondRouter)

// login handler
router.post("/auth/login", login)

module.exports = router