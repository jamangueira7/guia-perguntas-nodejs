const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'postgres', 'docker', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = connection;
