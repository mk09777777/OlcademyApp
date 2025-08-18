const express = require("express");
const stringSimilarity = require("string-similarity");
const NodeCache = require("node-cache");
const Firm = require("../models/Firm");
const Tiffin = require("../models/Tiffin");
const router = express.Router();

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

class RestaurantAndTiffinSearchEngine {
  constructor() {
    // No in-memory storage needed; we'll query MongoDB directly
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const dlon = toRadians(lon2 - lon1);
    const dlat = toRadians(lat2 - lat1);
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371; // Earth radius in km
    return c * r;
  }

  async search(query, userLat = null, userLon = null, distanceWeight = 0.4) {
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      throw new Error("Valid query parameter is required");
    }
    query = query.toLowerCase().trim();

    const cacheKey = `search:${query}:${userLat}:${userLon}:with_tiffins`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) return cachedResults;

    // Fetch restaurant and tiffin names
    const allRestaurants = await Firm.distinct("restaurantInfo.name");
    const allTiffins = await Tiffin.distinct("kitchenName");
    const allNames = [...allRestaurants, ...allTiffins];
    if (!allNames || allNames.length === 0) {
      console.log("No restaurants or tiffins found in database");
      return { restaurants: [], tiffins: [] };
    }

    // Filter names to those starting with the query or its first letter
    const queryFirstLetter = query[0];
    const prefixMatches = allNames.filter((name) =>
      name.toLowerCase().startsWith(query)
    );
    const letterMatches = allNames.filter(
      (name) =>
        name.toLowerCase().startsWith(queryFirstLetter) &&
        !prefixMatches.includes(name)
    );

    // Perform fuzzy matching only on prefix and letter matches
    const searchNames =
      prefixMatches.length > 0 ? prefixMatches : letterMatches;
    let matchedNames = [];
    if (searchNames.length > 0) {
      const fuzzyMatches = stringSimilarity.findBestMatch(query, searchNames);
      matchedNames = fuzzyMatches.ratings
        .filter((match) => match.rating >= 0.5)
        .map((match) => ({
          name: match.target,
          fuzzy_score: match.rating,
        }));
    }

    // If no prefix or letter matches, fall back to original fuzzy matching
    if (matchedNames.length === 0) {
      const fuzzyMatches = stringSimilarity.findBestMatch(query, allNames);
      matchedNames = fuzzyMatches.ratings
        .filter((match) => match.rating >= 0.5)
        .map((match) => ({
          name: match.target,
          fuzzy_score: match.rating,
        }));
    }

    // Restaurant pipeline with prefix matching
    const restaurantPipeline = [
      {
        $match: {
          $or: [
            { "restaurantInfo.name": { $in: matchedNames.map((m) => m.name) } },
            { "restaurantInfo.name": { $regex: `^${query}`, $options: "i" } },
            { "insights.name": { $regex: query, $options: "i" } },
          ],
        },
      },
      { $limit: 100 },
      {
        $unwind: {
          path: "$insights",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$restaurantInfo.name",
          restaurant_name: { $first: "$restaurantInfo.name" },
          id: { $first: "$_id" },
          rating: { $first: "$restaurantInfo.ratings.overall" },
          total_reviews: { $first: "$restaurantInfo.ratings.totalReviews" },
          image_url: { $first: { $arrayElemAt: ["$image_urls", 0] } },
          address: { $first: "$restaurantInfo.address" },
          latitude: { $first: "$latitude" },
          longitude: { $first: "$longitude" },
          quality_score: {
            $max: {
              $cond: [
                { $eq: ["$insights.class", "excellent"] },
                1.0,
                { $cond: [{ $eq: ["$insights.class", "good"] }, 0.5, 0] },
              ],
            },
          },
        },
      },
      {
        $addFields: {
          rating: { $ifNull: [{ $toDouble: "$rating" }, 0] },
          total_reviews: { $ifNull: ["$total_reviews", 0] },
          image_url: { $ifNull: ["$image_url", null] },
          address: { $ifNull: ["$address", null] },
          distance: {
            $cond: {
              if: { $and: [userLat, userLon, "$latitude", "$longitude"] },
              then: {
                $let: {
                  vars: {
                    lat1: { $toDouble: userLat },
                    lon1: { $toDouble: userLon },
                    lat2: { $toDouble: "$latitude" },
                    lon2: { $toDouble: "$longitude" },
                  },
                  in: {
                    $multiply: [
                      6371,
                      2,
                      {
                        $asin: {
                          $sqrt: {
                            $add: [
                              {
                                $pow: [
                                  {
                                    $sin: {
                                      $divide: [
                                        { $subtract: ["$$lat2", "$$lat1"] },
                                        2,
                                      ],
                                    },
                                  },
                                  2,
                                ],
                              },
                              {
                                $multiply: [
                                  { $cos: "$$lat1" },
                                  { $cos: "$$lat2" },
                                  {
                                    $pow: [
                                      {
                                        $sin: {
                                          $divide: [
                                            { $subtract: ["$$lon2", "$$lon1"] },
                                            2,
                                          ],
                                        },
                                      },
                                      2,
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          rating_score: { $divide: ["$rating", 5.0] },
          review_score: { $min: [1.0, { $divide: ["$total_reviews", 200] }] },
          distance_score: {
            $cond: {
              if: { $ne: ["$distance", null] },
              then: {
                $max: [0, { $subtract: [1, { $divide: ["$distance", 20.0] }] }],
              },
              else: 0.0,
            },
          },
        },
      },
      {
        $addFields: {
          combined_score: {
            $cond: {
              if: { $and: [userLat, userLon, "$distance"] },
              then: {
                $add: [
                  { $multiply: [0.4, "$fuzzy_score"] },
                  { $multiply: [0.15, "$quality_score"] },
                  { $multiply: [0.1, "$rating_score"] },
                  { $multiply: [0.05, "$review_score"] },
                  { $multiply: [distanceWeight, "$distance_score"] },
                ],
              },
              else: {
                $add: [
                  { $multiply: [0.5, "$fuzzy_score"] },
                  { $multiply: [0.3, "$quality_score"] },
                  { $multiply: [0.15, "$rating_score"] },
                  { $multiply: [0.05, "$review_score"] },
                ],
              },
            },
          },
        },
      },
      { $sort: { combined_score: -1 } },
      {
        $project: {
          _id: 0,
          type: { $literal: "restaurant" },
          restaurant_name: 1,
          id: 1,
          rating: 1,
          image_url: 1,
          address: 1,
          fuzzy_score: 1,
        },
      },
      { $limit: 20 },
    ];

    // Tiffin pipeline with prefix matching
    const tiffinPipeline = [
      {
        $match: {
          $or: [
            { kitchenName: { $in: matchedNames.map((m) => m.name) } },
            { kitchenName: { $regex: `^${query}`, $options: "i" } },
            { "menu.mealTypes.label": { $regex: query, $options: "i" } },
          ],
        },
      },
      { $limit: 100 },
      {
        $unwind: {
          path: "$menu.mealTypes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$kitchenName",
          tiffin_name: { $first: "$kitchenName" },
          id: { $first: "$_id" },
          rating: { $first: "$ratings" },
          image_url: { $first: { $arrayElemAt: ["$images", 0] } },
          address: { $first: "$address" },
          latitude: { $first: "$latitude" },
          longitude: { $first: "$longitude" },
          category: { $first: "$category" },
          quality_score: {
            $max: {
              $cond: [
                { $gte: [{ $toDouble: "$ratings" }, 4.0] },
                1.0,
                { $cond: [{ $gte: [{ $toDouble: "$ratings" }, 3.0] }, 0.5, 0] },
              ],
            },
          },
        },
      },
      {
        $addFields: {
          rating: { $ifNull: [{ $toDouble: "$rating" }, 0] },
          image_url: { $ifNull: ["$image_url", null] },
          address: { $ifNull: ["$address", null] },
          distance: {
            $cond: {
              if: { $and: [userLat, userLon, "$latitude", "$longitude"] },
              then: {
                $let: {
                  vars: {
                    lat1: { $toDouble: userLat },
                    lon1: { $toDouble: userLon },
                    lat2: { $toDouble: "$latitude" },
                    lon2: { $toDouble: "$longitude" },
                  },
                  in: {
                    $multiply: [
                      6371,
                      2,
                      {
                        $asin: {
                          $sqrt: {
                            $add: [
                              {
                                $pow: [
                                  {
                                    $sin: {
                                      $divide: [
                                        { $subtract: ["$$lat2", "$$lat1"] },
                                        2,
                                      ],
                                    },
                                  },
                                  2,
                                ],
                              },
                              {
                                $multiply: [
                                  { $cos: "$$lat1" },
                                  { $cos: "$$lat2" },
                                  {
                                    $pow: [
                                      {
                                        $sin: {
                                          $divide: [
                                            { $subtract: ["$$lon2", "$$lon1"] },
                                            2,
                                          ],
                                        },
                                      },
                                      2,
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          rating_score: { $divide: ["$rating", 5.0] },
          review_score: 0, // No total_reviews in Tiffin schema, set to 0
          distance_score: {
            $cond: {
              if: { $ne: ["$distance", null] },
              then: {
                $max: [0, { $subtract: [1, { $divide: ["$distance", 20.0] }] }],
              },
              else: 0.0,
            },
          },
        },
      },
      {
        $addFields: {
          combined_score: {
            $cond: {
              if: { $and: [userLat, userLon, "$distance"] },
              then: {
                $add: [
                  { $multiply: [0.4, "$fuzzy_score"] },
                  { $multiply: [0.15, "$quality_score"] },
                  { $multiply: [0.1, "$rating_score"] },
                  { $multiply: [0.05, "$review_score"] },
                  { $multiply: [distanceWeight, "$distance_score"] },
                ],
              },
              else: {
                $add: [
                  { $multiply: [0.5, "$fuzzy_score"] },
                  { $multiply: [0.3, "$quality_score"] },
                  { $multiply: [0.15, "$rating_score"] },
                  { $multiply: [0.05, "$review_score"] },
                ],
              },
            },
          },
        },
      },
      { $sort: { combined_score: -1 } },
      {
        $project: {
          _id: 0,
          type: { $literal: "tiffin" },
          tiffin_name: 1,
          id: 1,
          rating: 1,
          image_url: 1,
          address: 1,
          category: 1,
          fuzzy_score: 1,
        },
      },
      { $limit: 8 },
    ];

    let restaurantResults = await Firm.aggregate(restaurantPipeline).catch(
      (err) => {
        throw new Error(`Restaurant aggregation failed: ${err.message}`);
      }
    );

    let tiffinResults = await Tiffin.aggregate(tiffinPipeline).catch((err) => {
      throw new Error(`Tiffin aggregation failed: ${err.message}`);
    });

    // Process restaurant results
    restaurantResults = restaurantResults
      .map((result) => {
        const matched = matchedNames.find(
          (m) => m.name === result.restaurant_name
        ) || {
          fuzzy_score: result.restaurant_name.toLowerCase().startsWith(query)
            ? 1.0
            : 0,
        };
        return {
          ...result,
          fuzzy_score: matched.fuzzy_score,
          combined_score:
            userLat && userLon && result.distance
              ? 0.4 * matched.fuzzy_score +
                0.15 * result.quality_score +
                0.1 * result.rating_score +
                0.05 * result.review_score +
                distanceWeight * result.distance_score
              : 0.5 * matched.fuzzy_score +
                0.3 * result.quality_score +
                0.15 * result.rating_score +
                0.05 * result.review_score,
        };
      })
      .filter((result) =>
        result.restaurant_name.toLowerCase().startsWith(queryFirstLetter)
      );

    // Process tiffin results
    tiffinResults = tiffinResults
      .map((result) => {
        const matched = matchedNames.find(
          (m) => m.name === result.tiffin_name
        ) || {
          fuzzy_score: result.tiffin_name.toLowerCase().startsWith(query)
            ? 1.0
            : 0,
        };
        return {
          ...result,
          fuzzy_score: matched.fuzzy_score,
          combined_score:
            userLat && userLon && result.distance
              ? 0.4 * matched.fuzzy_score +
                0.15 * result.quality_score +
                0.1 * result.rating_score +
                0.05 * result.review_score +
                distanceWeight * result.distance_score
              : 0.5 * matched.fuzzy_score +
                0.3 * result.quality_score +
                0.15 * result.rating_score +
                0.05 * result.review_score,
        };
      })
      .filter((result) =>
        result.tiffin_name.toLowerCase().startsWith(queryFirstLetter)
      );

    restaurantResults.sort((a, b) => b.combined_score - a.combined_score);
    tiffinResults.sort((a, b) => b.combined_score - a.combined_score);

    const results = {
      restaurants: restaurantResults,
      tiffins: tiffinResults,
    };

    cache.set(cacheKey, results);
    return results;
  }

  async recommendRestaurants(restaurantName) {
    try {
      const target = await Firm.findOne({
        "restaurantInfo.name": { $regex: `^${restaurantName}$`, $options: "i" },
      });
      if (!target) {
        console.log(`No restaurant found for name: ${restaurantName}`);
        return [];
      }

      const targetFoods = new Set(
        (target.insights || [])
          .map((insight) => insight?.name?.toLowerCase())
          .filter((name) => name)
      );
      const targetRating = parseFloat(
        target.restaurantInfo?.ratings?.overall || 0
      );
      const targetLat = parseFloat(target.latitude || 0);
      const targetLon = parseFloat(target.longitude || 0);

      const validTargetCoords =
        targetLat &&
        targetLon &&
        !isNaN(targetLat) &&
        !isNaN(targetLon) &&
        targetLat >= -90 &&
        targetLat <= 90 &&
        targetLon >= -180 &&
        targetLon <= 180;

      const pipeline = [
        {
          $match: {
            "restaurantInfo.name": { $ne: target.restaurantInfo?.name || "" },
            "restaurantInfo.ratings.overall": { $exists: true },
          },
        },
        {
          $unwind: {
            path: "$insights",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$restaurantInfo.name",
            restaurant_name: { $first: "$restaurantInfo.name" },
            id: { $first: "$_id" },
            price: { $first: "$restaurantInfo.priceRange" },
            additionalDetails: {
              $first: {
                $ifNull: [
                  "$restaurantInfo.additionalInfo.additionalDetails",
                  "",
                ],
              },
            },
            rating: { $first: "$restaurantInfo.ratings.overall" },
            image_url: { $first: { $arrayElemAt: ["$image_urls", 0] } },
            address: { $first: "$restaurantInfo.address" },
            insights: { $push: "$insights.name" },
            latitude: { $first: "$latitude" },
            longitude: { $first: "$longitude" },
          },
        },
        {
          $addFields: {
            rating: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$rating", ""] },
                    { $eq: ["$rating", null] },
                    { $not: { $isNumber: { $toDouble: "$rating" } } },
                  ],
                },
                then: 0,
                else: { $toDouble: { $ifNull: ["$rating", 0] } },
              },
            },
            latitude: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$latitude", ""] },
                    { $eq: ["$latitude", null] },
                    { $not: { $isNumber: { $toDouble: "$latitude" } } },
                  ],
                },
                then: null,
                else: { $toDouble: "$latitude" },
              },
            },
            longitude: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$longitude", ""] },
                    { $eq: ["$longitude", null] },
                    { $not: { $isNumber: { $toDouble: "$longitude" } } },
                  ],
                },
                then: null,
                else: { $toDouble: "$longitude" },
              },
            },
            price: { $ifNull: ["$price", null] },
            additionalDetails: { $ifNull: ["$additionalDetails", ""] },
            image_url: { $ifNull: ["$image_url", null] },
            address: { $ifNull: ["$address", null] },
          },
        },
        {
          $addFields: {
            distance: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [validTargetCoords ? targetLat : null, null] },
                    { $ne: [validTargetCoords ? targetLon : null, null] },
                    { $ne: ["$latitude", null] },
                    { $ne: ["$longitude", null] },
                    { $gte: ["$latitude", -90] },
                    { $lte: ["$latitude", 90] },
                    { $gte: ["$longitude", -180] },
                    { $lte: ["$longitude", 180] },
                  ],
                },
                then: {
                  $round: [
                    {
                      $let: {
                        vars: {
                          lat1: {
                            $toDouble: validTargetCoords ? targetLat : 0,
                          },
                          lon1: {
                            $toDouble: validTargetCoords ? targetLon : 0,
                          },
                          lat2: { $toDouble: "$latitude" },
                          lon2: { $toDouble: "$longitude" },
                          toRad: 0.017453292519943295, // PI / 180
                        },
                        in: {
                          $multiply: [
                            6371, // Earth radius in km
                            2,
                            {
                              $asin: {
                                $sqrt: {
                                  $add: [
                                    {
                                      $pow: [
                                        {
                                          $sin: {
                                            $multiply: [
                                              {
                                                $subtract: ["$$lat2", "$$lat1"],
                                              },
                                              "$$toRad",
                                              0.5,
                                            ],
                                          },
                                        },
                                        2,
                                      ],
                                    },
                                    {
                                      $multiply: [
                                        {
                                          $cos: {
                                            $multiply: ["$$lat1", "$$toRad"],
                                          },
                                        },
                                        {
                                          $cos: {
                                            $multiply: ["$$lat2", "$$toRad"],
                                          },
                                        },
                                        {
                                          $pow: [
                                            {
                                              $sin: {
                                                $multiply: [
                                                  {
                                                    $subtract: [
                                                      "$$lon2",
                                                      "$$lon1",
                                                    ],
                                                  },
                                                  "$$toRad",
                                                  0.5,
                                                ],
                                              },
                                            },
                                            2,
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                    2, // Round to 2 decimal places
                  ],
                },
                else: null,
              },
            },
          },
        },
        {
          $match: {
            distance: { $lte: 5 }, // Filter restaurants within 5km
          },
        },
        {
          $project: {
            _id: 0,
            type: { $literal: "restaurant" },
            restaurant_name: 1,
            id: 1,
            price: 1,
            additionalDetails: 1,
            rating: 1,
            image_url: 1,
            address: 1,
            insights: 1,
            latitude: 1,
            longitude: 1,
            distance: 1,
          },
        },
        { $limit: 100 },
      ];

      let results = await Firm.aggregate(pipeline).catch(async (err) => {
        console.error(
          "Aggregation failed for restaurants:",
          JSON.stringify(pipeline, null, 2)
        );
        console.error(
          "Sample documents causing error:",
          JSON.stringify(
            await Firm.find(
              { "restaurantInfo.ratings.overall": { $type: "string" } },
              {
                "restaurantInfo.ratings.overall": 1,
                _id: 1,
                latitude: 1,
                longitude: 1,
              }
            )
              .limit(5)
              .toArray(),
            null,
            2
          )
        );
        throw new Error(`Database aggregation failed: ${err.message}`);
      });

      results = results.map((result) => {
        const foodIntersection = result.insights
          ? result.insights.filter((food) =>
              targetFoods.has(food?.toLowerCase())
            )
          : [];
        const foodUnion = new Set([...targetFoods, ...(result.insights || [])])
          .size;
        const foodSimilarity =
          foodUnion > 0 ? foodIntersection.length / foodUnion : 0;

        const ratingSimilarity = result.rating
          ? 1 - Math.abs(result.rating - targetRating) / 5.0
          : 0;

        let distance = result.distance;
        if (
          distance === null &&
          validTargetCoords &&
          result.latitude &&
          result.longitude &&
          result.latitude >= -90 &&
          result.latitude <= 90 &&
          result.longitude >= -180 &&
          result.longitude <= 180
        ) {
          distance = Number(
            this.haversineDistance(
              targetLat,
              targetLon,
              result.latitude,
              result.longitude
            ).toFixed(2)
          );
        }

        if (distance === null || distance > 5) {
          return null;
        }

        const distanceSimilarity = distance !== null ? 1 / (1 + distance) : 0;

        const nameSimilarity = stringSimilarity.compareTwoStrings(
          (target.restaurantInfo?.name || "").toLowerCase(),
          result.restaurant_name || ""
        );

        const combinedScore =
          0.4 * foodSimilarity +
          0.3 * ratingSimilarity +
          0.2 * distanceSimilarity +
          0.1 * nameSimilarity;

        if (!result.additionalDetails) {
          console.log(
            `Missing additionalDetails for ${result.restaurant_name}`
          );
        }
        if (distance === null) {
          console.log(
            `Invalid distance for ${result.restaurant_name}: lat=${result.latitude}, lon=${result.longitude}`
          );
        }

        return {
          type: "restaurant",
          restaurant_name: result.restaurant_name,
          id: result.id,
          price: result.price,
          additionalDetails: result.additionalDetails,
          rating: result.rating,
          image_url: result.image_url,
          address: result.address,
          distance: distance,
          food_similarity: foodSimilarity,
          rating_similarity: ratingSimilarity,
          distance_similarity: distanceSimilarity,
          name_similarity: nameSimilarity,
          combined_score: combinedScore,
        };
      });

      results = results.filter((result) => result !== null);
      results.sort((a, b) => b.combined_score - a.combined_score);
      results = results.slice(0, 6);

      console.log("Processed results:", results.length);
      return results;
    } catch (error) {
      console.error("Recommend aggregation error:", error.message, error.stack);
      throw new Error(`Recommend failed: ${error.message}`);
    }
  }

  async getRestaurantDetails(restaurantName) {
    try {
      const allRestaurants = await Firm.distinct("restaurantInfo.name");
      if (!allRestaurants || allRestaurants.length === 0) {
        console.log("No restaurants found in database");
        return {};
      }
      const matched = stringSimilarity.findBestMatch(
        restaurantName,
        allRestaurants
      );
      if (!matched.bestMatch || matched.bestMatch.rating < 0.4) {
        console.log(`No close match found for name: ${restaurantName}`);
        return {};
      }
      const matchedName = matched.bestMatch.target;

      const restaurant = await Firm.findOne({
        "restaurantInfo.name": matchedName,
      });
      if (!restaurant) {
        console.log(`No restaurant found for matched name: ${matchedName}`);
        return {};
      }
      return {
        type: "restaurant",
        restaurant_name: restaurant.restaurantInfo?.name || null,
        id: restaurant._id || null,
        rating: parseFloat(restaurant.restaurantInfo?.ratings?.overall || 0),
        image_url: restaurant.image_urls?.[0] || null,
        address: restaurant.restaurantInfo?.address || null,
      };
    } catch (error) {
      console.error("Get restaurant details error:", error);
      throw new Error(`Get restaurant details failed: ${error.message}`);
    }
  }

  async getBestFoodItem(query) {
    try {
      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return null;
      }
      query = query.toLowerCase().trim();

      // Restaurant pipeline for food items
      const restaurantPipeline = [
        { $unwind: "$insights" },
        {
          $match: {
            "insights.class": { $regex: "excellent|good", $options: "i" },
          },
        },
        {
          $group: {
            _id: {
              food_item: "$insights.name",
              restaurant_id: "$_id",
            },
          },
        },
        {
          $sort: { "_id.food_item": 1 },
        },
        {
          $project: {
            _id: 0,
            food_item: "$_id.food_item",
            id: "$_id.restaurant_id",
            type: { $literal: "restaurant" },
          },
        },
      ];

      // Tiffin pipeline for food items
      const tiffinPipeline = [
        { $unwind: "$menu.mealTypes" },
        {
          $group: {
            _id: {
              food_item: "$menu.mealTypes.label",
              tiffin_id: "$_id",
            },
          },
        },
        {
          $sort: { "_id.food_item": 1 },
        },
        {
          $project: {
            _id: 0,
            food_item: "$_id.food_item",
            id: "$_id.tiffin_id",
            type: { $literal: "tiffin" },
          },
        },
      ];

      const restaurantResults = await Firm.aggregate(restaurantPipeline);
      const tiffinResults = await Tiffin.aggregate(tiffinPipeline);
      const results = [
        ...restaurantResults.map((r) => ({
          food_item: r.food_item,
          id: r.id,
          type: r.type,
        })),
        ...tiffinResults.map((r) => ({
          food_item: r.food_item,
          id: r.id,
          type: r.type,
        })),
      ];

      const foodItems = results.map((r) => r.food_item).filter((item) => item);

      if (!foodItems || foodItems.length === 0) {
        console.log("No food items found in database");
        return null;
      }

      const fuzzyMatches = stringSimilarity.findBestMatch(query, foodItems);
      const bestMatch = fuzzyMatches.bestMatch;
      if (!bestMatch || bestMatch.rating < 0.4) {
        console.log(`No close food item match found for query: ${query}`);
        return null;
      }

      const bestResult = results.find((r) => r.food_item === bestMatch.target);

      return {
        food_item: bestMatch.target,
        similarity_score: bestMatch.rating,
        id: bestResult ? bestResult.id : null,
        type: bestResult ? bestResult.type : null,
      };
    } catch (error) {
      console.error("Get best food item error:", error);
      throw new Error(`Get best food item failed: ${error.message}`);
    }
  }
}

const engine = new RestaurantAndTiffinSearchEngine();

router.get("/search", async (req, res) => {
  const { query, lat, lon } = req.query;
  console.log("Search query:", req.query);
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Valid query parameter is required" });
  }
  const sanitizedQuery = query.replace(/[<>{}]/g, "").trim();
  const parsedLat = lat ? parseFloat(lat) : null;
  const parsedLon = lon ? parseFloat(lon) : null;
  if (
    (parsedLat && (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90)) ||
    (parsedLon && (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180))
  ) {
    return res.status(400).json({ error: "Invalid latitude or longitude" });
  }

  const cacheKey = `search:${sanitizedQuery}:${parsedLat}:${parsedLon}:with_tiffins_recommendations`;
  const cachedResults = cache.get(cacheKey);
  if (cachedResults) {
    console.log("Returning cached results for:", cacheKey);
    return res.json(cachedResults);
  }

  try {
    // Fetch search results
    const { restaurants, tiffins } = await engine.search(
      sanitizedQuery,
      parsedLat,
      parsedLon
    );
    console.log("Restaurant results:", restaurants.length);
    console.log("Tiffin results:", tiffins.length);

    // Fetch best food item
    const bestFoodItem = await engine.getBestFoodItem(sanitizedQuery);
    console.log("Best food item:", bestFoodItem);

    // Fetch recommended restaurants
    let recommendedRestaurants = [];
    const allRestaurants = await Firm.distinct("restaurantInfo.name");
    const allTiffins = await Tiffin.distinct("kitchenName");
    const allNames = [...allRestaurants, ...allTiffins];
    if (allNames && allNames.length > 0) {
      const matched = stringSimilarity.findBestMatch(sanitizedQuery, allNames);
      if (matched.bestMatch && matched.bestMatch.rating >= 0.4) {
        const matchedName = matched.bestMatch.target;
        console.log("Matched name for recommendations:", matchedName);
        if (allRestaurants.includes(matchedName)) {
          recommendedRestaurants = await engine.recommendRestaurants(
            matchedName
          );
        }
      } else if (bestFoodItem && bestFoodItem.id && bestFoodItem.type) {
        if (bestFoodItem.type === "restaurant") {
          const restaurant = await Firm.findOne(
            { _id: bestFoodItem.id },
            { "restaurantInfo.name": 1 }
          );
          if (restaurant && restaurant.restaurantInfo?.name) {
            console.log(
              "Using restaurant for food item for recommendations:",
              restaurant.restaurantInfo.name
            );
            recommendedRestaurants = await engine.recommendRestaurants(
              restaurant.restaurantInfo.name
            );
          }
        }
      }
    }
    console.log("Recommended restaurants:", recommendedRestaurants.length);

    // Combine results
    const response = {
      restaurants,
      tiffins,
      foodItem: bestFoodItem,
      recommendedRestaurants,
    };

    // Cache the entire response
    cache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error("Search error:", error.message, error.stack);
    res.status(500).json({ error: `Search failed: ${error.message}` });
  }
});

router.get("/recommend", async (req, res) => {
  const { restaurant } = req.query;
  console.log("Recommend query:", req.query);
  if (
    !restaurant ||
    typeof restaurant !== "string" ||
    restaurant.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Valid restaurant parameter is required" });
  }
  const sanitizedRestaurant = restaurant.replace(/[<>{}]/g, "").trim();
  const cacheKey = `recommend:${sanitizedRestaurant}`;
  const cachedResults = cache.get(cacheKey);
  if (cachedResults) {
    console.log("Returning cached results for:", cacheKey);
    return res.json(cachedResults);
  }

  try {
    const allRestaurants = await Firm.distinct("restaurantInfo.name");
    console.log("Distinct restaurant names:", allRestaurants.length);
    if (!allRestaurants || allRestaurants.length === 0) {
      return res
        .status(404)
        .json({ error: "No restaurants found in database" });
    }
    const matched = stringSimilarity.findBestMatch(
      sanitizedRestaurant,
      allRestaurants
    );
    if (!matched.bestMatch || matched.bestMatch.rating < 0.4) {
      return res.status(404).json({
        error: `No matching restaurant found for '${sanitizedRestaurant}'`,
      });
    }
    const matchedName = matched.bestMatch.target;
    console.log("Matched restaurant name:", matchedName);

    const results = await engine.recommendRestaurants(matchedName);
    console.log("Recommend results:", results.length);
    cache.set(cacheKey, results);
    res.json(results);
  } catch (error) {
    console.error("Recommend endpoint error:", error.message, error.stack);
    res.status(500).json({ error: `Recommend failed: ${error.message}` });
  }
});

router.get("/restaurant/:name", async (req, res) => {
  const { name } = req.params;
  console.log("Restaurant details query:", name);
  try {
    const details = await engine.getRestaurantDetails(name);
    if (Object.keys(details).length === 0) {
      return res.status(404).json({ error: `Restaurant '${name}' not found` });
    }
    res.json(details);
  } catch (error) {
    console.error("Restaurant details endpoint error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
