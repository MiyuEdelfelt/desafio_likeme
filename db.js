const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

// Verificar conexión
pool.connect()
  .then(client => {
    console.log('✅ Conexión a la base de datos exitosa');
    client.release(); // Liberar cliente después de probar conexión
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

module.exports = pool;
