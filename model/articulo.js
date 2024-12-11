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
    latitud: Number,
    longitud: Number
  });

const ArticuloSchema = new Schema({
    nombre: { type: String, required: true },
    fotos: [AdjuntosSchema],
    coordenadas: {type:[MapasSchema]},
    fecha: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Articulo', ArticuloSchema);