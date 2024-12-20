import client from "../config/elasticsearch.config.js"

// Popular products based on ratings
export const popularProductsController = async (req, res) => {
  try {
    const result = await client.search({
      index: 'products',
      body: {
        size: 10,
        sort: [{ rating: 'desc' }],
        query: {
          range: { rating: { gte: 4 } }
        }
      }
    });

    return res.json(result.hits.hits);
  } catch (error) {
    console.log("🚀 ~ popularProductsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Category statistics
export const categoryStatsController = async (req, res) => {
  try {
    const result = await client.search({
      index: 'products',
      body: {
        size: 0,
        aggs: {
          categories: {
            terms: { field: 'category' },
            aggs: {
              avg_price: { avg: { field: 'price' } },
              avg_rating: { avg: { field: 'rating' } },
              in_stock: {
                filter: { term: { inStock: true } }
              }
            }
          }
        }
      }
    });

    return res.json(result.aggregations);
  } catch (error) {
    console.log("🚀 ~ categoryStatsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Price distribution
export const pricesDistributionController = async (req, res) => {
  try {
    const result = await client.search({
      index: 'products',
      body: {
        size: 0,
        aggs: {
          price_histogram: {
            histogram: {
              field: 'price',
              interval: 50
            }
          }
        }
      }
    })

    return res.json(result.aggregations);
  } catch (error) {
    console.log("🚀 ~ pricesDistributionController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Trending products based on recent creation and high ratings
export const trendingProductsController = async (req, res) => {
  try {
    const result = await client.search({
      index: 'products',
      body: {
        size: 10,
        query: {
          function_score: {
            query: {
              bool: {
                must: [
                  { range: { rating: { gte: 4 } } }
                ]
              }
            },
            functions: [
              {
                exp: {
                  createdAt: {
                    origin: 'now',
                    scale: '7d',
                    decay: 0.5
                  }
                }
              }
            ],
            boost_mode: 'multiply'
          }
        }
      }
    });

    return res.json(result.hits.hits)
  } catch (error) {
    console.log("🚀 ~ tendingProductsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}