import { Sequelize } from "sequelize";

const db_name = 'waste_db';
const username = 'root';
const password = '';

const db = new Sequelize(db_name, username, password, {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;