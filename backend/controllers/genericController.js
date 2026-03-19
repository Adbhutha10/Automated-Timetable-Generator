import { prisma } from '../index.js';

export const getItems = async (model, req, res) => {
  try {
    const items = await prisma[model].findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createItem = async (model, req, res) => {
  try {
    const item = await prisma[model].create({ data: req.body });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateItem = async (model, req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma[model].update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteItem = async (model, req, res) => {
  try {
    const { id } = req.params;
    await prisma[model].delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
