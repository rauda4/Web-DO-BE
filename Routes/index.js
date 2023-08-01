const router = require("express").Router();
const UserRouter = require("./User");
const DiamondRouter = require("./Diamond");
const ProductRouter = require("./Products")
const AuthRouter = require("./Auth")

router.use("/users", UserRouter)
router.use("/diamond", DiamondRouter)
router.use("/product", ProductRouter)

// Auth handler
router.use("/auth", AuthRouter)

module.exports = router