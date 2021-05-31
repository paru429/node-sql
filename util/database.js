const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Mysql1234', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

//Connection with mysql2
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Mysql1234'
// });

// module.exports = pool.promise();