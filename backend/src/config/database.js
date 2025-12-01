const mongoose = require('mongoose');

// Database configuration for MongoDB
const dbConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureflow_dev',
  },
  production: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureflow_prod',
  }
};

const connectDB = async () => {
  try {
    const config = dbConfig[process.env.NODE_ENV || 'development'];
    
    console.log(`🔗 Attempting to connect to: ${config.uri}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Configurar opciones de conexión para MongoDB local
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
    };
    
    const conn = await mongoose.connect(config.uri, options);

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log(`❌ Attempted URI: ${dbConfig[process.env.NODE_ENV || 'development'].uri}`);
    console.log('💡 Asegúrate de que MongoDB esté ejecutándose:');
    console.log('   - Windows: Ejecuta "mongod" en terminal');
    console.log('   - O verifica el servicio MongoDB en Services');
    console.log('   - Puerto por defecto: 27017');
    process.exit(1);
  }
};

module.exports = {
  dbConfig,
  connectDB
};