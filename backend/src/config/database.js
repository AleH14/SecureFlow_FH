const mongoose = require('mongoose');

// Database configuration for MongoDB with connection pooling
const dbConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureflow_dev',
  },
  production: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureflow_prod',
  }
};

// Connection pool configuration optimized for pull-based connections
const poolOptions = {
  // Connection Pool Settings
  maxPoolSize: 20, // Máximo de conexiones simultáneas en el pool
  minPoolSize: 5, // Mínimo de conexiones mantenidas en el pool
  maxIdleTimeMS: 30000, // Tiempo máximo de inactividad antes de cerrar conexión
  
  // Connection Timeouts
  serverSelectionTimeoutMS: 5000, // Timeout para selección de servidor
  socketTimeoutMS: 45000, // Timeout para operaciones socket
  connectTimeoutMS: 10000, // Timeout para establecer conexión inicial
  
  // Connection Monitoring
  heartbeatFrequencyMS: 10000, // Frecuencia de ping para verificar conexiones
  
  // Buffer and Retry Settings
  bufferCommands: false, // Desactivar buffering para forzar conexiones pull
  retryWrites: true,
  retryReads: true,
};

const connectDB = async () => {
  try {
    const config = dbConfig[process.env.NODE_ENV || 'development'];
    
    // Establecer conexión con pool optimizado
    const conn = await mongoose.connect(config.uri, poolOptions);

    // Configurar eventos del pool de conexiones
    setupConnectionPoolEvents();

    // Configurar cierre graceful del pool (comentado temporalmente para debug)
    // setupGracefulShutdown();

    return conn;
  } catch (error) {
    // Re-throw the error to let the calling code handle it
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

// Configurar eventos del pool de conexiones para enfoque pull
const setupConnectionPoolEvents = () => {
  const db = mongoose.connection;

  // Eventos básicos de conexión
  db.on('connected', () => {
    // MongoDB connected with pool ready
  });

  db.on('error', (err) => {
    // Connection pool error
  });

  db.on('disconnected', () => {
    // MongoDB disconnected - pool will attempt reconnection
  });

  db.on('reconnected', () => {
    // MongoDB reconnected - pool restored
  });

  // Eventos del pool de conexiones (si están disponibles)
  try {
    db.on('connectionPoolCreated', () => {
      // Connection pool created
    });

    db.on('connectionPoolReady', () => {
      // Connection pool ready for pull connections
    });

    db.on('connectionCreated', () => {
      // New connection added to pool
    });

    db.on('connectionClosed', () => {
      // Connection returned to pool or closed
    });

    db.on('connectionCheckedOut', () => {
      // Connection successfully pulled from pool
    });

    db.on('connectionCheckOutFailed', () => {
      // Connection pull failed - pool exhausted or timeout
    });

    db.on('connectionCheckedIn', () => {
      // Connection returned to pool after use
    });

    db.on('connectionPoolCleared', () => {
      // Pool cleared - all connections reset
    });

    db.on('connectionPoolClosed', () => {
      // Connection pool completely closed
    });
  } catch (err) {
    // Some pool events might not be available in this MongoDB driver version
  }
};

// Configurar cierre graceful del pool
const setupGracefulShutdown = () => {
  let shutdownHandlerSet = false;
  
  const shutdownHandler = async (signal) => {
    try {
      // Cerrar el pool de conexiones de manera ordenada
      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  };

  // Solo configurar los handlers una vez
  if (!shutdownHandlerSet) {
    // Manejar diferentes señales de cierre
    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);
    process.on('SIGQUIT', shutdownHandler);
    shutdownHandlerSet = true;
  }
};

// Función para obtener estadísticas del pool de conexiones
const getPoolStats = () => {
  const db = mongoose.connection;
  return {
    readyState: db.readyState,
    host: db.host,
    port: db.port,
    name: db.name,
    // Estadísticas del pool (disponibles en versiones más recientes)
    poolSize: db.db?.serverConfig?.poolSize || 'N/A',
    availableConnections: db.db?.serverConfig?.availableConnections || 'N/A',
    inUseConnections: db.db?.serverConfig?.inUseConnections || 'N/A'
  };
};

module.exports = {
  dbConfig,
  connectDB,
  getPoolStats,
  setupConnectionPoolEvents,
  setupGracefulShutdown
};