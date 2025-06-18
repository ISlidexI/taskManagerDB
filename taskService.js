// taskService.js
const db = require('./database');
const { ObjectId } = require('mongodb');

console.log("Módulo 'taskService.js' ha sido cargado.");

module.exports = {
  async createTask(taskData) {
    try {
      const database = db.getDb();
      const collection = database.collection('tasks');
      // Asegúrate de que projectId y assignedTo sean ObjectIds
      taskData.projectId = new ObjectId(taskData.projectId);
      if (taskData.assignedTo) {
        taskData.assignedTo = new ObjectId(taskData.assignedTo);
      }
      const result = await collection.insertOne({
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: taskData.status || "Pendiente" // Estado por defecto
      });
      console.log(`Tarea agregada con el _id: ${result.insertedId}`);
      return result.ops ? result.ops[0] : { _id: result.insertedId, ...taskData };
    } catch (error) {
      console.error("Error al crear tarea:", error);
      throw error;
    }
  },

  async getTaskById(id) {
    try {
      const database = db.getDb();
      const collection = database.collection('tasks');
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error al obtener tarea por ID:", error);
      throw error;
    }
  },

  async getTasksByProject(projectId) {
    try {
      const database = db.getDb();
      const collection = database.collection('tasks');
      return await collection.find({ projectId: new ObjectId(projectId) }).toArray();
    } catch (error) {
      console.error("Error al obtener tareas por proyecto:", error);
      throw error;
    }
  },

  async updateTaskStatus(taskId, newStatus) {
    try {
      const database = db.getDb();
      const collection = database.collection('tasks');
      const result = await collection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { status: newStatus, updatedAt: new Date() } }
      );
      console.log(`Tarea con _id: ${taskId} actualizada. Coincidencias: ${result.matchedCount}, Modificados: ${result.modifiedCount}`);
      return result;
    } catch (error) {
      console.error("Error al actualizar estado de tarea:", error);
      throw error;
    }
  },

  async getTasksByStatus(status) {
    try {
      const database = db.getDb();
      const collection = database.collection('tasks');
      return await collection.find({ status: status }).toArray();
    } catch (error) {
      console.error("Error al obtener tareas por estado:", error);
      return [];
    }
  },

  async getOverdueTasks() {
    try {
      const database = db.getDb();
      const collection = database.collection('tasks');
      return await collection.find({
        dueDate: { $lt: new Date() },
        status: { $ne: "Completada" }
      }).toArray();
    } catch (error) {
      console.error("Error al obtener tareas vencidas:", error);
      return [];
    }
  }
  // Podrías añadir funciones para asignar tareas, borrar tareas, etc.
};