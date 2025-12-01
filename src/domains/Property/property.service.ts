import Property from "./property.model";
import redis from "../../config/redis";

interface GetPropertiesOptions {
  page: number;
  limit: number;
  location?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Service to create a new property
const createProperty = async (propertyData: any) => {
  const newProperty = new Property(propertyData);
  await newProperty.save();
  return newProperty;
};

// Service to get all properties with filtering and pagination
const getAllProperties = async (options: GetPropertiesOptions) => {
  const { page, limit, location, type, status, minPrice, maxPrice } = options;

  // Create cache key based on query parameters
  const cacheKey = `properties:${page}:${limit}:${location || "all"}:${
    type || "all"
  }:${status || "all"}:${minPrice || "none"}:${maxPrice || "none"}`;

  try {
    // Try to get cached result first
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    // Build filter object
    const filter: any = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" }; // Case insensitive search
    }

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Property.countDocuments(filter);

    // Get filtered and paginated results
    const properties = await Property.find(filter)
      .select(
        "_id title location price status type createdAt image bedrooms bathrooms area"
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    const result = {
      data: properties,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    };

    // Cache the result for 30 minutes (1800 seconds)
    await redis.setex(cacheKey, 1800, JSON.stringify(result));

    return result;
  } catch (error) {
    console.error("Redis error in getAllProperties:", error);
    // Fallback to database if Redis fails
    // Build filter object
    const filter: any = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" }; // Case insensitive search
    }

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Property.countDocuments(filter);

    // Get filtered and paginated results
    const properties = await Property.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: properties,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    };
  }
};

// Service to get a property by its ID with Redis caching
const getPropertyById = async (propertyId: string) => {
  const cacheKey = `property:${propertyId}`;

  try {
    // Try to get property from cache first
    const cachedProperty = await redis.get(cacheKey);

    if (cachedProperty) {
      return JSON.parse(cachedProperty);
    }

    // If not in cache, get from database
    const property = await Property.findById(propertyId);

    if (property) {
      // Cache the property for 1 hour (3600 seconds)
      await redis.setex(cacheKey, 3600, JSON.stringify(property));
    }

    return property;
  } catch (error) {
    console.error("Redis error in getPropertyById:", error);
    // Fallback to database if Redis fails
    return Property.findById(propertyId);
  }
};

// Service to update a property - also update cache
const updateProperty = async (propertyId: string, propertyData: any) => {
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertyData,
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators are run
    }
  );

  if (updatedProperty) {
    // Invalidate the cached property
    const cacheKey = `property:${propertyId}`;
    await redis.del(cacheKey);
  }

  return updatedProperty;
};

// Service to delete a property - also remove from cache
const deleteProperty = async (propertyId: string) => {
  const deletedProperty = await Property.findByIdAndDelete(propertyId);

  if (deletedProperty) {
    // Remove the property from cache
    const cacheKey = `property:${propertyId}`;
    await redis.del(cacheKey);
  }

  return deletedProperty;
};

// Function to clear property list caches when properties are modified
const clearPropertyListCache = async () => {
  // In a more advanced implementation, we could use Redis tags or a more sophisticated cache invalidation strategy
  // For now, we'll just clear any cached property lists by using a pattern, but we need a way that doesn't rely on keys() command
  // Since the keys command might be disabled in production, we'll skip this for now and implement a more robust solution
  // A production implementation would use Redis tags or maintain a list of cache keys in a set
};

export default {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
