const mongoose = require("mongoose");

const scheduleViewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    view_date: { type: Date, required: true },

    // Store time as HH:mm or HH:mm:ss
    view_time: { type: String, required: true },

    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true }
);

const ScheduleView = mongoose.model("ScheduleView", scheduleViewSchema);
export default ScheduleView;
