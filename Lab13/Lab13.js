const express = require('express');
const mysql = require('mysql2');
const app = express();

// Configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bicicentro'
};

const conn = mysql.createConnection(dbConfig);


app.get("/trabajadores", function (req, res) {
    conn.query("SELECT * FROM trabajadores", function (err, results) {
        if (err) {
            console.error("Error al obtener trabajadores:", err);
            res.status(500).send("Error al obtener trabajadores");
        } else {
            res.json(results);
        }
    });
});


app.on('close', function () {
    conn.end(function (err) {
        if (err) {
            return console.log('Error al cerrar la conexión de la base de datos: ' + err.message);
        }
        console.log('Conexión de la base de datos cerrada.');
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js en ejecución en http://localhost:${PORT}`);
});


process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
