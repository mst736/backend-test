const emailService = require('../../services/email-service.js');
const db = require("../../models"); 
const Customer = db.Customer;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {

    if (!req.body.name || !req.body.email || !req.body.zipCode || !req.body.adress) {

        res.status(400).send({

            message: "Order Controller Faltan campos por rellenar."

        });

        return;
    }

    if(!req.body.phoneNumber && !req.body.mobileNumber) {

        res.status(400).send({

            message: "Por favor Introduzca Teléfono fijo o Móvil."

        });

        return;
    }

    const orderConfirmation = {

        name: req.body.name,
        surNameOne: req.body.surnameOne,
        surNameTwo: req.body.surnameTwo,
        phoneNumber: req.body.phoneNumber,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        zipCode: req.body.zipCode,
        adress: req.body.adress
    };

    Customer.create(orderConfirmation).then(data => {

        EmailService = new emailService('gmail');

        let emailContent = {
            subject: `Your Order ${data.id} has been Confirmed`,
            message: `Dear ${data.name}, your order with id "${data.id}" has been successfully confirmed. It will be sent to ${data.adress}. Any further request, please contact to our customer service email ${EmailService.email}`,
            attachedFile: null,
            email: req.body.email
        }

        EmailService.sendEmail(emailContent)
       
        res.status(200).send(data)

    }).catch(err => {

        res.status(500).send({

            message: err.message || "Algún error ha surgido al insertar el dato."
            
        });

    });


};
