// projectService.js
const db = require('./database');
const { ObjectId } = require('mongodb');

console.log("Módulo 'projectService.js' ha sido cargado.");

module.exports = {
  async createProject(projectData) {
    try {
      const database = db.getDb();
      const collection = database.collection('projects');
      // Asegúrate de que createdBy sea un ObjectId
      projectData.createdBy = new ObjectId(projectData.createdBy);
      const result = await collection.insertOne({ ...projectData, createdAt: new Date() });
      console.log(`Proyecto agregado con el _id: ${result.insertedId}`);
      return result.ops ? result.ops[0] : { _id: result.insertedId, ...projectData };
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      throw error;
    }
  },

  async getProjectById(id) {
    try {
      const database = db.getDb();
      const collection = database.collection('projects');
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error al obtener proyecto por ID:", error);
      throw error;
    }
  },

  async getProjectsByUser(userId) {
    try {
      const database = db.getDb();
      const collection = database.collection('projects');
      return await collection.find({ createdBy: new ObjectId(userId) }).toArray();
    } catch (error) {
      console.error("Error al obtener proyectos por usuario:", error);
      throw error;
    }
  },

  async getAllProjects() {
    try {
      const database = db.getDb();
      const collection = database.collection('projects');
      return await collection.find({}).toArray();
    } catch (error) {
      console.error("Error al obtener todos los proyectos:", error);
      throw error;
    }
  }
};