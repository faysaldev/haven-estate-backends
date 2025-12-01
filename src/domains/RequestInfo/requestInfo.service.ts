import RequestInfo, { IRequestInfo } from "./requestInfo.model";

interface GetRequestInfoOptions {
  page: number;
  limit: number;
  status?: string;
  property_id?: string;
}

// Service to create a new request info
const createRequestInfo = async (
  requestInfoData: Partial<IRequestInfo>
): Promise<IRequestInfo> => {
  const newRequestInfo = new RequestInfo(requestInfoData);
  await newRequestInfo.save();
  return newRequestInfo;
};

// Service to get all request info with filtering and pagination
const getAllRequestInfo = async (
  options: GetRequestInfoOptions
): Promise<{
  data: IRequestInfo[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}> => {
  const { page, limit, status, property_id } = options;

  // Build filter object
  const filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (property_id) {
    filter.property_id = property_id;
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const totalCount = await RequestInfo.countDocuments(filter);

  // Get filtered and paginated results
  const requestInfoList = await RequestInfo.find(filter)
    .populate(
      "property_id",
      "title location price status type createdAt image bedrooms bathrooms area"
    )
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // Sort by newest first

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: requestInfoList,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
    },
  };
};

// Service to get a request info by its ID
const getRequestInfoById = async (
  requestInfoId: string
): Promise<IRequestInfo | null> => {
  return await RequestInfo.findById(requestInfoId).populate(
    "property_id",
    "title location price status type createdAt image bedrooms bathrooms area"
  );
};

// Service to update status of a request info
const updateRequestInfoStatus = async (
  requestInfoId: string,
  status: "unread" | "read" | "archived"
): Promise<IRequestInfo | null> => {
  return await RequestInfo.findByIdAndUpdate(
    requestInfoId,
    { status },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators are run
    }
  );
};

// Service to delete a request info
const deleteRequestInfo = async (
  requestInfoId: string
): Promise<IRequestInfo | null> => {
  return await RequestInfo.findByIdAndDelete(requestInfoId);
};

export default {
  createRequestInfo,
  getAllRequestInfo,
  getRequestInfoById,
  deleteRequestInfo,
  updateRequestInfoStatus,
};
