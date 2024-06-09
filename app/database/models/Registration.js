let { sequelize } = require('../database');
const {DataTypes} = require("sequelize");

const Registration = sequelize.define('gigacraft_registration', {
        row_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        action_id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            unique: true,
        },
        user_uuid: {
            type: DataTypes.STRING,
            unique: true,
        },
        assignee_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        processed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: false,
    },
);

module.exports = Registration;