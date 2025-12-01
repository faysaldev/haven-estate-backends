import Property, { IProperty } from "./property.model";
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

// Service to increment view count for a property
const incrementViewCount = async (propertyId: string) => {
  try {
    await Property.findByIdAndUpdate(
      propertyId,
      { $inc: { views: 1 } }, // Increment the views field by 1
      { new: true, runValidators: true }
    );

    // Invalidate the cached property since we've updated the view count
    const cacheKey = `property:${propertyId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
};

// Service to create a new property
const createProperty = async (
  propertyData: Partial<IProperty>
): Promise<IProperty> => {
  const newProperty = new Property(propertyData);
  await newProperty.save();
  return newProperty;
};

// Service to get all properties with filtering and pagination
const getAllProperties = async (
  options: GetPropertiesOptions
): Promise<{
  data: IProperty[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}> => {
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

    const skip = (page - 1) * limit;
    const totalCount = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .select(
        "_id title location price status type createdAt image bedrooms bathrooms area views"
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
        "_id title location price status type createdAt image bedrooms bathrooms area views"
      )
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

// Service to get a property by its ID with Redis caching and view count increment
const getPropertyById = async (
  propertyId: string
): Promise<IProperty | null> => {
  const cacheKey = `property:${propertyId}`;

  try {
    const cachedProperty = await redis.get(cacheKey);

    if (cachedProperty) {
      await incrementViewCount(propertyId);
      const updatedProperty = await Property.findById(propertyId);

      // Update the cache with the fresh data
      if (updatedProperty) {
        await redis.setex(cacheKey, 3600, JSON.stringify(updatedProperty));
      }

      return updatedProperty;
    }

    // If not in cache, get from database
    const property = await Property.findById(propertyId);

    if (property) {
      await incrementViewCount(propertyId);
      const updatedProperty = await Property.findById(propertyId);
      if (updatedProperty) {
        await redis.setex(cacheKey, 3600, JSON.stringify(updatedProperty));
      }
      return updatedProperty;
    }

    return property;
  } catch (error) {
    console.error("Redis error in getPropertyById:", error);
    await incrementViewCount(propertyId);
    await new Promise((resolve) => setTimeout(resolve, 10));
    return Property.findById(propertyId);
  }
};

// Service to update a property - also update cache
const updateProperty = async (
  propertyId: string,
  propertyData: Partial<IProperty>
): Promise<IProperty | null> => {
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
const deleteProperty = async (
  propertyId: string
): Promise<IProperty | null> => {
  const deletedProperty = await Property.findByIdAndDelete(propertyId);

  if (deletedProperty) {
    // Remove the property from cache
    const cacheKey = `property:${propertyId}`;
    await redis.del(cacheKey);
  }

  return deletedProperty;
};

export default {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  incrementViewCount,
};
