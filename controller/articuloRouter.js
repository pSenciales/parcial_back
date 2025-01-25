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


router.post('/nuevo', async (req, res) => {
    console.log('Método HTTP:', req.method);
    console.log('Cuerpo de la solicitud:', req.body);

    const { autor, nombre, foto, coordenadas } = req.body;

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
        const nuevoArticulo = await Articulo.create({ autor, nombre, coordenadas: coordenadasObj });
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

router.put("/visita/:id", async (req, res) => {
    let id = req.params.id;
    let { usuario, caducidad, token } = req.body;
    if (!id) {
        return res.status(400).send("Bad request, falta el campo id");
    } else {
        try {
            await Articulo.findById(id)
                .then((articulo) => {
                    if (!articulo) {
                        res.status(404).send("Not found, no existe articulo con ese id");
                    }
                    else {
                        articulo.visitas.push({ usuario, caducidad, token });
                        articulo.save();
                        res.status(200).send("articulo actualizado:/n " + JSON.stringify(articulo));
                    }
                });

        } catch (error) {
            res.status(500).send("Error al actualizar el articulo: " + error);
        }
    }
})


//Update
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let { nombre, coordenadas, descripciones } = req.body;
    if (!id) {
        res.status(400).send("Bad request, falta el campo id");
    } else {
        try {
            await Articulo.findById(id)
                .then((articulo) => {
                    if (!articulo) {
                        res.status(404).send("Not found, no existe articulo con ese id");
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
                        articulo.fotos.forEach((foto, index) => {
                            foto.descripcion = descripciones[index];
                        });
                        articulo.save();
                        res.status(200).send("articulo actualizado:/n " + JSON.stringify(articulo));
                    }
                });

        } catch (error) {
            res.status(500).send("Error al actualizar el articulo: " + error);
        }
    }
})


router.delete("/articulo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const articuloEliminado = await Articulo.findByIdAndDelete(id);
        if (!articuloEliminado) {
            return res.status(404).json({ message: 'Versión de artículo no encontrada' });
        }
        articuloEliminado.fotos.forEach(async (foto) => {
            await axios.delete(`https://parcial-back-seven.vercel.app/imagenes/?url=${foto.url}`);
        });
        res.status(200).json({ message: 'Versión de artículo eliminada con éxito', articuloEliminado });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar versión del artículo', error });
    }
})



module.exports = router
