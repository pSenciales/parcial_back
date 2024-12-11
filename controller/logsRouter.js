const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const Logs = require("../model/logs");


//get all
router.get("/", async (req, res) => {
    try {
        await Logs.find()
            .then((logs) => {
                res.status(200).json(logs);
            });
    } catch (error) {
        res.status(500).send("Error al listar logs: " + error);
    }
})



router.post('/', async (req, res) => {

    const { usuario, caducidad, token} = req.body;

    try {
        const nuevoArticulo = await Logs.create({ usuario, caducidad, token });
        console.log('Artículo creado con éxito:', nuevoArticulo);
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear artículo', error: error.message });
    }
});




module.exports = router
