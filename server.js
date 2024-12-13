const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para parsear JSON en las peticiones

// Ruta para obtener la agenda desde el archivo JSON
app.get('/api/agenda', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'agenda.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de agenda.');
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar un nuevo elemento a la agenda
app.post('/api/agenda', (req, res) => {
    const newAgendaItem = req.body;

    fs.readFile(path.join(__dirname, 'data', 'agenda.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de agenda.');
        }

        const agendaList = JSON.parse(data);
        agendaList.push(newAgendaItem);

        fs.writeFile(path.join(__dirname, 'data', 'agenda.json'), JSON.stringify(agendaList, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar el archivo de agenda.');
            }
            res.status(201).send('Elemento agregado.');
        });
    });
});

// Ruta para eliminar un elemento de la agenda
app.delete('/api/agenda/:index', (req, res) => {
    const index = req.params.index;

    fs.readFile(path.join(__dirname, 'data', 'agenda.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de agenda.');
        }

        const agendaList = JSON.parse(data);
        agendaList.splice(index, 1);

        fs.writeFile(path.join(__dirname, 'data', 'agenda.json'), JSON.stringify(agendaList, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al eliminar el elemento.');
            }
            res.status(200).send('Elemento eliminado.');
        });
    });
});

// Ruta para eliminar todos los elementos de la agenda
app.delete('/api/agenda', (req, res) => {
    fs.writeFile(path.join(__dirname, 'data', 'agenda.json'), JSON.stringify([], null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error al eliminar todos los elementos.');
        }
        res.status(200).send('Todos los elementos eliminados.');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});