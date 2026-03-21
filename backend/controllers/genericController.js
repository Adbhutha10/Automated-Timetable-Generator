import { prisma } from '../index.js';

export const getItems = async (model, req, res) => {
  try {
    const items = await prisma[model].findMany();
    res.json(items);
  } catch (error) {
    console.error(`Get ${model} error:`, error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const createItem = async (model, req, res) => {
  try {
    const item = await prisma[model].create({ data: req.body });
    res.json(item);
  } catch (error) {
    console.error(`Create ${model} error:`, error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const updateItem = async (model, req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const item = await prisma[model].update({
      where: { id: numericId },
      data: req.body,
    });
    res.json(item);
  } catch (error) {
    console.error(`Update ${model} error:`, error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const deleteItem = async (model, req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    await prisma[model].delete({ where: { id: numericId } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error(`Delete ${model} error:`, error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
