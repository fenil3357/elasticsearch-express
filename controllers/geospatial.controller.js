import client from "../config/elasticsearch.config.js";

// Search products by location
export const nearbyProductsController = async (req, res) => {
  try {
    const { lat, lon, distance = 10 } = req.query;

    const result = await client.search({
      index: 'products',
      body: {
        query: {
          bool: {
            filter: {
              geo_distance: {
                distance: `${distance}km`,
                location: { lat, lon },
              },
            },
          },
        },
        sort: [
          {
            _geo_distance: {
              location: { lat, lon },
              order: 'asc',
              unit: 'km',
            },
          },
        ],
      },
    });
    return res.json(result.hits);
  } catch (error) {
    console.log("🚀 ~ nearbyProductsController ~ error:", error);
    return res.status(500).json({ message: error?.message });
  }
};

// Store coverage analysis
export const coverageAnalysisController = async (req, res) => {
  try {
    const result = await client.search({
      index: 'products',
      body: {
        size: 0,
        aggs: {
          store_coverage: {
            geohash_grid: {
              field: 'location',
              precision: 4
            },
            aggs: {
              product_count: {
                value_count: { field: 'id' }
              },
              avg_price: {
                avg: { field: 'price' }
              }
            }
          }
        }
      }
    });

    return res.json(result.aggregations)
  } catch (error) {
    console.log("🚀 ~ coverageAnalysisController ~ error:", error)
    return res.status(500).json({ message: error?.message });
  }
}