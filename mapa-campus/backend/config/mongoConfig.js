const mongoose = require('mongoose');

const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mapeo_residuos'
};


async function connectMongo() {
  try {
    await mongoose.connect(mongoConfig.uri);
    console.log('✓ Conectado a MongoDB');
  } catch (error) {
    console.error('✗ Error conectando a MongoDB:', error.message);
    throw error;
  }
}


async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.log('✓ Desconectado de MongoDB');
  } catch (error) {
    console.error('✗ Error desconectando:', error.message);
  }
}

module.exports = {
  mongoConfig,
  connectMongo,
  disconnectMongo,
  mongoose
};