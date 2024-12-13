const connectBD = require("../bd");
const mongoose = require('mongoose'); 
const {Schema} = mongoose;

connectBD("admin", "admin").then(()=>{
    console.log("Mapas de Mongo disponibles");
}).catch((error) => {
    console.log("Error al conectar a Mongo (mapas) "+ error);
});

const AdjuntosSchema = new Schema({
    url: String,
    descripcion: String
  });

  const CoordenadasSchema = new Schema({
    latitud: Number,
    longitud: Number, 
    lugar: {type: String}
  });

const MapasSchema = new Schema({
    autor: {type: String, required: true},
    fotos: [AdjuntosSchema],
    coordenadas: [CoordenadasSchema],
    fecha: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Mapas', MapasSchema);