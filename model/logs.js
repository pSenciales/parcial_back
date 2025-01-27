const connectBD = require("../bd");
const mongoose = require('mongoose'); 
const {Schema} = mongoose;

connectBD("admin", "admin").then(()=>{
    console.log("Logs de Mongo disponibles");
}).catch((error) => {
    console.log("Error al conectar a Mongo (logs) "+ error);
});


const LogsSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    usuario: {type: String, required: true},
    caducidad: { type: Date, required: true },
    token: { type: String, required: true }
});


module.exports = mongoose.model('Logs', LogsSchema);