const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bicicentro'
};

const conn = mysql.createConnection(dbConfig);
app.use(express.static(path.join(__dirname)));
//PARTE A
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

//PARTE B
app.get("/trabajadores/:dni", function (req, res) {
    let trabajadoresDni = req.params.dni;
    let sql = "SELECT t.nombres, t.apellidos, t.correo, t.dni, t.idsede, s.nombreSede " +
        "FROM trabajadores t " +
        "LEFT JOIN sedes s ON t.idsede = s.idsede " +
        "WHERE dni = ?;";

    let params = [trabajadoresDni];

    conn.query(sql, params, function (err, results) {
        if (err) {
            console.error("Error al obtener trabajador por DNI:", err);
            res.status(500).send("Error al obtener trabajador por DNI");
        } else {
            res.json(results);
        }
    });
});

//PARTE C
app.get("/trabajadores/ventas/:dni", function (req, res) {
    let trabajadoresDni = req.params.dni;
    let sql = "SELECT v.fecha, i.nombre, i.numeroserie, m.nombre as \"marca\"\n" +
        "FROM ventas v\n" +
        "left join inventario i on  v.id_inventario = i.idinventario\n" +
        "left join marcas m on i.idmarca = m.idmarca\n" +
        "where v.dniTrabajador = ?;";

    let params = [trabajadoresDni];

    conn.query(sql, params, function (err, results) {
        if (err) {
            console.error("Error al obtener trabajador por DNI:", err);
            res.status(500).send("Error al obtener trabajador por DNI");
        } else {
            res.json(results);
        }
    });
});

//PARTE D
app.get("/sedes", function (req, res) {
    conn.query("SELECT * FROM sedes", function (err, results) {
        if (err) {
            console.error("Error al obtener trabajadores:", err);
            res.status(500).send("Error al obtener trabajadores");
        } else {
            res.json(results);
        }
    });
});

//PARTE E
app.get("/sedes/:idsede", function (req, res) {
    let idsede = req.params.idsede;
    let sql = "select * \n" +
        "from sedes s\n" +
        "where s.idsede = ?";

    let params = [idsede];

    conn.query(sql, params, function (err, results) {
        if (err) {
            console.error("Error al obtener sede por ID:", err);
            res.status(500).send("Error al obtener sede por ID");
        } else {
            res.json(results);
        }
    });
});

//PARTE F
app.get("/sedes/trabajadores/:idsede", function (req, res) {
    let idsede = req.params.idsede;
    let sql = "select t.nombres, t.apellidos, t.correo, t.dni, s.idsede\n" +
        "from sedes s\n" +
        "left join trabajadores t on s.idsede = t.idsede\n" +
        "where s.idsede = ?";

    let params = [idsede];

    conn.query(sql, params, function (err, results) {
        if (err) {
            console.error("Error al obtener sede por ID:", err);
            res.status(500).send("Error al obtener sede por ID");
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

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'pagprincipal.html'));
});
app.get("/trabajadorespagina", function (req, res) {
    res.sendFile(path.join(__dirname, 'trabajadores.html'));
});
app.get("/sedespagina", function (req, res) {
    res.sendFile(path.join(__dirname, 'sedes.html'));
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
