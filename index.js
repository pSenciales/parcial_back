const express = require('express');
require('dotenv').config();
const cors = require('cors');
const PORT = 4000;

const imagenesRouter = require("./controller/imagenRouter");
const coordenadasRouter = require("./controller/coordenadasRouter");
const mapasRouter = require("./controller/mapasRouter");
const logsRouter = require("./controller/logsRouter");



const app = express();
app.use(cors());

app.use(express.json());



app.get("/home", (req,res) =>{
  res.status(200).json("Welcome to home, all working perfectly");
})


app.get("/", (req,res) =>{
  res.status(200).json("Welcome to my page");
})

app.listen(PORT, () => {
  console.log('Backend escuchando en http://localhost:4000');
});

app.use("/imagenes", imagenesRouter);
app.use("/mapas", mapasRouter);
app.use("/coordenadas", coordenadasRouter);
app.use("/logs", logsRouter);

module.exports = app;
