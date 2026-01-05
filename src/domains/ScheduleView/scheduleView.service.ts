import ScheduleView, { IScheduleView } from "./scheduleView.model";

interface GetScheduleViewOptions {
  page: number;
  limit: number;
  status?: string;
  property_id?: string;
}

// Service to create a new schedule view
const createScheduleView = async (
  scheduleViewData: Partial<IScheduleView>
): Promise<IScheduleView> => {
  const newScheduleView = new ScheduleView(scheduleViewData);
  await newScheduleView.save();
  return newScheduleView;
};

// Service to get all schedule views with filtering and pagination
const getAllScheduleViews = async (
  options: GetScheduleViewOptions
): Promise<{
  data: IScheduleView[];
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
  const totalCount = await ScheduleView.countDocuments(filter);

  // Get filtered and paginated results
  const scheduleViews = await ScheduleView.find(filter)
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
    data: scheduleViews,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
    },
  };
};
// Service to get all schedule views with filtering and pagination
const getMyScheduleViews = async (
  options: GetScheduleViewOptions
): Promise<{
  data: IScheduleView[];
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
  const totalCount = await ScheduleView.countDocuments(filter);

  // Get filtered and paginated results
  const scheduleViews = await ScheduleView.find(filter)
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
    data: scheduleViews,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
    },
  };
};

// Service to get a schedule view by its ID
const getScheduleViewById = async (
  scheduleViewId: string
): Promise<IScheduleView | null> => {
  return await ScheduleView.findById(scheduleViewId).populate(
    "property_id",
    "title location price status type createdAt image bedrooms bathrooms area"
  );
};

// Service to update status of a schedule view
const updateScheduleViewStatus = async (
  scheduleViewId: string,
  status: "Scheduled" | "Completed" | "Cancelled"
): Promise<IScheduleView | null> => {
  return await ScheduleView.findByIdAndUpdate(
    scheduleViewId,
    { status },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators are run
    }
  );
};

// Service to delete a schedule view
const deleteScheduleView = async (
  scheduleViewId: string
): Promise<IScheduleView | null> => {
  return await ScheduleView.findByIdAndDelete(scheduleViewId);
};

export default {
  createScheduleView,
  getAllScheduleViews,
  getScheduleViewById,
  deleteScheduleView,
  updateScheduleViewStatus,
  getMyScheduleViews,
};
