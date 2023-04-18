module.exports = app => {

    const router = require("express").Router();
    const controller = require("../../controllers/front/order-confirmation-controller.js");

    router.post("/", controller.create);
    app.use('/api/front/checkout', router);

};