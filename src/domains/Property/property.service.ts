// import redis from "../../config/redis";
import Property, { IProperty } from "./property.model";
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
    // for Redis
    // await redis.del(cacheKey);
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
    // TODO: redis Try to get cached result first
    // const cachedResult = await redis.get(cacheKey);
    // if (cachedResult) {
    //   return JSON.parse(cachedResult);
    // }

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
        "_id title location price status type createdAt images bedrooms bathrooms area views"
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

    // TODO: redis Cache the result for 30 minutes (1800 seconds)
    // await redis.setex(cacheKey, 1800, JSON.stringify(result));

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
// Service to get Featured properties with filtering and pagination
const featuredProperties = async () => {
  // Create cache key based on query parameters
  const cacheKey = `featured_properties_home`;

  try {
    // TODO: redis Try to get cached result first
    // const cachedResult = await redis.get(cacheKey);
    // if (cachedResult) {
    //   return JSON.parse(cachedResult);
    // }

    // Aggregate properties with their booking and schedule view counts
    let propertiesWithActivity = await Property.aggregate([
      {
        $lookup: {
          from: "bookings", // collection name for Bookings
          localField: "_id",
          foreignField: "property",
          as: "bookingCount",
        },
      },
      {
        $lookup: {
          from: "scheduleviews", // collection name for ScheduleView
          localField: "_id",
          foreignField: "property_id",
          as: "scheduleViewCount",
        },
      },
      {
        $addFields: {
          totalActivity: {
            $add: [{ $size: "$bookingCount" }, { $size: "$scheduleViewCount" }],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          location: 1,
          price: 1,
          status: 1,
          type: 1,
          createdAt: 1,
          images: 1,
          bedrooms: 1,
          bathrooms: 1,
          area: 1,
          views: 1,
        },
      },
      { $sort: { totalActivity: -1, createdAt: -1 } }, // Sort by activity first, then by newest
      { $limit: 5 }, // Return maximum 5 properties
    ]);

    // If we have fewer than 5 properties, supplement with random properties
    if (propertiesWithActivity.length < 5) {
      const neededProperties = 5 - propertiesWithActivity.length;
      const existingIds = propertiesWithActivity.map((prop) => prop._id);

      // Find random properties that are not already in the activity results
      const randomProperties = await Property.aggregate([
        { $match: { _id: { $nin: existingIds } } },
        { $sample: { size: neededProperties } },
        {
          $project: {
            _id: 1,
            title: 1,
            location: 1,
            price: 1,
            status: 1,
            type: 1,
            createdAt: 1,
            images: 1,
            bedrooms: 1,
            bathrooms: 1,
            area: 1,
            views: 1,
          },
        },
      ]);

      // Combine the activity-based properties with random properties
      propertiesWithActivity = [...propertiesWithActivity, ...randomProperties];
    }

    const result = {
      data: propertiesWithActivity,
    };

    // TODO: redis Cache the result for 20 minutes (1200 seconds)
    // await redis.setex(cacheKey, 1200, JSON.stringify(result));

    return result;
  } catch (error) {
    // Fallback to returning random properties if aggregation fails
    const properties = await Property.aggregate([
      { $sample: { size: 5 } }, // Get 5 random properties
      {
        $project: {
          _id: 1,
          title: 1,
          location: 1,
          price: 1,
          status: 1,
          type: 1,
          createdAt: 1,
          images: 1,
          bedrooms: 1,
          bathrooms: 1,
          area: 1,
          views: 1,
        },
      },
    ]);

    return {
      data: properties,
    };
  }
};
// Service to get all properties with filtering and pagination
const getAllAdminProperties = async (
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
    // TODO: redis Try to get cached result first
    // const cachedResult = await redis.get(cacheKey);
    // if (cachedResult) {
    //   return JSON.parse(cachedResult);
    // }

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

    // TODO: redis Cache the result for 30 minutes (1800 seconds)
    // await redis.setex(cacheKey, 1800, JSON.stringify(result));

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
    // TODO: redis
    // const cachedProperty = await redis.get(cacheKey);

    // if (cachedProperty) {
    //   await incrementViewCount(propertyId);
    //   return JSON.parse(cachedProperty);
    // }

    // If not in cache, get from database with agent populated
    const property = await Property.findById(propertyId).populate(
      "agent",
      "name number email"
    );

    if (property) {
      // Increment view count after fetching the property
      await incrementViewCount(propertyId);

      // TODO: redis Update the cache with the fresh data including populated agent
      // await redis.setex(cacheKey, 3600, JSON.stringify(property));

      return property;
    }

    return property;
  } catch (error) {
    console.error("Redis error in getPropertyById:", error);
    // In case of Redis error, fetch from database with populated agent
    await incrementViewCount(propertyId);
    return Property.findById(propertyId).populate("agent", "name number email");
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
    // TODO: redis
    // await redis.del(cacheKey);
  }

  return updatedProperty;
};

// Service to delete a property - also remove from cache
const deleteProperty = async (
  propertyId: string
): Promise<IProperty | null> => {
  const deletedProperty = await Property.findByIdAndDelete(propertyId);

  if (deletedProperty) {
    // TODO: redis Remove the property from cache
    const cacheKey = `property:${propertyId}`;
    // await redis.del(cacheKey);
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
  getAllAdminProperties,
  featuredProperties,
};
