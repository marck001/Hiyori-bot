
const sequelize = require('../db/sequelize');


async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        await sequelize.sync({ alter: true }); 
        console.log("Database synchronized.");
 

    } catch (error) {
        console.error("Error during database initialization:", error);
        throw error;
    }
}

module.exports = initializeDatabase;
