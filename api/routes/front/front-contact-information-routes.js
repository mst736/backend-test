module.exports = app => {

    const router = require("express").Router();
    const controller = require("../../controllers/front/contact-information-controller.js");

    router.post("/", controller.create);
    app.use('/api/front/contact-information', router);

};