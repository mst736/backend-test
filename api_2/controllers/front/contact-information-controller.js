const emailService = require('../../services/email-service.js');
const db = require("../../models"); 
const ContactInformation = db.ContactInformation;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {

    if (!req.body.name || !req.body.email || !req.body.message) {

        res.status(400).send({

            message: "Faltan campos por rellenar."

        });

        return;
    }

    if(!req.body.phoneNumber && !req.body.mobileNumber) {

        res.status(400).send({

            message: "Por favor Introduzca Teléfono fijo o Móvil."

        });

        return;
    }

    const contactInformation = {

        name: req.body.name,
        surNameOne: req.body.surNameOne,
        surNameTwo: req.body.surNameTwo,
        phoneNumber: req.body.phoneNumber,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        message: req.body.message,
        fingerPrintId: req.body.fingerPrintId,

    };


    ContactInformation.create(contactInformation).then(data => {

        let emailContent = {
            subject: req.body.subject,
            message: req.body.message,
            attachedFile: null
        }

        new emailService('gmail').sendEmail(emailContent)

        res.status(200).send(data)


    }).catch(err => {

        res.status(500).send({

            message: err.message || "Algún error ha surgido al insertar el dato."

        });

    });

    
};
