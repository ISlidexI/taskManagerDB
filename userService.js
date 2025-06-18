// userService.js
const db = require('./database');
const { ObjectId } = require('mongodb'); // Necesitamos ObjectId para buscar por ID



module.exports = {
  async createUser(userData) {
    try {
      const database = db.getDb();
      const collection = database.collection('users');
      const result = await collection.insertOne({ ...userData, createdAt: new Date() });
      console.log(`Usuario agregado con el _id: ${result.insertedId}`);
      return result.ops ? result.ops[0] : { _id: result.insertedId, ...userData }; // Devuelve el documento insertado
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  async getUserByUsername(username) {
    try {
      const database = db.getDb();
      const collection = database.collection('users');
      return await collection.findOne({ username });
    } catch (error) {
      console.error("Error al obtener usuario por username:", error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const database = db.getDb();
      const collection = database.collection('users');
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const database = db.getDb();
      const collection = database.collection('users');
      return await collection.find({}).toArray();
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  }
  // Podrías añadir funciones para actualizar o borrar usuarios aquí.
};