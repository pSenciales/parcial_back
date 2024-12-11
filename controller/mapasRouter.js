const express = require("express");
const router = express.Router();
const axios = require("axios");

// Dada una dirección, llama a OpenStreetMap para obtener las coordenadas
router.get("/:direccion", async (req, res) => {
    try {
        const { direccion } = req.params; // Recibe la dirección desde los parámetros de la URL

        if (!direccion) {
            return res.status(400).json({ message: "La dirección es requerida" });
        }

        // Llama a la API de Nominatim para buscar las coordenadas
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`;
        const response = await axios.get(url);

        if (response.data.length === 0) {
            return res.status(404).json({ message: "No se encontraron resultados para la dirección proporcionada" });
        }

        // Extrae las coordenadas del resultado
        const { lat, lon } = response.data[0];
        return res.json({ direccion, lat, lon });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});

router.get("/:lat/:lon", async (req, res) => {
    try {
        const { lat, lon } = req.params;

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitud y longitud son requeridas" });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: "Latitud o longitud no son válidas" });
        }

        // Construye correctamente los límites del bbox
        const bbox = `${longitude - 0.001},${latitude - 0.001},${longitude + 0.001},${latitude + 0.001}`;
        const iframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

        return res.json({ iframeUrl });
    } catch (error) {
        console.error("Error en el servidor al generar el iframe URL:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});


module.exports = router;
