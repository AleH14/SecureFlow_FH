const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 * Inicializa la base de datos con un usuario administrador por defecto
 * Solo se ejecuta si la base de datos está vacía
 */
const initializeDatabase = async () => {
  try {
    // Verificar si ya existen usuarios en la base de datos
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('✅ Base de datos ya inicializada');
      return;
    }



    // Generar hash de la contraseña "ntil10"
    const contrasenaHash = await bcrypt.hash('nti104', 10);

    // Generar código único para el administrador
    const codigo = `ADM-${Date.now().toString().slice(-6)}`;

    // Crear usuario administrador por defecto
    const adminUser = new User({
      codigo: codigo,
      nombre: 'Administrador',
      apellido: 'Principal',
      email: 'administrador@gmail.com',
      telefono: '23301999',
      rol: 'administrador',
      departamento: 'Tecnologia_de_la_Informacion',
      fechaCreacion: new Date(),
      activosCreados: [],
      solicitudes: [],
      contrasenaHash: contrasenaHash,
      estado: 'activo'
    });

    await adminUser.save();

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: administrador@gmail.com');
    console.log('🔑 Contraseña: nti104');
    console.log('🆔 Código: ' + codigo);
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña después del primer acceso');

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    throw error;
  }
};

module.exports = { initializeDatabase };
