module.exports = (app,upload) => {

    const router = require("express").Router();
    // const authJwt  = require("../../middlewares/auth-jwt.js");
    const controller = require("../../controllers/admin/vehicle-controller.js");

    router.post("/", controller.create);
    router.get("/", controller.findAll);  
    router.get("/:id", controller.findOne);  
    router.put("/:id", controller.update);  
    router.delete("/:id", controller.delete);
    app.use('/api/admin/vehicles', router);

}