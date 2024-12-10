const express = require("express");
const router = express.Router();
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", async (req, res) => {
    try {
        // Usar formidable para manejar los datos multipart/form-data
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ message: "Error al procesar la solicitud", error: err });
            }

            const { id } = fields;
            const imageFile = files.image;
            console.log(`id: ${id}\ndescripcion: ${descripcion}\nimagen: ${imageFile}`);
            if (!id) {
                return res.status(400).json({ message: "Faltan datos obligatorios (id)" });
            } else if (!imageFile) {
                return res.status(400).json({ message: "Faltan datos obligatorios (imagen)" });
            }

            try {
                // Subir la imagen a Cloudinary
                const uploadResult = await cloudinary.uploader.upload(imageFile[0].filepath, {
                    folder: "articulos",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "auto",
                        },
                        {
                            width: 300,
                            height: 300,
                            crop: "fill",
                            gravity: "auto",
                        },
                    ],
                });

                if (!uploadResult || !uploadResult.secure_url) {
                    throw new Error("No se pudo obtener la URL segura de la imagen");
                }

                // Hacer la petición PUT a tu API
                const apiResponse = await axios.put(`https://parcial-back-seven.vercel.app/articulos/${id}`, {
                    foto: uploadResult.secure_url,
                });

                return res.status(apiResponse.status).json({
                    message: "Imagen subida y datos actualizados con éxito",
                    data: apiResponse.data,
                });

            } catch (error) {
                console.error("Error al subir la imagen o al hacer PUT:", error);
                return res.status(500).json({
                    message: "Error al subir la imagen o al guardar los datos",
                    error: error.message,
                });
            }

        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});

router.delete("/", async (req, res) => {
    const { url } = req.query; // Usamos req.query para acceder a los parámetros de consulta

    if (!url) {
        return res.status(400).json({ message: "La URL de la imagen es obligatoria" });
    }

    try {
        // Extraer el public_id de la URL
        const regex = /\/v\d+\/(.+)\./; // Busca el public_id dentro de la URL
        const match = url.match(regex);
        if (!match || !match[1]) {
            return res.status(400).json({ message: "No se pudo extraer el public_id de la URL" });
        }

        const public_id = match[1];

        // Eliminar la imagen de Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === "ok") {
            return res.status(200).json({ message: "Imagen eliminada con éxito", public_id });
        } else if (result.result === "not found") {
            return res.status(404).json({ message: "La imagen no fue encontrada en Cloudinary", public_id });
        } else {
            throw new Error("No se pudo eliminar la imagen");
        }
    } catch (error) {
        console.error("Error al eliminar la imagen:", error.message);
        return res.status(500).json({ message: "Error al eliminar la imagen", error: error.message });
    }
});




module.exports = router;