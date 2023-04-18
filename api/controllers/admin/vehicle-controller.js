
// importamos la función exportada con node.js

// requerimos el modelo para usarse en el controlador

const db = require("../../models"); 


const Vehicle = db.Vehicle;


const Op = db.Sequelize.Op;



exports.create = (req, res) => {

    if (!req.body.type_name || !req.body.car_registration) {

        res.status(400).send({

            message: "Some fields are Missing"

        });

        return;
    }

    const vehicle = {

        type_name: req.body.type_name,
        car_registration: req.body.car_registration,

    };

    Vehicle.create(vehicle).then(data => {

        res.status(200).send(data);

    }).catch(err => {

        res.status(500).send({

            message: err.message || "Any error happened when entering value"

        });

    });
};

exports.findAll = (req, res) => {

    let whereStatement = {};

    if(req.query.type_name)
        whereStatement.type_name = {[Op.eq]: req.query.type_name};
        
    if(req.query.car_registration)
        whereStatement.car_registration = {[Op.eq]: req.query.car_registration};

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Vehicle.findAll({ where: condition }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Any error happened when getting data"
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Vehicle.findByPk(id).then(data => {

        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `Item with id=${id} couldn't be found.`
            });
        }

    }).catch(err => {
        res.status(500).send({
            message: "Any error happened when getting id=" + id
        });
    });
};

exports.update = (req, res) => {

    const id = req.params.id;

    Vehicle.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Element has been succesfully updated"
            });
        } else {
            res.status(404).send({
                message: `Element width id=${id} couldn't be updated. Element might not have been found or request body could be empty.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "A Server error happened when updating id=" + id
        });
    });
};

exports.delete = (req, res) => {

    const id = req.params.id;

    Vehicle.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Element has been successfully removed"
            });
        } else {
            res.status(404).send({
                message: `Element with id=${id} couldn't be removed. Element has not been found.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "A Server error happened when removing id=" + id
        });
    });
};