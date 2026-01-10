import User from "./user.model";

const getAllUsers = async () => {
  return await User.find();
};

const userDetails = async (userId: string) => {
  return await User.findById(userId).select(
    "email name phoneNumber role image isEmailVerified"
  );
};
const userDetailsUpdated = async (userId: string, details: any) => {
  return await User.findByIdAndUpdate(userId, details);
};

const userService = {
  getAllUsers,
  userDetails,
  userDetailsUpdated,
};

export default userService;
