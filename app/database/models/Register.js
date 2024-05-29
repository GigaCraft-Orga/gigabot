let { sequelize } = require('../database');
const {DataTypes} = require("sequelize");

const Register = sequelize.define('register', {
    action_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    assignee_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    },
    accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    },
    {
        timestamps: false,
    },
);

module.exports = Register;