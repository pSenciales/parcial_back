const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const Sala = require("../model/sala");


//get all
router.get("/", async (req, res) => {
    try {
        await Sala.find()
            .then((articulos) => {
                res.status(200).json(articulos);
            });
    } catch (error) {
        res.status(500).send("Error al listar salas: " + error);
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
        await Sala.findById(id)
            .then((articulo) => {
                if (!articulo) {
                    res.status(404).res("Not found, no existe sala con ese id")
                } else {
                    res.status(200).json(articulo);
                }
            });
    } catch (error) {
        res.status(500).send("Error filtrar salas: " + error);
    }
})


router.post('/nuevo', async (req, res) => {
    console.log('Método HTTP:', req.method);
    console.log('Cuerpo de la solicitud:', req.body);

    const { autor, nombre, coordenadas } = req.body;

    try {
        console.log(coordenadas);
        let coordenadasObj = coordenadas;
        if (typeof coordenadas === "string") {
            try {
                coordenadasObj = JSON.parse(coordenadas);  // Convertir la cadena JSON a objeto
            } catch (e) {
                // Si no es posible hacer el parseo, lanzamos un error
                console.error("Error al parsear las coordenadas:", e);
                return res.status(400).json({ message: "Las coordenadas no tienen el formato correcto." });
            }
        }

        // Asegúrate de que las coordenadas ahora son un array de objetos
        if (!Array.isArray(coordenadasObj)) {
            return res.status(400).json({ message: "Las coordenadas deben ser un array." });
        }
        //
        const nuevoArticulo = await Sala.create({ autor, nombre, coordenadas: coordenadasObj });
        console.log('Sala creada con éxito:', nuevoArticulo);
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        console.error('Error al crear el sala:', error);
        res.status(500).json({ message: 'Error al crear sala', error: error.message });
    }
});



router.put("/proyeccion/:id", async (req, res) => {
    let id = req.params.id;
    let { idPelicula, fecha } = req.body;
    if (!id) {
        return res.status(400).send("Bad request, falta el campo id");
    } else {
        try {
            await Sala.findById(id)
                .then((articulo) => {
                    if (!articulo) {
                        res.status(404).send("Not found, no existe sala con ese id");
                    }
                    else {
                        articulo.proyecciones.push({ pelicula: idPelicula, fehca: fecha });
                        articulo.save();
                        res.status(200).send("Sala actualizado:/n " + JSON.stringify(articulo));
                    }
                });

        } catch (error) {
            res.status(500).send("Error al actualizar el sala: " + error);
        }
    }
})


//Update
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let { nombre, coordenadas } = req.body;
    if (!id) {
        res.status(400).send("Bad request, falta el campo id");
    } else {
        try {
            await Sala.findById(id)
                .then((articulo) => {
                    if (!articulo) {
                        res.status(404).send("Not found, no existe sala con ese id");
                    }
                    else {
                        let coordenadasObj = coordenadas;
                        if (typeof coordenadas === "string") {
                            try {
                                coordenadasObj = JSON.parse(coordenadas);  // Convertir la cadena JSON a objeto
                            } catch (e) {
                                // Si no es posible hacer el parseo, lanzamos un error
                                console.error("Error al parsear las coordenadas:", e);
                                return res.status(400).json({ message: "Las coordenadas no tienen el formato correcto." });
                            }
                        }

                        // Asegúrate de que las coordenadas ahora son un array de objetos
                        if (!Array.isArray(coordenadasObj)) {
                            return res.status(400).json({ message: "Las coordenadas deben ser un array." });
                        }
                        articulo.nombre = nombre;
                        articulo.coordenadas = coordenadasObj;
                        articulo.save();
                        res.status(200).send("sala actualizado:/n " + JSON.stringify(articulo));
                    }
                });

        } catch (error) {
            res.status(500).send("Error al actualizar el sala: " + error);
        }
    }
})


router.delete("/articulo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const articuloEliminado = await Sala.findByIdAndDelete(id);
        if (!articuloEliminado) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.status(200).json({ message: 'Sala con éxito', articuloEliminado });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar Sala', error });
    }
})



module.exports = router
