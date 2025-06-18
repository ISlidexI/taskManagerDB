// app.js
const db = require('./database');
const userService = require('./userService');
const projectService = require('./projectService');
const taskService = require('./taskService');
const { ObjectId } = require('mongodb'); // Necesitamos esto para los _id de prueba

console.log("Módulo 'app.js' ha sido cargado.");

/**
 * Función principal asíncrona para orquestar la aplicación.
 */
async function main() {
  console.log("Iniciando aplicación de Gestión de Tareas...");

  // 1. Conectar a la base de datos.
  await db.connectToServer();

  // Opcional: Limpiar colecciones para un inicio limpio en cada ejecución de prueba
  console.log("\n--- Limpiando colecciones (opcional, solo para pruebas) ---");
  try {
    await db.getDb().collection('users').deleteMany({});
    await db.getDb().collection('projects').deleteMany({});
    await db.getDb().collection('tasks').deleteMany({});
    console.log("Colecciones limpiadas.");
  } catch (error) {
    console.error("Error al limpiar colecciones:", error);
  }

  // 2. Insertar datos de prueba usando los servicios
  console.log("\n--- Creando datos de prueba ---");

  // Usuarios
  const user1 = await userService.createUser({ username: 'juanperez', email: 'juan.perez@example.com', password: 'hashed_password_juan' });
  const user2 = await userService.createUser({ username: 'mariagomez', email: 'maria.gomez@example.com', password: 'hashed_password_maria' });

  // Proyectos
  const project1 = await projectService.createProject({
    name: 'Proyecto Marketing Q3',
    description: 'Campaña de marketing para el tercer trimestre.',
    createdBy: user1._id // ID del usuario Juan
  });

  const project2 = await projectService.createProject({
    name: 'Desarrollo Nueva Feature',
    description: 'Implementación de la funcionalidad X en la aplicación.',
    createdBy: user2._id // ID del usuario Maria
  });

  // Tareas
  await taskService.createTask({
    title: 'Diseñar banners publicitarios',
    description: 'Crear 5 diseños de banners para la campaña digital.',
    projectId: project1._id,
    assignedTo: user1._id,
    status: 'En Progreso',
    dueDate: new Date('2024-07-01T23:59:59Z')
  });

  await taskService.createTask({
    title: 'Investigación de mercado',
    description: 'Análisis de la competencia y tendencias de mercado.',
    projectId: project1._id,
    assignedTo: null,
    status: 'Pendiente',
    dueDate: new Date('2024-06-30T23:59:59Z')
  });

  const completedTask = await taskService.createTask({
    title: 'Implementar API de autenticación',
    description: 'Desarrollar los endpoints para login y registro de usuarios.',
    projectId: project2._id,
    assignedTo: user2._id,
    status: 'Completada',
    dueDate: new Date('2024-05-30T23:59:59Z') // Esta tarea ya debería estar vencida y completada
  });

  await taskService.createTask({
    title: 'Crear tests unitarios para módulo de usuarios',
    description: 'Escribir pruebas para el módulo de gestión de usuarios.',
    projectId: project2._id,
    assignedTo: user2._id,
    status: 'En Progreso',
    dueDate: new Date('2024-07-15T23:59:59Z')
  });

  // 3. Ejecutar algunas consultas para demostrar la funcionalidad
  console.log("\n--- Demostrando consultas ---");

  console.log("\nUsuarios en el sistema:");
  const allUsers = await userService.getAllUsers();
  console.dir(allUsers, { depth: null });

  console.log("\nProyectos creados por Juan Perez:");
  const juanProjects = await projectService.getProjectsByUser(user1._id);
  console.dir(juanProjects, { depth: null });

  console.log("\nTareas del Proyecto Marketing Q3:");
  const marketingTasks = await taskService.getTasksByProject(project1._id);
  console.dir(marketingTasks, { depth: null });

  console.log("\nActualizando estado de una tarea (Implementar API de autenticación -> En Progreso):");
  await taskService.updateTaskStatus(completedTask._id, 'En Progreso');
  const updatedTask = await taskService.getTaskById(completedTask._id);
  console.dir(updatedTask, { depth: null });


  console.log("\nTareas 'En Progreso':");
  const inProgressTasks = await taskService.getTasksByStatus('En Progreso');
  console.dir(inProgressTasks, { depth: null });

  console.log("\nTareas vencidas (dueDate en el pasado y no 'Completada'):");
  const overdueTasks = await taskService.getOverdueTasks();
  console.dir(overdueTasks, { depth: null });

  // Opcional: Cerrar la conexión si el script no es un servidor persistente
  await db.closeConnection();

  console.log("\nAplicación finalizada.");
}

// Ejecutamos la función principal
main().catch(error => {
  console.error("Error fatal en la aplicación:", error);
  process.exit(1);
});