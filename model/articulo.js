const connectBD = require("../bd");
const mongoose = require('mongoose'); 
const {Schema} = mongoose;

connectBD("admin", "admin").then(()=>{
    console.log("Articulos de Mongo disponibles");
}).catch((error) => {
    console.log("Error al conectar a Mongo (articulos) "+ error);
});

const AdjuntosSchema = new Schema({
    url: String,
    descripcion: String
  });

  const MapasSchema = new Schema({
    lugar: String,
    latitud: Number,
    longitud: Number
  });

  const LogsSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    usuario: {type: String, required: true},
    caducidad: { type: Date, required: true },
    token: { type: String, required: true }
});

const ArticuloSchema = new Schema({
    autor: {type: String, required: true},
    nombre: { type: String, required: true },
    fotos: [AdjuntosSchema],
    coordenadas: [MapasSchema],
    visitas: [LogsSchema],
    fecha: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Articulo', ArticuloSchema);