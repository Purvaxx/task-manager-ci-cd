// Simple in-memory data store.
// In a real project this would be a database (Postgres, Mongo, etc.).
// Kept in-memory here so the CI pipeline and Docker image stay dependency-free.

let tasks = [];
let nextId = 1;

function reset() {
  tasks = [];
  nextId = 1;
}

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((task) => task.id === id);
}

function create({ title, done = false }) {
  const task = { id: nextId, title, done, createdAt: new Date().toISOString() };
  nextId += 1;
  tasks.push(task);
  return task;
}

function update(id, updates) {
  const task = getById(id);
  if (!task) return null;
  Object.assign(task, updates);
  return task;
}

function remove(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = {
  reset, getAll, getById, create, update, remove,
};
