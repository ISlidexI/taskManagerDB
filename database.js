// database.js
require('dotenv').config(); // Carga las variables de entorno desde .env
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(MONGODB_URI);
let dbConnection;

module.exports = {
  connectToServer: async function () {
    try {
      if (dbConnection) {
        console.log("Ya existe una conexión a la base de datos.");
        return;
      }

      await client.connect();
      dbConnection = client.db(DB_NAME);
      console.log("✅ Conexión exitosa a MongoDB.");
    } catch (err) {
      console.error("❌ Error al conectar con MongoDB:", err);
      process.exit(1); // Sale de la aplicación si la conexión falla
    }
  },

  getDb: function () {
    if (!dbConnection) {
      throw new Error("¡Debes llamar a connectToServer() antes de usar la base de datos!");
    }
    return dbConnection;
  },

  // Opcional: para cerrar la conexión explícitamente en scripts que no son servidores
  closeConnection: async function() {
    if (client) {
      await client.close();
      console.log("Conexión a MongoDB cerrada.");
      dbConnection = null; // Reinicia la conexión
    }
  }
};