import client from "../config/elasticsearch.config.js";

// Product recommendations
export const similarProductsController = async (req, res) => {
  try {
    const { id } = req?.params;

    // Get product details
    const product = await client.get({
      index: 'products',
      id
    });

    const { category, tags } = product._source

    // Find similar products
    const result = await client.search({
      index: 'products',
      body: {
        query: {
          bool: {
            should: [
              { terms: { category: [category] } },
              { terms: { tags } }
            ],
            must_not: [
              { term: { _id: id } }
            ],
            minimum_should_match: 1
          }
        },
        size: 5
      }
    });

    return res.json(result.hits.hits);
  } catch (error) {
    console.log("🚀 ~ similarProductsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Personalized recommendations based on user behavior
export const personalizedRecommendationsController = async (req, res) => {
  try {
    const { viewedProducts, purchasedProducts } = req?.body;

    const result = await client.search({
      index: 'products',
      body: {
        query: {
          bool: {
            should: [
              {
                more_like_this: {
                  fields: ['name', 'description', 'category', 'tags'],
                  like: viewedProducts.map(id => ({
                    _index: 'products',
                    _id: id
                  })),
                  min_term_freq: 1,
                  max_query_terms: 12
                }
              },
              {
                terms: {
                  _id: purchasedProducts,
                  boost: 2.0
                }
              }
            ],
            must_not: {
              ids: {
                values: [
                  ...viewedProducts,
                  ...purchasedProducts
                ]
              }
            }
          }
        },
        size: 10
      }
    });

    return res.json(result.hits.hits);
  } catch (error) {
    console.log("🚀 ~ personalizedRecommendationsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}