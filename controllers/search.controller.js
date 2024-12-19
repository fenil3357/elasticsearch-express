import req from "express/lib/request.js";
import client from "../config/elasticsearch.config.js";

// Basic search on fields name and description
export const basicSearchController = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['name', 'description']
          }
        }
      }
    });
    return res.json(result.hits.hits);
  } catch (error) {
    console.log("🚀 ~ basicSearchController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Advanced search with filters
export const advancedSearchController = async (req, res) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      inStock,
      minRating
    } = req.body;

    const must = [];
    const filter = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['name^2', 'description'],
          fuzziness: 'AUTO'
        }
      });
    }

    if (category) {
      filter.push({ term: { category } });
    }

    if (minPrice || maxPrice) {
      filter.push({
        range: {
          price: {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice })
          }
        }
      });
    }

    if (inStock !== undefined) {
      filter.push({ term: { inStock } });
    }

    if (minRating) {
      filter.push({ range: { rating: { gte: minRating } } });
    }

    const results = await client.search({
      index: 'products',
      body: {
        query: {
          bool: {
            must,
            filter
          }
        },
        sort: [
          { _score: 'desc' },
          { rating: 'desc' }
        ]
      }
    })

    return res.json(results.hits.hits)
  } catch (error) {
    console.log("🚀 ~ advancedSearchController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Autocomplete search
export const autoCompleteSearchController = async (req, res) => {
  try {
    const { q } = req?.query;

    const result = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['name'],
            type: 'phrase_prefix'
          }
        },
        _source: ['name'],
        size: 5
      }
    });

    return res.json(result.hits.hits);
  } catch (error) {
    console.log("🚀 ~ autoCompleteSearchController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}

// Faceted search
export const facetedSearchController = async (req, res) => {
  try {
    const { query } = req.body;

    const result = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'description']
          }
        },
        aggs: {
          categories: {
            terms: {
              field: 'category'
            }
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { to: 500 },
                { from: 500, to: 1000 },
                { from: 1000, to: 1500 },
                { from: 1500, to: 2000 },
                { from: 2000 }
              ]
            }
          },
          avg_rating: {
            avg: { field: 'rating' }
          },
          tags: {
            terms: { field: 'tags' }
          }
        }
      }
    });

    return res.json({
      hits: result.hits.hits,
      aggregations: result.aggregations
    })
  } catch (error) {
    console.log("🚀 ~ facetedSearchController ~ error:", error)
    return res.status(500).json({ message: error?.message })
  }
}