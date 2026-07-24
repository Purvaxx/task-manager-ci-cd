const store = require('../models/taskStore');

function listTasks(req, res) {
  res.json(store.getAll());
}

function getTask(req, res) {
  const task = store.getById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json(task);
}

function createTask(req, res) {
  const { title, done } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }
  const task = store.create({ title: title.trim(), done: Boolean(done) });
  return res.status(201).json(task);
}

function updateTask(req, res) {
  const id = Number(req.params.id);
  const existing = store.getById(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const { title, done } = req.body;
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }

  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (done !== undefined) updates.done = Boolean(done);

  const updated = store.update(id, updates);
  return res.json(updated);
}

function deleteTask(req, res) {
  const id = Number(req.params.id);
  const removed = store.remove(id);
  if (!removed) return res.status(404).json({ error: 'Task not found' });
  return res.status(204).send();
}

module.exports = {
  listTasks, getTask, createTask, updateTask, deleteTask,
};
