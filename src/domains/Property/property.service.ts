import Property from "./property.model";

// Service to create a new property
const createProperty = async (propertyData: any) => {
  const newProperty = new Property(propertyData);
  await newProperty.save();
  return newProperty;
};

// Service to get all properties
const getAllProperties = async () => {
  return Property.find();
};

// Service to get a property by its ID
const getPropertyById = async (propertyId: string) => {
  return Property.findById(propertyId);
};

// Service to update a property
const updateProperty = async (propertyId: string, propertyData: any) => {
  return Property.findByIdAndUpdate(propertyId, propertyData, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validators are run
  });
};

// Service to delete a property
const deleteProperty = async (propertyId: string) => {
  return Property.findByIdAndDelete(propertyId);
};

export default {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
