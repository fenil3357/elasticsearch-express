import client from "../config/elasticsearch.config.js";

// Low stock alerts
export const lowStockAlertController = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const result = await client.search({
      index: 'products',
      size: 50,
      body: {
        query: {
          bool: {
            must: [
              { range: { quantity: { lte: threshold } } }
            ]
          }
        },
        sort: [{ quantity: 'asc' }]
      }
    });

    return res.json(result.hits.hits);
  } catch (error) {
    console.log("🚀 ~ lowStockAlertController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Inventory insights
export const inventoryInsightsController = async (req, res) => {
  try {
    const result = await client.search({
      index: 'products',
      body: {
        size: 0,
        aggs: {
          stock_status: {
            terms: { field: 'inStock' },
            aggs: {
              total_value: {
                sum: {
                  script: {
                    source: "doc['price'].value * doc['quantity'].value"
                  }
                }
              }
            }
          },
          out_of_stock_analysis: {
            nested: { path: 'salesHistory' },
            aggs: {
              recent_stockouts: {
                date_histogram: {
                  field: 'salesHistory.date',
                  calendar_interval: 'week'
                },
                aggs: {
                  lost_revenue: {
                    sum: { field: 'salesHistory.revenue' }
                  }
                }
              }
            }
          }
        }
      }
    });

    return res.json(result.aggregations);
  } catch (error) {
    console.log("🚀 ~ inventoryInsightsController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Inventory forecasting
export const inventoryForecastController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.search({
      index: 'products',
      body: {
        query: {
          bool: {
            must: [
              { term: { _id: id } }
            ]
          }
        },
        aggs: {
          sales_trend: {
            nested: { path: 'salesHistory' },
            aggs: {
              monthly_sales: {
                date_histogram: {
                  field: 'salesHistory.date',
                  calendar_interval: 'month'
                },
                aggs: {
                  total_quantity: {
                    sum: { field: 'salesHistory.quantity' }
                  },
                  sales_stats: {
                    stats: { field: 'salesHistory.quantity' }
                  }
                }
              }
            }
          }
        }
      }
    });

    return res.json(result.aggregations);
  } catch (error) {
    console.log("🚀 ~ inventoryForecastController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}