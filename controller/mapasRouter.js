const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const Mapas = require("../model/mapas");


//get all
router.get("/", async (req, res) => {
    try {
        await Mapas.find()
            .then((Mapas) => {
                res.status(200).json(Mapas);
            });
    } catch (error) {
        res.status(500).send("Error al listar Mapas: " + error);
    }
})

//get filtro
router.get("/filtro", async (req, res) => {
    const { autor } = req.query;
    try {
        if(!autor){
            await Mapas.find()
            .then((Mapas) => {
                res.status(200).json(Mapas);
            });
        }else{
        await Mapas.find({autor:autor})
            .then((Mapas_filtrados) => {
                res.status(200).json(Mapas_filtrados);
            });}
    } catch (error) {
        res.status(500).send("Error al filtrar artículos: " + error);
    }
});

//getById
router.get("/:id", async (req, res) => {

    let id = req.params.id;
    try {
        await Mapas.findById(id)
            .then((Mapas) => {
                if (!Mapas) {
                    res.status(404).res("Not found, no existe Mapas con ese id")
                } else {
                    res.status(200).json(Mapas);
                }
            });
    } catch (error) {
        res.status(500).send("Error filtrar Mapas: " + error);
    }
})


router.post('/nuevo', async (req, res) => {
    console.log('Método HTTP:', req.method);
    console.log('Cuerpo de la solicitud:', req.body);

    const { autor, coordenadas } = req.body;

    try {
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
        const nuevoMapas = await Mapas.create({ autor, coordenadas: coordenadasObj });
        console.log('Artículo creado con éxito:', nuevoMapas);
        res.status(201).json(nuevoMapas);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear artículo', error: error.message });
    }
});



router.put("/imagen/:id", async (req, res) => {
    let id = req.params.id;
    console.log("ID recibido:", req.params.id);
    console.log("Cuerpo de la solicitud:", req.body);
    let { url, descripcion } = req.body; // descripcion es el lugar donde se debe agregar
    if (!id || !url || !descripcion) {
        return res.status(400).send("Bad request, faltan campos obligatorios");
    }
    try {
        const mapa = await Mapas.findById(id);
        if (!mapa) {
            return res.status(404).send("Not found, no existe Mapas con ese id");
        }

        const coordenada = mapa.coordenadas.find(coord => coord.lugar === descripcion);
        if (!coordenada) {
            return res.status(404).send("Not found, no existe una coordenada con ese lugar");
        }

        coordenada.fotos.push({ url, descripcion });

        await mapa.save();

        res.status(200).send("Mapas actualizado:\n" + JSON.stringify(mapa));
    } catch (error) {
        res.status(500).send("Error al actualizar el Mapas: " + error);
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
            await Mapas.findByIdAndUpdate(id, updated_values, { new: true })
                .then((resultado) => {
                    if (!resultado) {
                        res.status(404).send("Not found, no existe Mapas con ese id");
                    }
                    else {
                        res.status(200).send("Mapas actualizado:/n " + JSON.stringify(resultado));
                    }
                });

        } catch (error) {
            res.status(500).send("Error al actualizar el Mapas: " + error);
        }
    }
})


router.delete("/Mapas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const MapasEliminado = await Mapas.findByIdAndDelete(id);
        if (!MapasEliminado) {
            return res.status(404).json({ message: 'Versión de artículo no encontrada' });
        }
        MapasEliminado.fotos.forEach(async (foto) => {
            await axios.delete(`http://parcial-back-seven.vercel.app/imagenes/?url=${foto.url}`);
        });
        res.status(200).json({ message: 'Versión de artículo eliminada con éxito', MapasEliminado });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar versión del artículo', error });
    }
})



module.exports = router
