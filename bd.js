const mongoose = require('mongoose'); 

async function Connect(user, pw) {
  await mongoose.connect('mongodb+srv://'+user+':'+pw+'@parcial3.sg1tr.mongodb.net/parcial3');
}

module.exports = Connect;