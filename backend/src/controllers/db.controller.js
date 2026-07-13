const MemoryDB = require('../utils/MemoryDB');
const { v4: uuidv4 } = require('uuid');

exports.getAll = (req, res, next) => {
  try {
    const data = MemoryDB.data;
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getCollection = (req, res, next) => {
  try {
    const { collection } = req.params;
    const data = MemoryDB.get(collection);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createDocument = (req, res, next) => {
  try {
    const { collection } = req.params;
    const items = MemoryDB.get(collection);
    const newItem = { id: req.body.id || uuidv4(), ...req.body };
    items.push(newItem);
    MemoryDB.set(collection, items);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

exports.updateDocument = (req, res, next) => {
  try {
    const { collection, id } = req.params;
    const items = MemoryDB.get(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    items[index] = { ...items[index], ...req.body };
    MemoryDB.set(collection, items);
    res.status(200).json({ success: true, data: items[index] });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = (req, res, next) => {
  try {
    const { collection, id } = req.params;
    const items = MemoryDB.get(collection);
    const filtered = items.filter(item => item.id !== id);
    MemoryDB.set(collection, filtered);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.syncDatabase = (req, res, next) => {
  try {
    // Allows frontend to send its initial local storage seed data if backend is empty
    const fullState = req.body;
    for (const key of Object.keys(fullState)) {
      if (Array.isArray(fullState[key])) {
        const existing = MemoryDB.get(key);
        if (existing.length === 0) {
           MemoryDB.set(key, fullState[key]);
        }
      }
    }
    res.status(200).json({ success: true, message: 'Database synced' });
  } catch (err) {
    next(err);
  }
};
