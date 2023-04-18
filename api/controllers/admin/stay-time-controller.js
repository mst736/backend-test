
// importamos la función exportada con node.js

// requerimos el modelo para usarse en el controlador

const db = require("../../models"); 


const StayTime = db.StayTime;


const Op = db.Sequelize.Op;



exports.create = (req, res) => {

    if (!req.body.vehicle_id || !req.body.entry_time ) {

        res.status(400).send({

            message: "Some fields are Missing"

        });

        return;
    }

    const stay_time = {

        vehicle_id: req.body.vehicle_id,
        entry_time: req.body.entry_time,
        exit_time: req.body.exit_time,

    };

    StayTime.create(stay_time).then(data => {

        res.status(200).send(data);

    }).catch(err => {

        res.status(500).send({

            message: err.message || "Any error happened when entering value"

        });

    });
};

exports.findAll = (req, res) => {

    let whereStatement = {};

    if(req.query.vehicle_id)
        whereStatement.vehicle_id = {[Op.eq]: req.query.vehicle_id};
        

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    StayTime.findAll({ where: condition }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Any error happened when getting data"
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    StayTime.findByPk(id).then(data => {

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

    StayTime.update(req.body, {
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

    StayTime.destroy({
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