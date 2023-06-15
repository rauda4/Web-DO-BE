const router = require("express").Router();
const UserRouter = require("./User");
const DiamondRouter = require("./Diamond");

router.use("/users", UserRouter)
router.use("/diamond", DiamondRouter)

module.exports = router