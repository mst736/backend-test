const { timeStamp } = require('console');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Vehicle', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        type_name: {
            type: DataTypes.ENUM('official', 'resident', 'non-resident'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please Select Car Type.'
                }
            }

        },
        car_registration: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Please Introduce Car Registration Number.'
                }
            }

        },
    }, {
        sequelize,
        tableName: 'vehicles',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
};
