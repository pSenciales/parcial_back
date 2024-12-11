const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const Articulo = require("../model/articulo");


//get all
router.get("/", async (req, res) => {
    try {
        await Articulo.find()
            .then((articulos) => {
                res.status(200).json(articulos);
            });
    } catch (error) {
        res.status(500).send("Error al listar articulos: " + error);
    }
})

//get filtro
router.get("/filtro", async (req, res) => {
    const { filtro, sortField, sortOrder } = req.query;
    try {
        const filtroBusqueda = filtro ? JSON.parse(filtro) : {};
        const orden = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } : {};

        await Articulo.find(filtroBusqueda)
            .sort(orden)
            .then((articulos_filtrados) => {
                res.status(200).json(articulos_filtrados);
            });
    } catch (error) {
        res.status(500).send("Error al filtrar artículos: " + error);
    }
});

//getById
router.get("/:id", async (req, res) => {

    let id = req.params.id;
    try {
        await Articulo.findById(id)
            .then((articulo) => {
                if (!articulo) {
                    res.status(404).res("Not found, no existe articulo con ese id")
                } else {
                    res.status(200).json(articulo);
                }
            });
    } catch (error) {
        res.status(500).send("Error filtrar articulos: " + error);
    }
})


// Crear un nuevo artículo
// Interactúa CON WIKI (MICROSERVICIO)
router.post('/nuevo', async (req, res) => {
    console.log('Método HTTP:', req.method);
    console.log('Cuerpo de la solicitud:', req.body);

    const { nombre, foto } = req.body;

    try {
        const nuevoArticulo = await Articulo.create({ nombre, foto });
        console.log('Artículo creado con éxito:', nuevoArticulo);
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear artículo', error: error.message });
    }
});

router.put("/imagen/:id", async (req, res) => {
    let id = req.params.id;
    let { url, descripcion } = req.body;
    if (!id) {
        return res.status(400).send("Bad request, falta el campo id");
    }
    try {
        const articulo = await Articulo.findById(id);
        if (!articulo) {
            return res.status(404).send("Not found, no existe articulo con ese id");
        }
        articulo.fotos.push({ url, descripcion: descripcion[0] });
        await articulo.save();
        res.status(200).send("articulo actualizado:\n " + JSON.stringify(articulo));
    } catch (error) {
        res.status(500).send("Error al actualizar el articulo: " + error);
    }
});


//Update
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let updated_values = req.body;
    if (!id) {
        res.status(400).send("Bad request, falta el campo id");
    } else {
        try {
            await Articulo.findByIdAndUpdate(id, updated_values, { new: true })
                .then((resultado) => {
                    if (!resultado) {
                        res.status(404).send("Not found, no existe articulo con ese id");
                    }
                    else {
                        res.status(200).send("articulo actualizado:/n " + JSON.stringify(resultado));
                    }
                });

        } catch (error) {
            res.status(500).send("Error al actualizar el articulo: " + error);
        }
    }
})




module.exports = router
