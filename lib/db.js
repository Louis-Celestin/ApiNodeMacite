const mysql  = require('mysql')
require('dotenv').config()

const connexion = mysql.createConnection({

    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    database:process.env.DATABASE_NAME,
    password:'.njYutsw7q.PPdT'
})

if(connexion)
{
    console.log('Connexion réussie')
}
module.exports = connexion

