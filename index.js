const express = require('express');
require('dotenv').config();
const cors = require('cors');
const PORT = 4000;

const app = express();
app.use(cors());


app.get("/home", (req,res) =>{
  res.status(200).json("Welcome to home, all working perfectly");
})


app.get("/", (req,res) =>{
  res.status(200).json("Welcome to my page");
})

app.listen(PORT, () => {
  console.log('Backend escuchando en http://localhost:4000');
});

module.exports = app;
