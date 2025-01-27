const connectBD = require("../bd");
const mongoose = require('mongoose'); 
const {Schema} = mongoose;

connectBD("admin", "admin").then(()=>{
    console.log("Salas de Mongo disponibles");
}).catch((error) => {
    console.log("Error al conectar a Mongo (salas) "+ error);
});

  const MapasSchema = new Schema({
    lugar: String,
    latitud: Number,
    longitud: Number
  });

  const ProyeccionSchema = new Schema({
    fehcha: {type: Date, required: true},
    pelicula: {type: String, required: true}
  })

const ArticuloSchema = new Schema({
    autor: {type: String, required: true},
    nombre: { type: String, required: true },
    coordenadas: [MapasSchema],
    proyecciones: [ProyeccionSchema]
  });


module.exports = mongoose.model('Sala', ArticuloSchema);