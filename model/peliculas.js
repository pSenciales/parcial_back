const connectBD = require("../bd");
const mongoose = require('mongoose'); 
const {Schema} = mongoose;

connectBD("admin", "admin").then(()=>{
    console.log("Peliculas de Mongo disponibles");
}).catch((error) => {
    console.log("Error al conectar a Mongo (peliculas) "+ error);
});

const AdjuntosSchema = new Schema({
    url: String,
    descripcion: String
  });



const ArticuloSchema = new Schema({
    titulo: { type: String, required: true },
    cartel: [AdjuntosSchema],
    fecha: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Pelicula', ArticuloSchema);