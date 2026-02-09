
const sql = require('mssql');

const sqlConfig = {
  user: 'sa',
  password: 'Luis$$$2025',
  database: 'MapeoResiduos',
  server: 'localhost',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function connectSQL() {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log('✓ Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('✗ Error conectando a SQL Server:', error.message);
    throw error;
  }
}

async function disconnectSQL(pool) {
  try {
    await pool.close();
    console.log('✓ Desconectado de SQL Server');
  } catch (error) {
    console.error('✗ Error desconectando:', error.message);
  }
}

module.exports = {
  sqlConfig,
  connectSQL,
  disconnectSQL,
  sql
};