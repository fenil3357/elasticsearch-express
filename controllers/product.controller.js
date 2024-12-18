import client from "../config/elasticsearch.config.js"

export const createProductIndexController = async (req, res) => {
  try {
    await client.indices.create({
      index: 'products',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            category: { type: 'keyword' },
            tags: { type: 'keyword' },
            inStock: { type: 'boolean' },
            rating: { type: 'float' },
            createdAt: { type: 'date' }
          }
        }
      }
    });

    return res.json({ message: 'Product index created successfully!' })
  } catch (error) {
    console.log("🚀 ~ createProductIndexController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

export const bulkIndexProductsController = async (req, res) => {
  try {
    const body = req.body.flatMap(doc => [
      { index: { _index: 'products' } },
      doc
    ]);

    const result = await client.bulk({ body });
    return res.json(result);
  } catch (error) {
    console.log("🚀 ~ bulkIndexProductsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

export const updateProductController = async (req, res) => {
  try {
    const result = await client.update({
      index: 'products',
      id: req.params.id,
      body: {
        doc: req.body
      }
    });
    return res.json(result);
  } catch (error) {
    console.log("🚀 ~ updateProductController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

export const deleteProductController = async (req, res) => {
  try {
    const result = await client.delete({
      index: 'products',
      id: req.params.id
    });
    return res.json(result);
  } catch (error) {
    console.log("🚀 ~ deleteProductController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}