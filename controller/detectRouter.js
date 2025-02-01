const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
    const { message, context } = req.body;

    try {
        const response = await axios.post(
            "https://DeepSeek-HateDetect.eastus2.models.ai.azure.com/v1/chat/completions",
            {
                messages: [
                    { role: "system", content: "You are an AI assistant that analyzes text. Determine if a message is offensive and return just 'Hate Speech' or 'Not Hate Speech'." },
                    { role: "user", content: `Can you analyze this message for offensive content? '${message}' ${context}` }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: ``,
                }
            }
        );

        let result = response.data.choices[0].message.content;

        // 🔹 Filtrar el contenido, eliminando <think>...</think>
        result = result.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error}` });
    }
});



module.exports = router
