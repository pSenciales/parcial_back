const express = require('express');
require('dotenv').config();
const cors = require('cors');
const PORT = 4000;

const imagenesRouter = require("./controller/imagenRouter");
const mapaRouter = require("./controller/mapasRouter");
const peliculasRouter = require("./controller/peliculaRouter");
const salasRouter = require("./controller/salaRouter");
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
app.use("/salas", salasRouter);
app.use("/peliculas", peliculasRouter);
app.use("/mapas", mapaRouter);
app.use("/logs", logsRouter);

module.exports = app;
