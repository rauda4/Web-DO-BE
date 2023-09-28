const router = require('express').Router();
const UserRouter = require('./User');
const DiamondRouter = require('./Diamond');
const ProductRouter = require('./Products');
const AuthRouter = require('./Auth');
const PaymentRouter = require('./Payment');

router.use('/users', UserRouter);
router.use('/diamond', DiamondRouter);
router.use('/product', ProductRouter);
router.use('/payment', PaymentRouter);

// Auth handler
router.use('/auth', AuthRouter);

module.exports = router;
