const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
});

async function connect() {
    try {
        console.log('Trying to connect to database...');
        const start = Date.now();

        await sequelize.authenticate({logging: false});

        const diff = Date.now() - start;
        console.log('Connection has been established successfully in ' + diff + 'ms.');

        sync();

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function sync() {
    try {
        console.log('Syncing models...');

        await sequelize.sync({logging: false});

        console.log('Models synced.');

    } catch (error) {
        console.error('Unable to sync models:', error);
    }
}

module.exports = { sequelize: sequelize, connect};