const { timeStamp } = require('console');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('StayTime', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehicles',
                key: 'id'
            }
        },
        entry_time: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Please Introduce Entry Time Date.'
                }
            }

        },

        exit_time: {
            type: DataTypes.DATE,
            allowNull: true,
            unique: true,

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
            {
                name: "vehicle_id",
                using: "BTREE",
                fields: [
                    { name: "vehicle_id" },
                ]
            },

        ]
    });
};
